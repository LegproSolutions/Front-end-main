import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "../../utils/axiosConfig"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, User, Mail, Phone, Building2, Users2, Target, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

const backendUrl = import.meta.env?.VITE_API_URL;

const RecruiterLogin = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const { setCompanyData, setIsAuthenticated, fetchStats } = useContext(AppContext);
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    let errorMsg = "";
    if (fieldName === "name") {
      if (state === "signup") {
        if (!value.trim()) {
          errorMsg = "Please enter a valid company name";
        } else {
          const nameRegex = /^[A-Za-z\s&.\-]+$/;
          const hasLetter = /[A-Za-z]/.test(value);
          if (value.trim().length < 3 || !nameRegex.test(value) || !hasLetter) {
            errorMsg = "Please enter a valid company name";
          }
        }
      }
    } else if (fieldName === "email") {
      if (!value.trim()) {
        errorMsg = "Please enter a valid email address";
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Please enter a valid email address";
        }
      }
    } else if (fieldName === "phone") {
      if (state === "signup") {
        if (!value.trim()) {
          errorMsg = "Please enter a Indian mobile number";
        } else {
          let cleanVal = value.replace(/\s+/g, '');
          if (cleanVal.startsWith("+91")) {
            cleanVal = cleanVal.slice(3);
          } else if (cleanVal.startsWith("91") && cleanVal.length === 12) {
            cleanVal = cleanVal.slice(2);
          }
          const phoneRegex = /^[6-9]\d{9}$/;
          if (cleanVal.length !== 10 || !phoneRegex.test(cleanVal)) {
            errorMsg = "Please enter a valid Indian mobile number";
          }
        }
      }
    } else if (fieldName === "password") {
      if (state === "signup") {
        if (!value) {
          errorMsg = "Password must contain uppercase, lowercase, number and special character";
        } else {
          const hasUpper = /[A-Z]/.test(value);
          const hasLower = /[a-z]/.test(value);
          const hasDigit = /\d/.test(value);
          const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value);
          if (value.length < 8 || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            errorMsg = "Password must contain uppercase, lowercase, number and special character";
          }
        }
      } else if (state === "login") {
        if (!value) {
          errorMsg = "Password is required";
        }
      }
    } else if (fieldName === "image") {
      if (state === "signup") {
        if (!value) {
          errorMsg = "Please upload a company logo";
        } else {
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
          if (!allowedTypes.includes(value.type)) {
            errorMsg = "Only JPG, JPEG, PNG, and WEBP files are allowed";
          } else if (value.size > 5 * 1024 * 1024) {
            errorMsg = "Logo size must be less than 5MB";
          }
        }
      }
    }
    setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
    return errorMsg;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    validateField("name", val);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateField("email", val);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    validateField("phone", val);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    validateField("password", val);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    validateField("image", file);
  };

  useEffect(() => {
    // Prevent scrolling when Recruiter modal is open
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);


  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === "signup") {
      const nameErr = validateField("name", name);
      const emailErr = validateField("email", email);
      const phoneErr = validateField("phone", phone);
      const passErr = validateField("password", password);
      const imgErr = validateField("image", image);

      if (nameErr || emailErr || phoneErr || passErr || imgErr) {
        setLoading(false);
        return;
      }
    } else if (state === "login") {
      const emailErr = validateField("email", email);
      const passErr = validateField("password", password);

      if (emailErr || passErr) {
        setLoading(false);
        return;
      }
    } else if (state === "forgot") {
      const emailErr = validateField("email", email);
      if (emailErr) {
        setLoading(false);
        return;
      }
    }
    setLoading(true);

    try {
      if (state === "login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          if (data.requirePasswordChange) {
            setCompanyId(data.companyId);
            setState("updatePassword");
            setPassword("");
            toast.success("Please update your password to continue.");
            setLoading(false);
            return;
          }

          localStorage.setItem("bool", true);
          setCompanyData(data.company);
          setIsAuthenticated(true);
          toast.success("Logged in successfully!");
          onClose();
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else if (state === "signup") {
        


        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.success) {
          localStorage.setItem("bool", true);
          setCompanyData(data.company);
          setIsAuthenticated(true);
          await fetchStats();
          toast.success("Successfully registered! Welcome to your dashboard.");
          onClose();
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else if (state === "forgot") {
        const { data } = await axios.post(
          `${backendUrl}/api/company/forgot-password`,
          {
            email,
          }
        );

        if (data.success) {
          toast.success(data.message || "Temporary password sent to your email!");
          setState("login");
        } else {
          toast.error(data.message);
        }
      } else if (state === "updatePassword") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        const { data } = await axios.post(
          `${backendUrl}/api/company/update-password`,
          { companyId, newPassword: password }
        );

        if (data.success) {
          localStorage.setItem("bool", true);
          setCompanyData(data.company);
          setIsAuthenticated(true);
          toast.success("Password updated successfully!");
          onClose();
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error in API call:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Recruiter Authentication</DialogTitle>
          <DialogDescription>Sign in or register your company to find top talent on Job Mela</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-[700px]">
          {/* Left side - Features */}
          <div className="relative hidden md:flex w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-8 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-32 h-32 bg-white/10 rounded-full top-10 left-10"></div>
              <div className="absolute w-24 h-24 bg-white/5 rounded-full bottom-20 right-20"></div>
              <div className="absolute w-16 h-16 bg-white/5 rounded-full bottom-10 left-10"></div>
              <div className="absolute w-20 h-20 bg-white/10 rounded-full top-32 right-10"></div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold">Job Mela Recruiters</h1>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Users2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Find Top Talent</h3>
                      <p className="text-green-100">Access a vast pool of skilled professionals ready for their next opportunity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Smart Matching</h3>
                      <p className="text-green-100">Our AI-powered platform matches the right candidates to your job requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Easy Management</h3>
                      <p className="text-green-100">Streamline your hiring process with our comprehensive recruitment tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2 p-6 bg-white overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold">
                  {state === "login"
                    ? "Welcome Back, Recruiter"
                    : state === "signup"
                    ? "Join Job Mela as Recruiter"
                    : state === "updatePassword"
                    ? "Update Password"
                    : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {state === "login"
                    ? "Sign in to your recruiter account"
                    : state === "signup"
                    ? "Create your company account and start hiring top talent"
                    : state === "updatePassword"
                    ? "Set a new password for your account"
                    : "Enter your email to reset your password"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {state === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          type="text"
                          value={name}
                          name="name"
                          onChange={handleNameChange}
                          className="pl-10"
                          placeholder="Enter your company name"
                          required
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                  )}

                  {state !== "updatePassword" && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          name="email"
                          onChange={handleEmailChange}
                          className="pl-10"
                          placeholder="company@example.com"
                          required
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  )}

                  {state === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          name="phone"
                          onChange={handlePhoneChange}
                          className="pl-10"
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}



                  {state !== "forgot" && state !== "updatePassword" && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          name="password"
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10"
                          placeholder="********"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                  )}

                  {state === "updatePassword" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            placeholder="New Password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10"
                            placeholder="Confirm New Password"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {state === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyLogo">Company Logo</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center overflow-hidden bg-muted/10">
                            {image ? (
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Company Logo"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Upload className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              id="companyLogo"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload your company logo (JPG, PNG)
                            </p>
                          </div>
                        </div>
                      </div>
                      {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>
                  )}

                  {state === "login" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setState("forgot")}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    variant={state === "signup" ? "default" : "default"}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : state === "login" ? (
                      "Sign In"
                    ) : state === "signup" ? (
                      "Create Account"
                    ) : state === "updatePassword" ? (
                      "Update Password"
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm mt-4">
                  {state === "login" ? (
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("signup")}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : state === "signup" ? (
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("login")}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setState("login")}
                      className="text-primary hover:underline"
                    >
                      Back to Login
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterLogin;

import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, User, Briefcase, Users, Trophy, Phone } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
const backendUrl = import.meta.env?.VITE_API_URL;

const UserLogin = ({ isOpen, onClose }) => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "" });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, password: false });

  useEffect(() => {
    setTouched({ name: false, email: false, phone: false, password: false });
    setErrors({ name: "", email: "", phone: "", password: "" });
  }, [state]);

  useEffect(() => {
    if (state !== "signup") return;

    const newErrors = {};

    // 1. Full Name Validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name || name.trim().length < 3 || !nameRegex.test(name)) {
      newErrors.name = "Please enter a valid full name";
    } else {
      newErrors.name = "";
    }

    // 2. Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      newErrors.email = "";
    }

    // 3. Phone Validation
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = "Please enter a valid Indian mobile number";
    } else {
      newErrors.phone = "";
    }

    // 4. Password Validation
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (
      !password ||
      password.length < 8 ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecial
    ) {
      newErrors.password = "Password must contain uppercase, lowercase, number and special character";
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
  }, [name, email, phone, password, state]);

  // Using user-specific state setters from AppContext
  const context = useContext(AppContext);
  
  if (!context) {
    console.error("UserLogin: AppContext is undefined! Ensure UserLogin is wrapped in AppContextProvider.");
    return null;
  }

  const {
    fetchUserFromCookie,
    setShowUserLogin,
    setUserData,
    setIsUserAuthenticated,
    fetchUserJobApplications,
    fetchStats,
    userLoginState,
  } = context;

  useEffect(() => {
    if (isOpen && userLoginState) {
      setState(userLoginState);
    }
  }, [isOpen, userLoginState]);
  // 👇 Google Auth response handler
  const responseGoogle = async (authResult) => {
    console.log("Google Auth Result:", authResult);
    try {

      if (authResult?.code) {
        // Sending the authorization code to the backend using axios
        const result = await axios.post(`${backendUrl}/api/users/google-auth`, {
          code: authResult.code, // Sending the Google OAuth code to the backend
        });

        const { name, email, image } =  result.data.user;

        const userObj = { name, email, image };

        setUserData(userObj);
        fetchUserFromCookie();

        localStorage.setItem("boolC", JSON.stringify(true));
        setIsUserAuthenticated(true);
        await fetchUserJobApplications();

        toast.success("Google login successful!");
        setShowUserLogin(false);
        onClose();
        // navigate("/dashboard");
        // optional based on flow
      }
    } catch (error) {
      console.error("Google Auth error:", error);
      toast.error("Google login failed. Try again.");
    }
  };
  // 👇 Google Login hook
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 👇 Call this in JSX or a button:
  const handleGoogleLogin = () => {
    googleLogin(); // triggers the Google OAuth popup
  };
  

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === "signup") {
      setTouched({ name: true, email: true, phone: true, password: true });

      const newErrors = {};
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!name || name.trim().length < 3 || !nameRegex.test(name)) {
        newErrors.name = "Please enter a valid full name";
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!email || !emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }

      const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
      if (!phone || !phoneRegex.test(phone)) {
        newErrors.phone = "Please enter a valid Indian mobile number";
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      if (
        !password ||
        password.length < 8 ||
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecial
      ) {
        newErrors.password = "Password must contain uppercase, lowercase, number and special character";
      }

      setErrors(newErrors);

      if (
        newErrors.name ||
        newErrors.email ||
        newErrors.phone ||
        newErrors.password
      ) {
        return;
      }
    } else {
      // Basic email validation for non-signup
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setLoading(true);

    try {
      if (state === "login") {
        // User Login API call
        const { data } = await axios.post(
          `${backendUrl}/api/users/user-login`,
          { email, password }
        );
        // ✅ this triggers update in EductionForm
        // navigate or do whatever next
        if (data.success) {
          if (data.requirePasswordUpdate) {
            toast.success("Please update your temporary password.");
            setPassword(""); // clear temp password
            setTouched((prev) => ({ ...prev, password: false }));
            setState("update_password");
          } else {
            localStorage.setItem("boolC", JSON.stringify(true));
            fetchUserFromCookie();
            setUserData(data.user);
            setIsUserAuthenticated(true);
            await fetchUserJobApplications();
            toast.dismiss();
            toast.success("Logged in successfully!");
            setShowUserLogin(false);
            onClose();
          }
        } else {
          toast.error(data.message);
        }
      } else if (state === "signup") {
        // User Signup API call
        const { data } = await axios.post(
          `${backendUrl}/api/users/user-register`,
          { name, email, phone, password }
        );

        if (data.success) {
          localStorage.setItem("boolC", JSON.stringify(true));
          fetchUserFromCookie();
          setUserData(data.user);
          setIsUserAuthenticated(true);
          if (fetchStats) {
            fetchStats();
          }
          toast.success("Account created successfully!");
          setShowUserLogin(false);
          onClose();
        } else {
          toast.error(data.message);
        }
      } else if (state === "forgot") {
        // Forgot Password API call
        const { data } = await axios.post(
          `${backendUrl}/api/users/forgot-password`,
          { email }
        );

        if (data.success) {
          toast.success("Password reset link sent to your email!");
          setState("login");
        } else {
          toast.error(data.message);
        }
      } else if (state === "update_password") {
        const { data } = await axios.post(
          `${backendUrl}/api/users/update-password`,
          { newPassword: password },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success("Password updated successfully!");
          localStorage.setItem("boolC", JSON.stringify(true));
          fetchUserFromCookie();
          const userResp = await axios.get(`${backendUrl}/api/users/user`, { withCredentials: true });
          if (userResp.data.success) {
             setUserData(userResp.data.user);
          }
          setIsUserAuthenticated(true);
          await fetchUserJobApplications();
          setShowUserLogin(false);
          onClose();
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
          <DialogTitle>User Authentication</DialogTitle>
          <DialogDescription>Sign in or create a new account to access Job Mela</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-[600px]">
          {/* Left side - Features */}
          <div className="relative hidden md:flex w-1/2 bg-legpro-primary p-8 text-white overflow-hidden">
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
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold">Job Mela</h1>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Connect with Top Companies</h3>
                      <p className="text-blue-100">Join thousands of professionals finding their dream jobs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Career Growth</h3>
                      <p className="text-blue-100">Unlock opportunities that match your skills and aspirations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Easy Applications</h3>
                      <p className="text-blue-100">Apply to multiple jobs with just one click</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2 p-8 bg-white">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold">
                  {state === "login"
                    ? "Welcome Back"
                    : state === "signup"
                    ? "Create Account"
                    : state === "update_password"
                    ? "Update Password"
                    : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {state === "login"
                    ? "Sign in to your Job Mela account"
                    : state === "signup"
                    ? "Join Job Mela and discover your next opportunity"
                    : state === "update_password"
                    ? "Please choose a new secure password"
                    : "Enter your email to reset your password"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {state === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setTouched((prev) => ({ ...prev, name: true }));
                          }}
                          className="pl-10"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      {touched.name && errors.name && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setTouched((prev) => ({ ...prev, email: true }));
                        }}
                        className="pl-10"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    {state === "signup" && touched.email && errors.email && (
                      <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>
                    )}
                  </div>

                  {state === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone No.</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="text"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setTouched((prev) => ({ ...prev, phone: true }));
                          }}
                          className="pl-10"
                          placeholder="+91 xxxxxxxxxx"
                          required
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>
                      )}
                    </div>
                  )}

                  {state !== "forgot" && (
                    <div className="space-y-2">
                      <Label htmlFor="password">{state === "update_password" ? "New Password" : "Password"}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setTouched((prev) => ({ ...prev, password: true }));
                          }}
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
                      {state === "signup" && touched.password && errors.password && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.password}</p>
                      )}
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
                      "Login"
                    ) : state === "signup" ? (
                      "Create Account"
                    ) : state === "update_password" ? (
                      "Update Password"
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>

                <div className="space-y-2 mt-4">
                  {state === "login" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setState("signup")}
                      className="w-full"
                    >
                      Register
                    </Button>
                  ) : state === "signup" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setState("login")}
                      className="w-full"
                    >
                      Login
                    </Button>
                  ) : (
                    <div className="text-center text-sm">
                      <button
                        type="button"
                        onClick={() => setState("login")}
                        className="text-primary hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}
                  {state === "update_password" && (
                    <div className="text-center text-sm mt-4">
                      <button
                        type="button"
                        onClick={async () => {
                          // Logout and go back to login
                          await axios.post(`${backendUrl}/api/users/user-logout`);
                          setState("login");
                        }}
                        className="text-primary hover:underline"
                      >
                        Cancel and Logout
                      </button>
                    </div>
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

export default UserLogin;

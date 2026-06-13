import React, { useState, useContext, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, KeyRound, Shield, Settings, BarChart3, Users } from "lucide-react";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

const backendUrl = import.meta.env?.VITE_API_URL;


const AdminLogin = ({ isOpen, onClose }) => {

    const {
      isAdminAuthenticated,setIsAdminAuthenticated
    } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passKey, setPassKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const invalidCharRegex = /[^A-Za-z\d@$!%*?&]/g;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const invalidMatches = password.match(invalidCharRegex);
    if (invalidMatches) {
      const uniqueInvalids = [...new Set(invalidMatches)];
      toast.error(
        `${uniqueInvalids.join(", ")}: Invalid character${
          uniqueInvalids.length > 1 ? "s" : ""
        }. Allowed only: @ $ ! % * ? &`
      );
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
        passKey,
      });

      if (data.success) {
        localStorage.setItem("boolAP", true);
        localStorage.setItem("admin_data", JSON.stringify(data.admin));
        localStorage.setItem("auth_token", data.token || ""); // Ensure token is also saved if returned
        setIsAdminAuthenticated(true);
        toast.success("Admin Logged in successfully!");
        onClose();
        navigate("/admin/dashboard", { replace: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Admin Authentication</DialogTitle>
          <DialogDescription>Secure access to the Job Mela administration panel</DialogDescription>
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
                    <Shield className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold">Job Mela Admin</h1>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Platform Analytics</h3>
                      <p className="text-purple-100">Monitor job postings, user activity, and platform performance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">User Management</h3>
                      <p className="text-purple-100">Manage users, companies, and maintain platform quality</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm mt-1">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">System Control</h3>
                      <p className="text-purple-100">Configure platform settings and maintain system health</p>
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
                <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                <CardDescription>
                  Enter your administrative credentials to access Job Mela dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="admin@jobmela.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passKey">Admin Pass Key</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="passKey"
                        type="text"
                        value={passKey}
                        name="passKey"
                        onChange={(e) => setPassKey(e.target.value)}
                        className="pl-10"
                        placeholder="Enter administrative pass key"
                        required
                      />
                    </div>
                  </div>

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
                        Authenticating...
                      </span>
                    ) : (
                      "Access Admin Panel"
                    )}
                  </Button>
                </form>

                <div className="text-center text-xs text-muted-foreground mt-4">
                  <p>
                    Secure administrative access to Job Mela platform
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
};

export default AdminLogin;

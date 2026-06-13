import { useState } from "react";
import { useAuth } from "@/crm/contexts/AuthContext";
import { api } from "@/crm/lib/api";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/crm/components/ui/input";
import { Label } from "@/crm/components/ui/label";
import { Button } from "@/crm/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/crm/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/crm/components/ui/dialog";
import { Building2, Mail, Phone, LifeBuoy, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/crm" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      toast.success("Welcome back!");
      if (!window.location.pathname.startsWith("/dashboard/crm")) {
        navigate("/dashboard/crm");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to JobMela</CardTitle>
          <CardDescription>Enter your credentials to access the CRM</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-900"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-6 grid gap-3 sm:grid-cols-2">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={() => setSupportOpen(true)}>
              Technical Support
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="max-w-md p-6 md:p-8 rounded-2xl bg-white border border-slate-200">
          <DialogHeader className="flex flex-col items-center border-b pb-4 mb-4">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-blue-700" /> Technical Support
            </DialogTitle>
            <DialogDescription className="text-sm text-center text-slate-600">
              Reach out for any CRM assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-slate-700" />
              <span className="text-sm">prashant@legpro.co.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-700" />
              <span className="text-sm">+91-7303086551</span>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 mt-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => setSupportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

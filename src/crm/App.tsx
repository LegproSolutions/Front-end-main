import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/crm/components/ui/sonner";
import { Toaster } from "@/crm/components/ui/toaster";
import { TooltipProvider } from "@/crm/components/ui/tooltip";
import { BotAssistant } from "@/crm/components/BotAssistant";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Pipeline from "./pages/Pipeline";
import Jobs from "./pages/Jobs";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import SettingsPage from "./pages/SettingsPage";
import JobMelaIntegration from "./pages/JobMelaIntegration";
import CallingPortal from "./pages/CallingPortal";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading JobMela...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
            <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/integrations/jobmela" element={<ProtectedRoute><JobMelaIntegration /></ProtectedRoute>} />
            <Route path="/calling-portal" element={<ProtectedRoute><CallingPortal /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BotAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

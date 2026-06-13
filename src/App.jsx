import React, { useContext } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import JobsPage from "./pages/JobsPage";
import Application from "./pages/User/Application.jsx";
import ApplyJob from "./pages/User/ApplyJob.jsx";
import RecruiterLogin from "./Components/Auth/RecruiterLogin.jsx";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Recruiter/Dashboard.jsx";
import AddJobs from "./pages/Recruiter/AddJobs.jsx";
import ManageJobs from "./pages/Recruiter/ManageJobs.jsx";
import ViewApplications from "./pages/Recruiter/ViewApplications.jsx";
import "quill/dist/quill.snow.css";
import ApplyJobForm from "./pages/User/ApplyJobForm.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import UserPrivateRoute from "./Routes/UserPrivateRoute.jsx";
import RecruiterPublicRoute from "./Routes/RecruiterPublicRoute.jsx";
import UserProfile from "./pages/User/UserProfile.jsx";
import UserLogin from "./Components/Auth/UserLogin.jsx";
import JobDetails from "./pages/JobDetails";
import Unauthorized from "./Components/UnAuthorised/Unauthorized.jsx";
import NotFound from "./pages/Error/NotFound.jsx";
import EditJob from "./pages/Recruiter/EditJob.jsx";
import PostJobLanding from "./pages/Recruiter/PostJobLanding.jsx";
import CompanyProfile from "./pages/Recruiter/CompanyProfile.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ClipLoader from "react-spinners/ClipLoader.js";
import AdminLogin from "./Components/Auth/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import JobDetailsPage from "./pages/Admin/JobDetailsPage.jsx";
import AdminPrivateRoute from "./Routes/AdminPrivateRoute.jsx";
import CRMPrivateRoute from "./Routes/CRMPrivateRoute.jsx";
import UserProfileFetch from "./pages/Admin/UserProfile.jsx";
import AppliedJobsPage from "./pages/Admin/AppliedJobsPage.jsx";
import RecruiterJobPostsPage from "./pages/Admin/RecruiterJobPostsPage.jsx";
import ApplicantsPage from "./pages/Admin/ApplicantsPage.jsx";
import PrivacyInfo from "./Components/privacyInfo.jsx";
import CookiePolicy from "./Components/cookie.jsx";
import TermsAndConditions from "./Components/terms.jsx";
import ContactUs from "./Components/contactus.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "./crm/components/ui/sonner";
import { Toaster as ShadcnToaster } from "./crm/components/ui/toaster";
import { TooltipProvider } from "./crm/components/ui/tooltip";

// CRM Pages
import CRMDashboard from "./crm/pages/Dashboard";
import CRMCandidates from "./crm/pages/Candidates";
import CRMPipeline from "./crm/pages/Pipeline";
import CRMClients from "./crm/pages/Clients";
import CRMClientDetail from "./crm/pages/ClientDetail";
import CRMSettings from "./crm/pages/SettingsPage";
import CRMCallingPortal from "./crm/pages/CallingPortal";
import CRMJobs from "./crm/pages/Jobs";
import CRMReports from "./crm/pages/Reports";
import CRMCommunications from "./crm/pages/Communications";
import CRMManagerAssignmentDashboard from "./crm/pages/ManagerAssignmentDashboard";
import { AuthProvider } from "./crm/contexts/AuthContext";

const queryClient = new QueryClient();

// import VerifyJobPosts from "./pages/Admin/PostVerifactionPage.jsx";
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
const App = () => {
  const location = useLocation();
  React.useEffect(() => {
    const prev = sessionStorage.getItem("currentPath");
    if (prev && prev !== location.pathname && prev !== "/profile") {
      sessionStorage.setItem("previousPath", prev);
    }
    sessionStorage.setItem("currentPath", location.pathname);
  }, [location.pathname]);

  const {
    showRecruiterLogin,
    setShowRecruiterLogin,
    showAdminLogin,
    setShowAdminLogin,
    showUserLogin,
    setShowUserLogin,
    isUserAuthLoading,
  } = useContext(AppContext);

  // Global Loader for initial page load
  if (isUserAuthLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#123abc" size={100} />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <TooltipProvider>
          <div>
            {/* Recruiter Login Popup */}
            {showRecruiterLogin && (
              <RecruiterLogin
                isOpen={showRecruiterLogin}
                onClose={() => setShowRecruiterLogin(false)}
              />
            )}

            {/* User Login Popup */}
            {showUserLogin && (
              <UserLogin
                isOpen={showUserLogin}
                onClose={() => setShowUserLogin(false)}
              />
            )}

            {/* Recruiter Login Popup */}
            {showAdminLogin && (
              <AdminLogin
                isOpen={showAdminLogin}
                onClose={() => setShowAdminLogin(false)}
              />
              // <>
              // {/* <AdminDashboard/>
              // <JobDetailsPage /> */}
              // </>
            )}

            {/* Page Routes */}
            <Routes>
              {/* Public Routes */}
              <Route element={<RecruiterPublicRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobsPage />} />
              </Route>
              <Route path="/unauth" element={<Unauthorized />} />
              <Route path="/post-jobs" element={<PostJobLanding />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/job-details/:id" element={<JobDetails />} />
              {/* Protected User Routes */}
              <Route element={<UserPrivateRoute />}>
                <Route path="/application" element={<Application />} />
                <Route path="/apply-job/:id" element={<ApplyJob />} />
                <Route path="/apply-job-form/:id" element={<ApplyJobForm />} />
                <Route path="/profile" element={<UserProfile />} />
              </Route>
              <Route path="/job-details/:id" element={<JobDetails />} />
              {/* Protected Recruiter Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="add-job" element={<AddJobs />} />
                  <Route
                    path="preview-job/:id"
                    element={<ApplyJob previewMode={true} />}
                  />
                  <Route path="edit-job/:id" element={<EditJob />} />
                  <Route path="manage-jobs" element={<ManageJobs />} />
                  <Route path="view-applications" element={<ViewApplications />} />
                  <Route path="profile" element={<CompanyProfile />} />
                </Route>

                {/* Employer CRM Integrated Routes (Independent from Recruiter Dashboard layout) */}
                <Route element={<AuthProviderWrapper />}>
                  <Route element={<CRMPrivateRoute />}>
                    <Route path="/dashboard/crm" element={<CRMDashboard />} />
                    <Route path="/dashboard/crm/candidates" element={<CRMCandidates />} />
                    <Route path="/dashboard/crm/jobs" element={<CRMJobs />} />
                    <Route path="/dashboard/crm/pipeline" element={<CRMPipeline />} />
                    <Route path="/dashboard/crm/clients" element={<CRMClients />} />
                    <Route path="/dashboard/crm/clients/:id" element={<CRMClientDetail />} />
                    <Route path="/dashboard/crm/settings" element={<CRMSettings />} />
                    <Route path="/dashboard/crm/assignment-performance" element={<CRMManagerAssignmentDashboard />} />
                    <Route path="/dashboard/crm/calling-portal" element={<CRMCallingPortal />} />
                    <Route path="/dashboard/crm/reports" element={<CRMReports />} />
                    <Route path="/dashboard/crm/communications" element={<CRMCommunications />} />
                  </Route>
                </Route>
              </Route>
              
              <Route element={<AdminPrivateRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route
                  path="/admin/job-details/:jobId"
                  element={<JobDetailsPage />}
                />
                <Route
                  path="/admin/user-profile/:userId"
                  element={<UserProfileFetch />}
                />
                <Route
                  path="/admin/user-job-applications/:userId"
                  element={<AppliedJobsPage />}
                />
                <Route
                  path="/admin/recruiter-jobs/:companyId"
                  element={<RecruiterJobPostsPage />}
                />{" "}
                {/* NEW ROUTE */}
                <Route
                  path="/admin/job-applicants/:jobId"
                  element={<ApplicantsPage />}
                />{" "}
                
                {/* <Route path="/admin/verify-job-posts" element={<VerifyJobPosts />} /> */}
              </Route>
              <Route path="/privacypolicy" element={<PrivacyInfo />} />
              <Route path="/cookiepolicy" element={<CookiePolicy />} />
              <Route path="/termsconditions" element={<TermsAndConditions />} />
              <Route path="/contactus" element={<ContactUs />} />

              
              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <ShadcnToaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

const AuthProviderWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default App;

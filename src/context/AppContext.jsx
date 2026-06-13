import { createContext, useEffect, useState, useCallback } from "react";
import axios from "../utils/axiosConfig";
import computeProfileCompletion from "../utils/profileCompletion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
    education: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [homeJobs, sethomeJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [jobAppData, setJobAppData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); //recruiter
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isJobsLoading, setIsJobsLoading] = useState(true); // ManageJob Skeleton loading state

  // user states
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userLoginState, setUserLoginState] = useState("login");
  const [userData, setUserData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); //user
  const [isUserAuthLoading, setIsUserAuthLoading] = useState(true);
  const [userApplications, setUserApplications] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRecruiterLoggingOut, setIsRecruiterLoggingOut] = useState(false);
  const [userApply, setuserApply] = useState([]);

  // Job listing pagination state
  const [jobsPagination, setJobsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthLoading, setIsAdminAuthLoading] = useState(true);
  const [isAdminSidebar, setIsAdminSidebar] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [platformStats, setPlatformStats] = useState({
    jobseekers: 0,
    companies: 0,
    jobs: 0
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const backendUrl = import.meta.env?.VITE_API_URL;

  const getIsAuth = () => JSON.parse(localStorage.getItem("bool"));
  const getIsUserAuth = () => JSON.parse(localStorage.getItem("boolC"));
  const getIsAdminAuth = () => JSON.parse(localStorage.getItem("boolAP"));

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Only clear auth if token is invalid/expired
          if (error.response?.data?.message?.includes("Invalid token")) {
            setIsAuthenticated(false);
            setCompanyData(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fetch all jobs when app loads
  useEffect(() => {
    const fetchJobs = async () => {
      if (isAuthLoading) return; // Wait for auth check to finish
      setIsJobsLoading(true);
      try {
        if (isAuthenticated) {
          await fetchCompanyJobs(); // This already updates `jobs`
        } else {
          const { data } = await axios.get(`${backendUrl}/api/jobs`);
          if (data.success) {
            // Server already filters for verified jobs
            sethomeJobs(data.jobs);
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsJobsLoading(false); // Ensure loading stops in all cases
      }
    };

    fetchJobs();
  }, [isAuthenticated, isAuthLoading]); // Remove fetchHomeJobs dependency

  // Central authentication check for Admin
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsAdminAuthLoading(true);
      try {
        if (getIsAdminAuth()) {
          const { data } = await axios.get(`${backendUrl}/api/admin/admin`);
          if (data.success) {
            setAdminData(data.admin);
            setIsAdminAuthenticated(true);
            // navigate("/admin/dashboard", { replace: true });
            // const fetchedJobs = await fetchCompanyJobs();
          } else {
            setIsAdminAuthenticated(false);
            setAdminData(null);
          }
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        if (error.response?.status === 401 || !navigator.onLine) {
          setIsAdminAuthenticated(false);
          setAdminData(null);
        }
      } finally {
        setIsAdminAuthLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Central authentication check for company
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsAuthLoading(true);
      try {
        if (getIsAuth()) {
          const { data } = await axios.get(`${backendUrl}/api/company/company`);
          if (data.success) {
            setCompanyData(data.company);
            setIsAuthenticated(true);
            const fetchedJobs = await fetchCompanyJobs();
          } else {
            setIsAuthenticated(false);
            setCompanyData(null);
          }
        }
      } catch (error) {
        console.error("Company auth check failed:", error);
        if (error.response?.status === 401 || !navigator.onLine) {
          setIsAuthenticated(false);
          setCompanyData(null);
        }
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/stats?t=${Date.now()}`);
      if (data.success) {
        setPlatformStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching platform stats:", error);
    } finally {
      setIsStatsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // User authentication check
  useEffect(() => {
    const checkUserAuthStatus = async () => {
      setIsUserAuthLoading(true);
      try {
        // const isAuthUser = JSON.parse(localStorage.getItem("boolU") || "false");

        if (getIsUserAuth()) {
          const { data } = await axios.get(`${backendUrl}/api/users/user`);

          if (data.success) {
            setUserData(data.user);
            setIsUserAuthenticated(true);
            fetchUserJobApplications();
          } else {
            // If the API returns a non-success response, clear authentication
            setIsUserAuthenticated(false);
            setUserData(null);
          }
        }
      } catch (error) {
        console.error("User auth check failed:", error);

        // More robust error handling
        if (error.response?.status === 401 || !navigator.onLine) {
          setIsUserAuthenticated(false);
          setUserData(null);
        }
      } finally {
        setIsUserAuthLoading(false);
      }
    };

    checkUserAuthStatus();
  }, []);

  // Keep profileCompletion in sync with userData
  useEffect(() => {
    try {
      const computed = computeProfileCompletion(userData || {});
      setProfileCompletion(computed);
    } catch (err) {
      console.error("Error computing profileCompletion:", err);
      setProfileCompletion(0);
    }
  }, [userData]);
  // ✅ Fetch user from token
  const fetchUserFromCookie = async () => {
    setIsUserAuthLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/users/user`);
      setUserData(res.data.user);
      setIsUserAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user from token", error);
    } finally {
      setIsUserAuthLoading(false);
    }
  };
  // useEffect(() => {

  //   fetchUserFromCookie();
  // }, []);

  const postJob = async (jobData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        jobData
      );

      if (data.success) {
        // toast.success("Job posted successfully");
        toast.success(
          "Job posted successfully. It will be visible once approved by the admin team."
        );

        fetchCompanyJobs();
        return { success: true, message: "Job posted successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error posting job:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error posting job",
      };
    }
  };

  const fetchJob = async (jobId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${jobId}`);
      if (data.success) {
        return data.job;
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
    }
  };

  const fetchJobApplicants = async (jobId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/applicants/${jobId}`
      );

      if (data.success) {
        setJobApplicants(data.applications);
        setSelectedJobId(jobId);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
    }
  };

  const fetchUserJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/applications`);

      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  const updateUserResume = async (resumeFile) => {
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        return { success: true, message: "Resume updated successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error updating resume",
      };
    }
  };

  const applyForJob = async (jobId, applicationData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply/${jobId}`,
        applicationData
      );

      if (data.success) {
        fetchUserJobApplications();
        return { success: true, message: "Application submitted successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error applying for job",
      };
    }
  };
  // Recruiter Logout
  const logout = async () => {
    setIsRecruiterLoggingOut(true);
    try {
      await axios.post(`${backendUrl}/api/company/logout`, {});

      localStorage.setItem("bool", false);
      setIsAuthenticated(false);
      setCompanyData(null);
      setJobs([]);
      setJobApplicants([]);
      toast.success("Logged out successfully!");
      navigate("/"); // Navigate after successful logout
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Error during logout:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error during logout",
      };
    } finally {
      setIsRecruiterLoggingOut(false);
    }
  };

  // User Logout
  const userlogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${backendUrl}/api/users/user-logout`, {});
      localStorage.setItem("boolC", false);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsUserAuthenticated(false);
      setUserData(null);
      setUserApplications([]);
      setIsLoggingOut(false); // moved up
      toast.success("Logged out successfully!"); // moved inside finally
    }

    return { success: true, message: "Logged out successfully" };
  };

  const changeJobApplicationStatus = async (applicationId, newStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        {
          id: applicationId,
          status: newStatus,
        }
      );

      if (data.success) {
        fetchJobApplicants(selectedJobId);
        return {
          success: true,
          message: "Application status updated successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to update application status",
        };
      }
    } catch (error) {
      console.error("Error changing application status:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error changing application status",
      };
    }
  };

  const changeInterviewStatus = async (applicationId, newInterviewStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-int`,
        {
          id: applicationId,
          interviewStatus: newInterviewStatus,
        }
      );

      if (data.success) {
        fetchJobApplicants(selectedJobId);
        return {
          success: true,
          message: "Interview status updated successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to update interview status",
        };
      }
    } catch (error) {
      console.error("Error changing interview status:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error changing interview status",
      };
    }
  };

  const changeOnboardingStatus = async (applicationId, newOnboardStatus) => {
    try {
      const payload = {
        id: applicationId,
        onboardingStatus: newOnboardStatus,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/company/change-onboard`,
        payload
      );

      if (data.success) {
        fetchJobApplicants(selectedJobId);
        return {
          success: true,
          message: "Onboarding status updated successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to update onboarding status",
        };
      }
    } catch (error) {
      console.error("Error changing onboarding status:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error changing onboarding status",
      };
    }
  };

  const editJob = async (jobId, jobData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/company/edit-job/${jobId}`,
        jobData
      );

      if (data.success) {
        fetchCompanyJobs();
        return { success: true, message: "Job updated successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating job:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error updating job",
      };
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/company/delete-job/${jobId}`
      );

      if (data.success) {
        fetchCompanyJobs();
        return { success: true, message: "Job deleted successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error deleting job",
      };
    }
  };

  // Fetch home jobs with pagination and filters
  const fetchHomeJobs = useCallback(async (filters = {}, page = 1, limit = 9) => {
    setIsJobsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            filters[key].forEach(value => params.append(key, value));
          } else {
            params.append(key, filters[key]);
          }
        }
      });

      const { data } = await axios.get(`${backendUrl}/api/jobs?${params}`);
      
      if (data.success) {
        // Server already filters for verified jobs, no need to filter again
        sethomeJobs(data.jobs);
        
        // Update pagination state
        setJobsPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          totalJobs: data.pagination?.totalJobs || 0,
          hasNext: data.pagination?.hasNextPage || false,
          hasPrev: data.pagination?.hasPrevPage || false,
        });
      }
    } catch (error) {
      console.error("Error fetching home jobs:", error);
      // Reset to empty state on error
      sethomeJobs([]);
      setJobsPagination({
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setIsJobsLoading(false);
    }
  }, [backendUrl]);

  const value = {
    backendUrl,
    // Existing states
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    jobApplicants,
    setJobApplicants,
    jobAppData,
    setJobAppData,
    selectedJobId,
    setSelectedJobId,
    showRecruiterLogin,
    setShowRecruiterLogin,
    showAdminLogin,
    setShowAdminLogin,
    companyData,
    setCompanyData,
    isAuthenticated,
    setIsAuthenticated,
    showUserLogin,
    setShowUserLogin,
    userLoginState,
    setUserLoginState,
    userData,
    setUserData,
    isUserAuthenticated,
    setIsUserAuthenticated,
    userApplications,
    setUserApplications,
    isAuthLoading,
    isUserAuthLoading,
    setIsUserAuthLoading,
    isLoggingOut,
    postJob,
    fetchJob,
    fetchCompanyJobs,
    fetchJobApplicants,
    fetchUserJobApplications,
    applyForJob,
    updateUserResume,
    logout,
    userlogout,
    changeJobApplicationStatus,
    changeInterviewStatus,
    changeOnboardingStatus,
    editJob,
    deleteJob,
    userApply,
    setuserApply,
    homeJobs,
    sethomeJobs,
    isRecruiterLoggingOut,
    fetchUserFromCookie,
    isAdminSidebar,
    setIsAdminSidebar,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isAdminAuthLoading,
    setIsAdminAuthLoading,
    adminData,
    setAdminData,
  profileCompletion,
  setProfileCompletion,
    getIsAdminAuth,
    setIsAuthLoading,
    isJobsLoading,
    setIsJobsLoading,
    
    jobsPagination,
    fetchHomeJobs,
    platformStats,
    fetchStats,
    isStatsLoading,

  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

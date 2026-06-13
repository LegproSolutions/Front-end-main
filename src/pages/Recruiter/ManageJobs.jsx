import React, { useContext, useEffect, useState } from "react"; // Import useState
import { AppContext } from "../../context/AppContext";
import { Eye, EyeOff, Users, Briefcase, Edit, Lock, Info, AlertCircle } from "lucide-react"; // Import AlertCircle icon
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const backendUrl = import.meta.env?.VITE_API_URL;
import axios from "../../utils/axiosConfig";

const ManageJobs = () => {
  const { jobs = [], setJobs, isJobsLoading, companyData, setCompanyData, isAuthLoading, editJob, setSelectedJobId } = useContext(AppContext);
  const navigate = useNavigate();

  // State for objection modal
  const [showFullObjectionModal, setShowFullObjectionModal] = useState(false);
  const [currentObjectionMessage, setCurrentObjectionMessage] = useState("");

  // Central authentication check for company and fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/company/company`);
        if (data.success) {
          setCompanyData(data.company);
        } else {
          setCompanyData(null);
        }
      } catch (error) {
        console.error("Company auth check failed:", error);
        if (error.response?.status === 401 || !navigator.onLine) {
          setCompanyData(null);
        }
      }
    };

    fetchCompanyData();
  }, [setCompanyData]);

  // Handler to toggle job visibility
  const toggleVisibility = async (id) => {
    try {
      const jobToToggle = jobs.find((job) => job._id === id);
      if (!jobToToggle) return;

      const response = await editJob(id, { visible: !jobToToggle.visible });
      
      if (response.success) {
        toast.success(response.message || "Job visibility updated!");
      } else {
        toast.error(response.message || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("An error occurred while updating visibility");
    }
  };

  // Handler to preview a job
  const handlePreview = (jobId) => {
    navigate(`/dashboard/preview-job/${jobId}`);
  };

  // Handler to open the full objection message modal
  const handleViewObjection = (message) => {
    setCurrentObjectionMessage(message);
    setShowFullObjectionModal(true);
  };

  // Calculate dashboard statistics
  const totalJobs = jobs?.length || 0;
  const totalApplicants =
    jobs?.reduce((sum, job) => sum + (job.applicants || 0), 0) || 0;
  const visibleJobs = jobs?.filter((job) => job.visible)?.length || 0;
  const hiddenJobs = totalJobs - visibleJobs;

  // Loader for initial data fetch
  const isCompanyLoading = !companyData && !isAuthLoading;
  if (isJobsLoading || isCompanyLoading) {
    return (
      <div className="container mx-auto px-4 py-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-xl shadow animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative container mx-auto z-10 px-4 sm:px-6 py-6 overflow-auto w-full">
      {/* Premium Access Overlay - Commented out to ensure jobs are visible as requested */}
      {/* {!companyData?.havePremiumAccess && (
        <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center text-center px-4">
          <Lock className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Premium Access Required</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md">
            You need a premium subscription to access the Manage Jobs feature. Please contact support or upgrade your plan to continue.
          </p>
        </div>
      )} */}

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {isJobsLoading ? (
          // Top Cards Skeleton
          [...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between animate-pulse"
            >
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-400 rounded w-1/2"></div>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          ))
        ) : (
          <>
            {/* Total Job Openings */}
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
                  Total Job Openings
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-legpro-primary">
                  {totalJobs}
                </p>
              </div>
              <Briefcase className="h-8 sm:h-10 w-8 sm:w-10 text-gray-500" />
            </div>
            {/* Total Applicants */}
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
                  Total Applicants
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {totalApplicants}
                </p>
              </div>
              <Users className="h-8 sm:h-10 w-8 sm:w-10 text-gray-500" />
            </div>
            {/* Visible / Hidden Jobs */}
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
                  Visible / Hidden Jobs
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {visibleJobs} / {hiddenJobs}
                </p>
              </div>
              <Eye className="h-8 sm:h-10 w-8 sm:w-10 text-gray-500" />
            </div>
          </>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full min-w-[600px] border-collapse bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase font-semibold">
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-left">Job ID</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-left">Job Title</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-left">Date Posted</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-center">Applicants</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-center">Status</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-left">Location</th>
              <th className="px-3 sm:px-5 py-3 sm:py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table Row Skeleton */}
            {isJobsLoading ? (
              [...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 animate-pulse"
                >
                  <td className="px-3 sm:px-5 py-3">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3 text-center">
                    <div className="h-4 bg-gray-300 rounded w-12 mx-auto"></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3 text-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto"></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="px-3 sm:px-5 py-3 flex justify-center items-center gap-2">
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))
            ) : (
              jobs?.map((job) => {
                const isVerified = job.isVerified;
                const hasObjection = job.objections && job.objections.length > 0;
                const isEditedAfterObjection = job.isEdited;

                let statusMessage = "";
                let statusClasses = "";
                let rowClasses = "";
                let editButtonDisabled = true;
                let toggleVisibilityDisabled = true;

                if (job.status === "Approved") {
                  statusMessage = "Approved";
                  statusClasses = job.visible ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
                  rowClasses = "hover:bg-gray-50 cursor-pointer";
                  toggleVisibilityDisabled = false;
                  editButtonDisabled = false;
                } else if (job.status === "Rejected") {
                  statusMessage = "Rejected";
                  statusClasses = "bg-red-200 text-red-800";
                  rowClasses = "cursor-default bg-red-50";
                  editButtonDisabled = false;
                  toggleVisibilityDisabled = true;
                } else {
                  // Default to Pending Admin Verification
                  statusMessage = job.status || "Pending Admin Verification";
                  statusClasses = "bg-yellow-100 text-yellow-800";
                  rowClasses = "cursor-default bg-yellow-50/30";
                  editButtonDisabled = false;
                  toggleVisibilityDisabled = false;

                  if (job.isEdited) {
                    statusMessage = "Under Review (Edited)";
                    statusClasses = "bg-yellow-200 text-yellow-800";
                  }

                  if (hasObjection) {
                    statusMessage = "Objection (View Details)";
                    statusClasses = "bg-red-200 text-red-800 cursor-pointer";
                    rowClasses = "cursor-default border-2 border-red-300 bg-red-50";
                  }
                }

                return (
                  <tr
                    key={job._id}
                    className={`border-t border-gray-200 transition ${rowClasses}`}
                  >
                    <td className="px-3 sm:px-5 py-3 text-gray-700 text-xs sm:text-sm">
                      {String(job.jobId || "0").padStart(4, "0")}
                    </td>
                    <td className="px-3 sm:px-5 py-3 font-medium text-gray-900 text-xs sm:text-sm">
                      {job.title}
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-gray-600 text-xs sm:text-sm">
                      {new Date(job.date).toLocaleDateString()}
                    </td>
                    <td 
                      className="px-3 sm:px-5 py-3 text-center font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-xs sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJobId(job._id);
                        navigate("/dashboard/view-applications");
                      }}
                    >
                      {job.applicants || 0}
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-center">
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${statusClasses}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          if (hasObjection) {
                            handleViewObjection(job.objections[job.objections.length - 1].message);
                          } else if (!isVerified) {
                              toast.error(
                                isEditedAfterObjection
                                  ? "This job post is under review after an edit. Please wait for admin verification."
                                  : "This job post is pending admin verification. Please contact support for more information."
                              );
                          }
                        }}
                      >
                        {statusMessage}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-gray-700 text-xs sm:text-sm">
                      {job.location}
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-center flex justify-center items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!toggleVisibilityDisabled) {
                            toggleVisibility(job._id);
                          } else {
                            toast.error("This job post cannot be toggled as it's not verified or is under review.");
                          }
                        }}
                        disabled={toggleVisibilityDisabled}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-md flex items-center gap-1 ${
                          !toggleVisibilityDisabled
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {job.visible ? (
                          <>
                            <EyeOff className="w-4 h-4" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" /> Show
                          </>
                        )}
                      </button>
                      <Link
                        onClick={(e) => {
                          // Allow editing for all jobs
                          if (hasObjection && isEditedAfterObjection) {
                             // Optional: Warn if already edited after objection
                             // but we allow it now as per "make it work" request
                          }
                        }}
                        to={`/dashboard/edit-job/${job._id}`}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-md flex items-center gap-1 ${
                          // Edit button is enabled if verified OR if there's an objection and it hasn't been edited yet
                          (!editButtonDisabled || (hasObjection && !isEditedAfterObjection))
                            ? "bg-legpro-primary hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Full Objection Message Modal */}
      {showFullObjectionModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            {/* Title with border and icon */}
            <h3 className="text-xl font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-300 flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" /> {/* Alert icon */}
              Job Objection Details
            </h3>
            {/* Objection message with prefix */}
            <p className="text-gray-700 whitespace-pre-wrap">
              <span className="font-semibold text-red-600">Objection:</span> {currentObjectionMessage}
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowFullObjectionModal(false)}
                className="px-4 py-2 bg-legpro-primary text-white rounded-md hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;

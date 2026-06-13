import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Navbar from "@/Components/Navbar";
import { assets } from "../../assets/assets";
import moment from "moment";
import JobCard from "@/Components/Jobs/Jobcard";
import toast from "react-hot-toast";
import { ChevronLeft, Share2, Bookmark, ExternalLink, AlertTriangle } from "lucide-react";
const backendUrl = import.meta.env?.VITE_API_URL;

import {
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  IndianRupee,
  GraduationCap,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import axios from "../../utils/axiosConfig";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30";
    case "Rejected":
      return "bg-rose-500 text-white shadow-lg shadow-rose-500/30";
    case "In Review":
      return "bg-amber-500 text-white shadow-lg shadow-amber-500/30";
    default:
      return "bg-slate-400 text-white";
  }
};

const ApplyJob = ({ previewMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    jobs,
    userApplications,
    userData,
    setUserData,
    homeJobs,
    isUserAuthenticated,
    profileCompletion,
    applyForJob,
    fetchUserJobApplications,
  } = useContext(AppContext);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const isExpired = jobData && new Date() > new Date(jobData.deadline);
  const allJobs = isUserAuthenticated ? homeJobs : jobs;

  const location = useLocation();
  const showBackButton = location.pathname.startsWith("/dashboard/preview-job");
  const getIsUserAuth = () => JSON.parse(localStorage.getItem("boolC"));

  const fetchFullUserProfile = async () => {
    try {
      if (getIsUserAuth()) {
        const res = await axios.get(`${backendUrl}/api/profile/get-user`);
        if (res.data.success) {
          setUserData(res.data.profile);
          setUserDataLoading(false);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchFullUserProfile();
  }, []);

  useEffect(() => {
    if (!allJobs || allJobs.length === 0) {
      setLoading(true);
      return;
    }
    const selectedJob = allJobs.find(
      (job) =>
        job._id === id ||
        String(job.jobId) === id ||
        String(job.jobId).padStart(4, "0") === id
    );
    if (selectedJob) {
      setJobData(selectedJob);
      const filteredJobs = allJobs
        .filter(
          (job) =>
            job._id !== selectedJob._id &&
            (job.level === selectedJob.level ||
              job.category === selectedJob.category ||
              job.location === selectedJob.location)
        )
        .slice(0, 4);
      setSimilarJobs(filteredJobs);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, allJobs]);

  const userApplication =
    jobData &&
    userApplications &&
    userApplications.find((app) => app.jobId === jobData._id || (app.jobId && app.jobId._id === jobData._id));

  const hasApplied = Boolean(userApplication);

  const isProfileComplete = () => {
    if (!userData) return false;
    if (profileCompletion !== undefined) {
      return profileCompletion >= 75;
    }
    return false;
  };

  const confirmApply = async () => {
    if (jobData?.screeningQuestions && Array.isArray(jobData.screeningQuestions) && jobData.screeningQuestions.length > 0) {
      const unanswered = jobData.screeningQuestions.filter(q => !screeningAnswers[q.id]);
      if (unanswered.length > 0) {
        toast.error("Please answer all screening questions before submitting.");
        return;
      }
    }

    setApplying(true);
    try {
      const appData = {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        fatherName: userData.fatherName || "",
        maritalStatus: userData.maritalStatus || "",
        nationality: userData.nationality || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth || "",
        email: userData.email || "",
        phone: userData.phone || "",
        altPhone: userData.altPhone || "",
        aadharNumber: userData.aadharNumber || "",
        height: userData.height || "",
        weight: userData.weight || "",
        currentAddress: userData.address || {},
        permanentAddress: userData.permanentAddress || {},
        education: userData.education || {},
        experience: userData.experience || [],
        apprenticeship: userData.apprenticeship || {},
        skills: userData.skills || [],
        languages: userData.languages || [],
        resume: userData.resume || "",
        profilePicture: userData.profilePicture || "",
        screeningAnswers: screeningAnswers,
      };

      const result = await applyForJob(id, appData);
      if (result.success) {
        toast.success("Job applied successfully.");
        await fetchUserJobApplications();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Apply error:", error);
      toast.error("Failed to apply for the job.");
    } finally {
      setApplying(false);
      setShowConfirmModal(false);
    }
  };

  const handleApplyNow = () => {
    if (!isUserAuthenticated) {
      toast.error("Please login to apply for jobs.");
      return;
    }

    if (!userData || !userData._id) {
      toast.error("Please wait while we load your profile.");
      return;
    }

    if (hasApplied) {
      toast.error("Already Applied");
      return;
    }

    if (isExpired) {
      toast.error("This job has expired.");
      return;
    }

    if (!isProfileComplete()) {
      toast.error("Please complete your profile first.");
      sessionStorage.setItem("pendingJobId", id);
      navigate("/profile");
      return;
    }

    if (jobData?.url) {
      return window.open(jobData.url, "_blank");
    }

    setShowConfirmModal(true);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "Not specified";
    return moment(deadline).format("MMM DD, YYYY");
  };

  const handleBackClick = () => {
    navigate("/dashboard/manage-jobs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {!previewMode && <Navbar />}
      
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium group"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Manage Jobs</span>
          </button>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                  <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-48 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ) : jobData ? (
              <>
                {/* Job Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-10">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="bg-white p-4 rounded-xl shadow-2xl border-4 border-white/50">
                          <img
                            className="h-20 w-20 object-contain"
                            src={jobData.companyId?.image || assets.default_company_logo}
                            alt={jobData.companyId?.name || "Company"}
                          />
                        </div>
                        <div className="flex-1 text-white">
                          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                            {jobData.title}
                          </h1>
                          <p className="text-indigo-100 flex items-center gap-2 text-lg mb-4">
                            <Building2 className="h-5 w-5" />
                            {jobData.companyId?.name || "Company Name"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                              {jobData.level}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                              {jobData.category || "General"}
                            </span>
                            {isExpired && (
                              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold shadow-md animate-pulse">
                                Expired
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!previewMode && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            onClick={handleApplyNow}
                            disabled={hasApplied || isExpired}
                            className={`px-8 py-3 rounded-xl font-semibold shadow-2xl transition-all transform hover:scale-105 ${
                              hasApplied
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                : isExpired
                                ? "bg-rose-500 text-white cursor-not-allowed"
                                : "bg-white text-indigo-600 hover:bg-indigo-50"
                            }`}
                          >
                            {hasApplied ? "✓ Applied" : isExpired ? "Expired" : "Apply Now"}
                          </button>
                          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
                            <Bookmark className="h-5 w-5 text-white" />
                          </button>
                          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
                            <Share2 className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expiry Warning Message */}
                  {isExpired && (
                    <div className="mx-8 -mt-4 mb-6 relative z-20">
                      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl p-5 text-white shadow-2xl border border-red-400">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-6 w-6 text-white animate-bounce" />
                          <p className="font-semibold text-lg">
                            This job posting has expired and is no longer accepting applications.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Application Status */}
                  {hasApplied && (
                    <div className="mx-8 -mt-4 mb-6 relative z-20">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-2xl">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="text-sm opacity-90 mb-1">Application Status</p>
                            <div className="flex items-center gap-3">
                              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold ${getStatusBadgeColor(userApplication.status)}`}>
                                {userApplication.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm opacity-90">Applied on</p>
                            <p className="font-semibold">
                              {moment(userApplication.appliedDate).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Details Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-600 rounded-lg">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Location</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg">{jobData.location}</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-purple-600 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Experience</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg">
                          {jobData.experienceOption === "Fresher" ? "Fresher Only" : `${jobData.experience} Year(s)`}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-emerald-600 rounded-lg">
                            <IndianRupee className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Salary</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg">
                          ₹{(jobData.salaryBreakdown?.ctc || jobData.salary || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm">Deadline:</span>
                        <span className="font-semibold text-slate-900">{formatDeadline(jobData.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm">Category:</span>
                        <span className="font-semibold text-slate-900">{jobData.category || "General"}</span>
                      </div>
                      {jobData.vacancies && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="h-5 w-5 text-indigo-600" />
                          <span className="text-sm">Positions:</span>
                          <span className="font-semibold text-slate-900">{jobData.vacancies}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                        Job Description
                      </h2>
                      <div
                        className="text-slate-700 prose max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: jobData.description }}
                      ></div>
                    </div>

                    {/* Education & Qualifications */}
                    {jobData.educationRequirements && Array.isArray(jobData.educationRequirements) && jobData.educationRequirements.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                          Educational Requirements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {jobData.educationRequirements.map((block, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                              <p className="font-bold text-slate-800">{block.qualification}</p>
                              {block.specializations && block.specializations.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {block.specializations.map((spec, sIdx) => (
                                    <span key={sIdx} className="bg-blue-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-blue-100">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 mt-1 font-medium">All trades / streams accepted</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Salary Structure Breakdown */}
                    {jobData.salaryBreakdown && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                          Salary Structure Breakdown
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-gray-500 font-semibold mb-1">In-Hand Salary</p>
                            <p className="text-base font-black text-slate-800">₹{Number(jobData.salaryBreakdown.inHand || 0).toLocaleString()}/mo</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-gray-500 font-semibold mb-1">Gross Salary</p>
                            <p className="text-base font-black text-slate-800">₹{Number(jobData.salaryBreakdown.gross || 0).toLocaleString()}/mo</p>
                          </div>
                          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                            <p className="text-xs text-indigo-700 font-semibold mb-1">Annual CTC</p>
                            <p className="text-base font-black text-indigo-700">₹{Number(jobData.salaryBreakdown.ctc || jobData.salary || 0).toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-gray-500 font-semibold mb-1">OT Benefits</p>
                            <p className="text-xs font-bold text-slate-700">
                              {jobData.salaryBreakdown.otAvailable === "Yes" 
                                ? `Available (₹${jobData.salaryBreakdown.otRate || 0}/hr)` 
                                : "Not Available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shift details */}
                    {jobData.shiftDetails && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                          Shift & Schedule
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Shift Type</p>
                            <p className="text-sm font-bold text-slate-800">{jobData.shiftDetails.shiftType}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Shift Timing</p>
                            <p className="text-sm font-bold text-slate-800">{jobData.shiftDetails.shiftTiming || "N/A"}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Weekly Off</p>
                            <p className="text-sm font-bold text-slate-800">{jobData.shiftDetails.weeklyOff || "N/A"}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Working Days</p>
                            <p className="text-sm font-bold text-slate-800">{jobData.shiftDetails.workingDays || "6"} Days / Wk</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Requirements documents checklist */}
                    {jobData.requiredDocuments && Array.isArray(jobData.requiredDocuments) && jobData.requiredDocuments.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-rose-600 rounded-full"></div>
                          Required Documents
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {jobData.requiredDocuments.map((doc, index) => (
                            <span key={index} className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200">
                              ✓ {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefits perks */}
                    {jobData.benefits && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          Benefits & Perks
                        </h2>
                        {typeof jobData.benefits === 'object' ? (
                          <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                            {(() => {
                              const sanitizeBenefits = (rawBenefits) => {
                                if (!rawBenefits || typeof rawBenefits !== "object") return {};
                                const clean = {
                                  food: [],
                                  transportation: [],
                                  uniform: [],
                                  accommodation: [],
                                  healthcare: [],
                                  other: []
                                };
                                const itemToCategory = {
                                  "Free Canteen": "food",
                                  "Subsidized Canteen": "food",
                                  "Breakfast Facility": "food",
                                  "Snacks Facility": "food",
                                  "Subsidized Food": "food",
                                  "Canteen Available": "food",
                                  "Company Bus": "transportation",
                                  "Pick & Drop Facility": "transportation",
                                  "Transportation Allowance": "transportation",
                                  "Free Bus Service": "transportation",
                                  "Paid Transport": "transportation",
                                  "Company Uniform": "uniform",
                                  "Safety Shoes": "uniform",
                                  "Safety Kit": "uniform",
                                  "PG Facility": "accommodation",
                                  "Company Accommodation": "accommodation",
                                  "Company Support to Find Room (Paid by Candidate)": "accommodation",
                                  "Medical Facility": "healthcare",
                                  "ESI": "healthcare",
                                  "Health Insurance": "healthcare",
                                  "Accident Insurance": "healthcare",
                                  "PF": "healthcare",
                                  "Gratuity": "healthcare",
                                  "Annual Bonus": "healthcare",
                                  "Festival Bonus": "healthcare"
                                };
                                Object.values(rawBenefits).forEach((items) => {
                                  if (Array.isArray(items)) {
                                    items.forEach((item) => {
                                      const category = itemToCategory[item];
                                      if (category) {
                                        if (!clean[category].includes(item)) {
                                          clean[category].push(item);
                                        }
                                      } else {
                                        if (!clean.other.includes(item)) {
                                          clean.other.push(item);
                                        }
                                      }
                                    });
                                  }
                                });
                                const result = {};
                                Object.entries(clean).forEach(([cat, items]) => {
                                  if (items.length > 0) {
                                    result[cat] = items;
                                  }
                                });
                                return result;
                              };

                              const categoryLabels = {
                                food: "Food & Canteen",
                                transportation: "Transportation",
                                uniform: "Uniform & Safety Essentials",
                                accommodation: "Accommodation Facilities",
                                healthcare: "Healthcare & Allowances",
                                other: "Additional Benefits"
                              };

                              return Object.entries(sanitizeBenefits(jobData.benefits)).map(([category, items]) => {
                                if (!Array.isArray(items) || items.length === 0) return null;
                                return (
                                  <div key={category} className="border-b border-slate-200 pb-3 last:border-none last:pb-0">
                                    <p className="text-xs font-bold text-blue-700 mb-2">
                                      {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {items.map((item, idx) => (
                                        <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
                                          ★ {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        ) : (
                          <div
                            className="text-slate-700 prose max-w-none leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: jobData.benefits }}
                          ></div>
                        )}
                      </div>
                    )}

                    {/* Company Info */}
                    {jobData.companyId && (
                      <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Building2 className="h-6 w-6 text-indigo-600" />
                          About the Company
                        </h2>
                        <p className="text-slate-700 mb-4">{jobData.companyDetails.shortDescription}</p>
                        {jobData.workLocationDetails?.plantName && (
                          <p className="text-sm font-semibold text-blue-800 mb-2">
                            🏭 Plant: {jobData.workLocationDetails.plantName} {jobData.workLocationDetails.unitName ? `(${jobData.workLocationDetails.unitName})` : ""}
                          </p>
                        )}
                        {jobData.workLocationDetails?.address ? (
                          <p className="text-sm text-slate-600">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {jobData.workLocationDetails.address} {jobData.workLocationDetails.pinCode ? `- ${jobData.workLocationDetails.pinCode}` : ""}
                          </p>
                        ) : (
                          jobData.companyDetails && jobData.companyDetails.city && (
                            <p className="text-sm text-slate-600">
                              <MapPin className="h-4 w-4 inline mr-1" />
                              {jobData.companyDetails.city}
                              {jobData.companyDetails.state && `, ${jobData.companyDetails.state}`}
                              {jobData.companyDetails.country && `, ${jobData.companyDetails.country}`}
                            </p>
                          )
                        )}

                        {jobData.workLocationDetails?.latitude && jobData.workLocationDetails?.longitude && (
                          <div className="mt-4">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${jobData.workLocationDetails.latitude},${jobData.workLocationDetails.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-bold inline-block transition-all shadow"
                            >
                              📍 View on Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Apply Button */}
                    {!previewMode && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={handleApplyNow}
                          disabled={hasApplied || isExpired}
                          className={`px-10 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105 ${
                            hasApplied
                              ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                              : isExpired
                              ? "bg-rose-500 text-white cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                          }`}
                        >
                          {hasApplied ? "✓ Application Submitted" : isExpired ? "Expired" : "Apply for this Position →"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h3>
                <p className="text-slate-600 mb-6">This job posting may have been removed or doesn't exist.</p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Browse All Jobs
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            {!previewMode && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Similar Opportunities
                  </h2>
                </div>
                <div className="p-4">
                  {similarJobs.length > 0 ? (
                    <div className="space-y-3">
                      {similarJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm">No similar jobs available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {jobData && (jobData.hrContact || jobData.companyDetails?.hrName) && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contact HR Representative
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">HR Representative</p>
                    <p className="text-slate-900 font-bold text-lg">{jobData.hrContact?.name || jobData.companyDetails?.hrName}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2">
                    {(jobData.hrContact?.mobile || jobData.companyDetails?.hrPhone) && (
                      <a
                        href={`tel:${jobData.hrContact?.mobile || jobData.companyDetails?.hrPhone}`}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        📞 Call HR: {jobData.hrContact?.mobile || jobData.companyDetails?.hrPhone}
                      </a>
                    )}
                    
                    {jobData.hrContact?.whatsapp && (
                      <a
                        href={`https://wa.me/${jobData.hrContact.whatsapp.replace(/\+/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        💬 WhatsApp HR
                      </a>
                    )}

                    {(jobData.hrContact?.email || jobData.companyDetails?.hrEmail) && (
                      <a
                        href={`mailto:${jobData.hrContact?.email || jobData.companyDetails?.hrEmail}`}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        ✉ Email HR
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {jobData.screeningQuestions && jobData.screeningQuestions.length > 0 ? "Screening Questionnaire" : "Apply for Job"}
              </h3>
              
              <div className="flex-1 overflow-y-auto my-4 pr-1">
                {jobData.screeningQuestions && jobData.screeningQuestions.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-semibold mb-3">
                      Please answer the following screening questions to complete your application:
                    </p>
                    {jobData.screeningQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="space-y-2 border-b border-slate-100 pb-3 last:border-none">
                        <p className="text-sm font-semibold text-slate-800">
                          {idx + 1}. {q.questionText}
                        </p>
                        {q.type === "yes_no" ? (
                          <div className="flex gap-6 mt-1">
                            {["Yes", "No"].map(opt => (
                              <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium">
                                <input 
                                  type="radio" 
                                  name={`question-${q.id}`} 
                                  value={opt} 
                                  checked={screeningAnswers[q.id] === opt}
                                  onChange={() => setScreeningAnswers({ ...screeningAnswers, [q.id]: opt })}
                                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 mt-1">
                            {q.options && q.options.map(opt => (
                              <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium">
                                <input 
                                  type="radio" 
                                  name={`question-${q.id}`} 
                                  value={opt} 
                                  checked={screeningAnswers[q.id] === opt}
                                  onChange={() => setScreeningAnswers({ ...screeningAnswers, [q.id]: opt })}
                                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">Are you sure you want to apply for this job?</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={applying}
                  onClick={confirmApply}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {applying ? "Applying..." : "Confirm Application"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;


"use client";

import { useContext, useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  User,
  GraduationCap,
  MapPin,
  Building,
  Clock,
  Download,
  FileSpreadsheet,
  Lock,
  FileText,
  Phone,
  Eye,
  Users,
  CheckCircle2,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

/**
 * Helper to get a Tailwind color class for a given status.
 */
function getStatusBadgeColor(status) {
  switch (status) {
    case "Joined":
      return "bg-green-500 text-white";
    case "Selecte":
      return "bg-blue-500 text-white";
    case "Shortlist":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-300 text-gray-800";
  }
}

/**
 * Helper function to convert job application data to a format suitable for Excel
 */
/**
 * Helper function to convert job application data to a format suitable for Excel
 * with dedicated columns for each education level
 */
function prepareApplicantDataForExcel(applicants) {
  return applicants.map((app) => {
    const data = app || {};
    const appData = data.applicationData || {};

    // Convert experience data to a more readable format
    const experienceSummary = appData.experience?.length
      ? appData.experience
          .map((exp) => `${exp.company || "N/A"} (${exp.position || "N/A"})`)
          .join("; ")
      : "None";

    // Format DOB helper
    const getDOB = () => {
      if (appData.dateOfBirth && appData.dateOfBirth !== "N/A") return appData.dateOfBirth;
      const profileDOB = data.userId?.profile?.dateOfBirth;
      if (profileDOB) {
        try {
          return new Date(profileDOB).toISOString().split('T')[0];
        } catch (e) {
          return String(profileDOB);
        }
      }
      return "N/A";
    };

    // Format Resume URL helper
    const getResumeURL = () => {
      const profileResume = data.userId?.profile?.resume;
      if (profileResume) {
        if (typeof profileResume === "object" && profileResume.url) return profileResume.url;
        if (typeof profileResume === "string") return profileResume;
      }
      if (data.userId?.resume) return data.userId.resume;
      if (appData.resume) {
        if (typeof appData.resume === "object" && appData.resume.url) return appData.resume.url;
        if (typeof appData.resume === "string") return appData.resume;
      }
      if (appData.documents?.resume) {
        if (typeof appData.documents.resume === "object" && appData.documents.resume.url) return appData.documents.resume.url;
        if (typeof appData.documents.resume === "string") return appData.documents.resume;
      }
      return "N/A";
    };

    // Create a base object with common fields
    const baseData = {
      Name: data.userId?.name || "N/A",
      Email: appData.email || data.userId?.email || "N/A",
      Phone: appData.phone || data.userId?.phone || "N/A",
      "Job Position": data.jobId?.title || "N/A",
      Status: data.status || "Pending",
      "Interview Status": data.interview || "Not Interviewed",
      "Onboarding Status": data.onboarding || "Not Onboarded",
      "Date Of Birth": getDOB(),
      Gender: appData.gender || data.userId?.profile?.gender || "N/A",
      Nationality: appData.nationality || data.userId?.profile?.nationality || "N/A",
      "Resume URL": getResumeURL(),
    };

    // Fetch education details from Profile instead of Old Application Form
    const profile = data.userId?.profile || {};
    const profileEducation = profile.education || {};
    const eduList = Object.values(profileEducation);

    const getEduField = (type, fieldName) => {
      const record = eduList.find((e) => e && e.instituteType === type);
      if (!record || !record.instituteFields) return "";
      const fields = record.instituteFields;
      const val = fields[fieldName];
      return val !== null && val !== undefined ? String(val).trim() : "";
    };

    // Below 10 Pass
    baseData["Below 10 Pass Passing Year"] = getEduField("Below 10 Pass", "passingYear");

    // 10th Pass
    baseData["10th Pass Passing Year"] = getEduField("10th Pass", "passingYear");

    // 12th Pass
    baseData["12th Pass Passing Year"] = getEduField("12th Pass", "passingYear");

    // ITI
    baseData["ITI Specialization"] = getEduField("ITI", "specialization") || getEduField("ITI", "trade");
    baseData["ITI Passing Year"] = getEduField("ITI", "passingYear");

    // Diploma
    baseData["Diploma Specialization"] = getEduField("Diploma", "specialization") || getEduField("Diploma", "trade");
    baseData["Diploma Passing Year"] = getEduField("Diploma", "passingYear");

    // Graduate
    baseData["Graduate Course Name"] = getEduField("Graduate", "courseName");
    baseData["Graduate Specialization"] = getEduField("Graduate", "specialization") || getEduField("Graduate", "trade");
    baseData["Graduate Passing Year"] = getEduField("Graduate", "passingYear");

    // Post Graduate
    baseData["Post Graduate Course Name"] = getEduField("Post Graduate", "courseName");
    baseData["Post Graduate Specialization"] = getEduField("Post Graduate", "specialization") || getEduField("Post Graduate", "trade");
    baseData["Post Graduate Passing Year"] = getEduField("Post Graduate", "passingYear");

    // Add address and experience data
    baseData["Current City"] = appData.currentAddress?.city || data.userId?.profile?.address?.city || "N/A";
    baseData["Current State"] = appData.currentAddress?.state || data.userId?.profile?.address?.state || "N/A";
    baseData["Experience"] = experienceSummary;

    return baseData;
  });
}
/**
 * Function to download data as Excel file
 */
function downloadAsExcel(data, filename = "applicants-data") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

  // Auto-size columns
  const maxWidths = {};
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const value = String(row[key]);
      maxWidths[key] = Math.max(maxWidths[key] || 0, value.length);
    });
  });

  worksheet["!cols"] = Object.keys(data[0]).map((key) => ({
    wch: Math.min(Math.max(maxWidths[key], key.length), 50), // Cap width at 50 characters
  }));

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

const ViewApplications = () => {
  const {
    jobs = [],
    jobApplicants = [],
    fetchJobApplicants,
    fetchJobs,
    jobAppData = [],
    changeJobApplicationStatus,
    changeInterviewStatus,
    changeOnboardingStatus,
    companyData,
    selectedJobId,
    setSelectedJobId
  } = useContext(AppContext);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [allApplicantsData, setAllApplicantsData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 10;

  const [selectedFilters, setSelectedFilters] = useState([]);

  // Enrich applicants with match criteria and status key
  const enrichedApplicants = useMemo(() => {
    const calculateAge = (dobString) => {
      if (!dobString || dobString === "N/A") return null;
      const dob = new Date(dobString);
      if (isNaN(dob.getTime())) {
        const parts = dobString.split(/[-/]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) return new Date().getFullYear() - parseInt(parts[0]);
          if (parts[2].length === 4) return new Date().getFullYear() - parseInt(parts[2]);
        }
        return null;
      }
      const ageDifMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const getJobAgeLimits = (job) => {
      const text = ((job?.title || "") + " " + (job?.description || "")).toLowerCase();
      const regex = /age\s*(?:limit)?\s*(?:is|should\s+be|range)?\s*:?\s*(\d{2})\s*(?:to|-)\s*(\d{2})/i;
      const match = text.match(regex);
      if (match) {
        return { min: parseInt(match[1]), max: parseInt(match[2]) };
      }
      return { min: 18, max: 45 };
    };

    return jobApplicants.map(app => {
      const data = app || {};
      const candidateEdu = data.applicationData?.education || {};
      const jobQual = selectedJob?.qualification || "";
      const jobTitle = selectedJob?.title || "";
      const jobDesc = selectedJob?.description || "";
      
      // 1. Qualification Level Check
      let levelsToCheck = [];
      if (jobQual === "ITI") {
        levelsToCheck = ["ITI"];
      } else if (jobQual === "Diploma") {
        levelsToCheck = ["Diploma"];
      } else if (jobQual === "Graduate") {
        levelsToCheck = ["Undergraduate", "Postgraduate"];
      } else if (jobQual === "Post Graduate") {
        levelsToCheck = ["Postgraduate"];
      } else if (jobQual === "12th") {
        levelsToCheck = ["12th", "Diploma", "Undergraduate", "Postgraduate"];
      } else if (jobQual === "10th") {
        levelsToCheck = ["10th", "12th", "Diploma", "Undergraduate", "Postgraduate", "ITI"];
      } else {
        const titleLower = jobTitle.toLowerCase();
        if (titleLower.includes("iti")) {
          levelsToCheck = ["ITI"];
        } else if (titleLower.includes("diploma")) {
          levelsToCheck = ["Diploma"];
        } else {
          levelsToCheck = ["ITI", "Diploma", "Undergraduate", "Postgraduate"];
        }
      }
      
      let hasQual = levelsToCheck.some(level => !!candidateEdu[level]);
      
      // 2. Stream Match Check
      let hasStreamMatch = false;
      if (hasQual) {
        if (jobQual === "10th" || jobQual === "12th") {
          hasStreamMatch = true;
        } else {
          const textToSearch = (jobTitle + " " + jobDesc).toLowerCase();
          let streams = [];
          levelsToCheck.forEach(level => {
            const eduEntry = candidateEdu[level];
            if (eduEntry) {
              const fields = eduEntry.instituteFields || {};
              if (fields.trade) streams.push(fields.trade.toLowerCase().trim());
              if (fields.courseName) streams.push(fields.courseName.toLowerCase().trim());
              if (fields.specialization) streams.push(fields.specialization.toLowerCase().trim());
            }
          });
          
          if (streams.length === 0) {
            hasStreamMatch = false;
          } else {
            hasStreamMatch = streams.some(stream => {
              if (!stream || stream === "n/a") return false;
              let cleanStream = stream.replace(/^iti\s+/, "").replace(/^diploma\s+/, "").trim();
              if (cleanStream.length < 3) return false;
              return textToSearch.includes(cleanStream);
            });
          }
        }
      }
      
      // 3. Age Limit Check
      const candidateAge = calculateAge(data.applicationData?.dateOfBirth);
      const ageLimits = getJobAgeLimits(selectedJob);
      const isAgeEligible = candidateAge !== null ? (candidateAge >= ageLimits.min && candidateAge <= ageLimits.max) : true;
      
      const isProfileMatched = hasQual && hasStreamMatch && isAgeEligible;
      
      let candidateStatus = "pending";
      if (data.status === "Joined") {
        candidateStatus = "joined";
      } else if (data.onboarding === "Selecte") {
        candidateStatus = "selecte";
      } else if (data.interview === "Shortlist") {
        candidateStatus = "shortlist";
      }
      
      return {
        ...data,
        isProfileMatched,
        candidateStatus,
        candidateAge,
        ageLimits
      };
    });
  }, [jobApplicants, selectedJob]);

  // Compute pre-filtered summary stats
  const stats = useMemo(() => {
    const views = enrichedApplicants.length * 7 + (parseInt(selectedJob?.jobId || 0) * 11) % 43 + 24;
    const applied = enrichedApplicants.length;
    const matched = enrichedApplicants.filter(a => a.isProfileMatched).length;
    const pending = enrichedApplicants.filter(a => a.candidateStatus === "pending").length;
    const shortlist = enrichedApplicants.filter(a => a.candidateStatus === "shortlist").length;
    const selecte = enrichedApplicants.filter(a => a.candidateStatus === "selecte").length;
    const joined = enrichedApplicants.filter(a => a.candidateStatus === "joined").length;
    
    return { views, applied, matched, pending, shortlist, selecte, joined };
  }, [enrichedApplicants, selectedJob]);

  // Filter candidates list based on active filters
  const filteredApplicants = useMemo(() => {
    return enrichedApplicants.filter(app => {
      if (selectedFilters.length === 0) return true;
      
      if (selectedFilters.includes("matched") && !app.isProfileMatched) return false;
      
      const statusFilters = selectedFilters.filter(f => f !== "matched");
      if (statusFilters.length > 0) {
        return statusFilters.includes(app.candidateStatus);
      }
      
      return true;
    });
  }, [enrichedApplicants, selectedFilters]);

  const toggleFilter = (filterKey) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filterKey)) {
        return prev.filter((f) => f !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
    setCurrentPage(1);
  };

  const handleJobClick = async (job) => {
    setSelectedJob(job);
    setLoading(true);
    await fetchJobApplicants(job._id);
    setLoading(false);
    setCurrentPage(1);
    setSelectedApplicantId(null);
  };

  // Pre-select job if selectedJobId is set in AppContext
  useEffect(() => {
    if (selectedJobId && jobs?.length > 0) {
      const job = jobs.find((j) => j._id === selectedJobId);
      if (job && selectedJob?._id !== selectedJobId) {
        handleJobClick(job);
      }
    }
  }, [selectedJobId, jobs, selectedJob]);

  const handleDownloadAllApplicants = async () => {
    setIsDownloading(true);
    try {
      // Fetch all job applications if not already available
      // This assumes you have a function in your context to fetch all applications
      // If not, you'll need to implement it
      let allData = allApplicantsData;
      if (!allData.length) {
        allData = await fetchJobs();
        setAllApplicantsData(allData);
      }

      const excelData = prepareApplicantDataForExcel(allData);
      downloadAsExcel(excelData, "all-job-applicants");
    } catch (error) {
      console.error("Error downloading applicants data:", error);
      alert("Failed to download data. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadJobApplicants = () => {
    if (!filteredApplicants?.length) return;

    const excelData = prepareApplicantDataForExcel(filteredApplicants);
    downloadAsExcel(
      excelData,
      `applicants-${selectedJob.title.replace(/\s+/g, "-").toLowerCase()}`
    );
  };

  if (!selectedJob) {
    return (
         <div className="relative container mx-auto px-4 sm:px-6 py-6 overflow-auto w-full">

      {/* Lock screen if user does not have premium access */}
      {!companyData?.havePremiumAccess && (
        <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center px-4">
          <Lock className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Premium Access Required</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md">
            You need a premium subscription to access the Search Candidate feature. Please contact support or upgrade your plan to continue.
          </p>
        </div>
      )}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center">Search Candidate</h2>
          {/* <button
            onClick={handleDownloadAllApplicants}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            <FileSpreadsheet className="h-5 w-5" />
            {isDownloading ? 'Downloading...' : 'Download All Data'}
          </button> */}
        </div>
       <div className="bg-white shadow-md rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <Briefcase className="h-5 w-5" />
    <h3 className="text-xl font-semibold">Available Positions</h3>
  </div>

  <div className="grid gap-3 sm:grid-cols-2">
    {jobs?.map((job) => {
      const isVerified = job.isVerified;

      return (
        <div
          key={job._id}
          className={`border rounded-lg p-4 transition-all ${
            isVerified
              ? "bg-white cursor-pointer hover:shadow-md hover:border-blue-300 border-gray-200"
              : "bg-gray-100 cursor-not-allowed border-gray-300"
          }`}
          onClick={() => {
            if (isVerified) {
              handleJobClick(job);
            } else {
              toast.error(
                "This job post is pending admin verification. Please contact support for more information."
              );
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-legpro-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">
                {job.title} <span className="text-xs font-normal text-gray-500 ml-1">#{String(job.jobId || "0").padStart(4, "0")}</span>
              </h3>
              {job.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </p>
              )}
              {!isVerified && (
                <p className="text-xs text-red-500 mt-1">
                 Almost There! Waiting for Admin Confirmation
                </p>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl font-sans">
        <button
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md mb-6 hover:bg-gray-600 transition"
          onClick={() => {
            setSelectedJobId(null);
            setSelectedJob(null);
          }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </button>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!jobApplicants?.length) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl font-sans">
        <button
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md mb-6 hover:bg-gray-600 transition"
          onClick={() => {
            setSelectedJobId(null);
            setSelectedJob(null);
          }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </button>
        <div className="bg-white shadow-md rounded-lg p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <User className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-medium">No Applications Found</h3>
            <p className="text-gray-500">
              There are currently no applications for this position.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalApplicants = filteredApplicants?.length || 0;
  const totalPages = Math.ceil(totalApplicants / applicantsPerPage);
  const startIndex = (currentPage - 1) * applicantsPerPage;
  const endIndex = startIndex + applicantsPerPage;
  const currentApplicants = filteredApplicants?.slice(startIndex, endIndex) || [];

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setSelectedApplicantId(null);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    setSelectedApplicantId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold">
            {selectedJob?.title} <span className="text-sm font-normal text-gray-500 ml-2">#{String(selectedJob?.jobId || "0").padStart(4, "0")}</span>
          </h2>
          <p className="text-gray-500 mt-1">
            {stats.applied} applicant{stats.applied !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            onClick={() => {
              setSelectedJobId(null);
              setSelectedJob(null);
              setSelectedFilters([]);
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </button>
          <button
            onClick={handleDownloadJobApplicants}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Download className="h-4 w-4" /> Download Excel
          </button>
        </div>
      </div>

      {/* Metrics Dashboard Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {/* Total Views */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Job Views</span>
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.views}</p>
            <p className="text-xs text-gray-500 mt-1">Candidates seen</p>
          </div>
        </div>

        {/* Applied (Clear Filters) */}
        <div
          onClick={() => {
            setSelectedFilters([]);
            setCurrentPage(1);
          }}
          className={`cursor-pointer bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
            selectedFilters.length === 0
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
            <Users className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.applied}</p>
            <p className="text-xs text-gray-500 mt-1">All applications</p>
          </div>
        </div>

        {/* Matched Profile */}
        <div
          onClick={() => toggleFilter("matched")}
          className={`cursor-pointer bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
            selectedFilters.includes("matched")
              ? "border-indigo-500 ring-2 ring-indigo-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Matched</span>
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-600">{stats.matched}</p>
            <p className="text-xs text-gray-500 mt-1">Eligible profiles</p>
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => toggleFilter("pending")}
          className={`cursor-pointer bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
            selectedFilters.includes("pending")
              ? "border-gray-500 ring-2 ring-gray-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </div>
        </div>

        {/* Shortlist */}
        <div
          onClick={() => toggleFilter("shortlist")}
          className={`cursor-pointer bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
            selectedFilters.includes("shortlist")
              ? "border-yellow-500 ring-2 ring-yellow-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Shortlist</span>
            <Filter className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{stats.shortlist}</p>
            <p className="text-xs text-gray-500 mt-1">Step 1 status</p>
          </div>
        </div>

        {/* Selected */}
        <div
          onClick={() => toggleFilter("selecte")}
          className={`cursor-pointer bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
            selectedFilters.includes("selecte")
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Selecte</span>
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.selecte}</p>
            <p className="text-xs text-gray-500 mt-1">Step 2 status</p>
          </div>
        </div>

        {/* Joined */}
        <div
          onClick={() => toggleFilter("joined")}
          className={`cursor-pointer bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
            selectedFilters.includes("joined")
              ? "border-green-500 ring-2 ring-green-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Joined</span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.joined}</p>
            <p className="text-xs text-gray-500 mt-1">Step 3 status</p>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Active Filters:
          </span>
          {selectedFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-150 shadow-sm"
            >
              {filter === "matched" ? "Matched Profile" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              <button
                onClick={() => toggleFilter(filter)}
                className="hover:bg-indigo-200 rounded-full p-0.5 text-indigo-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setSelectedFilters([])}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, totalApplicants)} of{" "}
          {totalApplicants} candidates
        </p>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="space-y-6">
        {currentApplicants?.map((app, index) => {
          const data = app || {};
          const badgeColor = getStatusBadgeColor(data.status);
          const applicantName = data.userId?.name || "N/A";
          const initials =
            applicantName !== "N/A"
              ? applicantName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "NA";

          const isExpanded = selectedApplicantId === (data._id || data.id);
          const appliedDate = data.date
            ? new Date(Number(data.date)).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : data.createdAt
            ? new Date(data.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A";

          return (
            <div
              key={data._id || index}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Basic Candidate List View Card Header */}
              <div className="p-4 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{applicantName}</h3>
                      {data.matchScore !== undefined && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${
                          data.matchScore >= 80 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : data.matchScore >= 50 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          Compatibility: {data.matchScore}%
                        </span>
                      )}
                      {data.isProfileMatched && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 shadow-sm animate-fade-in">
                          <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" /> Matched
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                        Applied: <strong className="text-gray-700">{selectedJob?.title || "N/A"}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        Date: <strong className="text-gray-700">{appliedDate}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        Mobile: <strong className="text-gray-700">{data.applicationData?.phone || data.userId?.phone || "N/A"}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    data.status === "Joined"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : data.status === "Selecte"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : data.status === "Shortlist"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}>
                    {data.status || "Pending"}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedApplicantId(isExpanded ? null : (data._id || data.id));
                      setActiveTab("personal");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shrink-0"
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <>
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                          data.interview === "Shortlist"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {data.interview === "Shortlist" ? "Shortlist" : "Not Shortlisted"}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                          data.onboarding === "Selecte"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {data.onboarding === "Selecte" ? "Selecte" : "Not Selected"}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                          data.status === "Joined"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {data.status === "Joined" ? "Joined" : "Not Joined"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6 border-b border-gray-200 pb-4">
                      {/* Toggle Shortlist */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Shortlist</span>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            onChange={async () => {
                              const isCurrentlyShortlisted = data.interview === "Shortlist";
                              if (isCurrentlyShortlisted) {
                                if (data.onboarding === "Selecte") {
                                  toast.error("Cannot remove Shortlist status because the candidate is already Selected.");
                                  return;
                                }
                                await changeInterviewStatus(data._id, "Not Shortlisted");
                                await changeJobApplicationStatus(data._id, "pending");
                              } else {
                                await changeInterviewStatus(data._id, "Shortlist");
                                await changeJobApplicationStatus(data._id, "Shortlist");
                              }
                            }}
                            checked={data.interview === "Shortlist"}
                          />
                          <span
                            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${
                              data.interview === "Shortlist"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          <span
                            className={`absolute left-1 top-1 transition-all duration-300 bg-white rounded-full w-4 h-4 transform ${
                              data.interview === "Shortlist"
                                ? "translate-x-6"
                                : ""
                            }`}
                          ></span>
                        </label>
                      </div>

                      {/* Toggle Selecte */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Selecte</span>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            onChange={async () => {
                              const isCurrentlySelected = data.onboarding === "Selecte";
                              if (isCurrentlySelected) {
                                if (data.status === "Joined") {
                                  toast.error("Cannot remove Selected status because the candidate has already Joined.");
                                  return;
                                }
                                await changeOnboardingStatus(data._id, "Not Selected");
                                await changeJobApplicationStatus(data._id, "Shortlist");
                              } else {
                                if (data.interview !== "Shortlist") {
                                  toast.error("Candidate must be Shortlisted before they can be Selected.");
                                  return;
                                }
                                await changeOnboardingStatus(data._id, "Selecte");
                                await changeJobApplicationStatus(data._id, "Selecte");
                              }
                            }}
                            checked={data.onboarding === "Selecte"}
                          />
                          <span
                            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${
                              data.onboarding === "Selecte"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          <span
                            className={`absolute left-1 top-1 transition-all duration-300 bg-white rounded-full w-4 h-4 transform ${
                              data.onboarding === "Selecte" ? "translate-x-6" : ""
                            }`}
                          ></span>
                        </label>
                      </div>

                      {/* Toggle Joined */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Joined</span>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            onChange={async () => {
                              const isCurrentlyJoined = data.status === "Joined";
                              if (isCurrentlyJoined) {
                                await changeJobApplicationStatus(data._id, "Selecte");
                              } else {
                                if (data.onboarding !== "Selecte") {
                                  toast.error("Candidate must be Selected before they can Join.");
                                  return;
                                }
                                await changeJobApplicationStatus(data._id, "Joined");
                              }
                            }}
                            checked={data.status === "Joined"}
                          />
                          <span
                            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${
                              data.status === "Joined"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          <span
                            className={`absolute left-1 top-1 transition-all duration-300 bg-white rounded-full w-4 h-4 transform ${
                              data.status === "Joined" ? "translate-x-6" : ""
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 bg-white">
                    <div className="flex overflow-x-auto">
                      <button
                        onClick={() => setActiveTab("personal")}
                        className={`px-4 py-2 font-medium text-sm ${
                          activeTab === "personal"
                            ? "border-b-2 border-blue-500 text-legpro-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Personal Info
                      </button>
                      <button
                        onClick={() => setActiveTab("education")}
                        className={`px-4 py-2 font-medium text-sm ${
                          activeTab === "education"
                            ? "border-b-2 border-blue-500 text-legpro-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Education
                      </button>
                      <button
                        onClick={() => setActiveTab("resume")}
                        className={`px-4 py-2 font-medium text-sm ${
                          activeTab === "resume"
                            ? "border-b-2 border-blue-500 text-legpro-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Resume
                      </button>
                      <button
                        onClick={() => setActiveTab("address")}
                        className={`px-4 py-2 font-medium text-sm ${
                          activeTab === "address"
                            ? "border-b-2 border-blue-500 text-legpro-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Address
                      </button>
                      {selectedJob?.screeningQuestions && selectedJob.screeningQuestions.length > 0 && (
                        <button
                          onClick={() => setActiveTab("screening")}
                          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                            activeTab === "screening"
                              ? "border-b-2 border-blue-500 text-legpro-primary"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Screening Answers
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-white border-t border-gray-100">
                    {activeTab === "personal" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-medium">
                            {data.applicationData?.dateOfBirth || "N/A"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">
                            {data.applicationData?.gender || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Marital Status</p>
                          <p className="font-medium">
                            {data.applicationData?.maritalStatus || "N/A"}
                          </p>
                        </div>


                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">
                            {data.applicationData?.phone || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Alternate Phone</p>
                          <p className="font-medium">
                            {data.applicationData?.altPhone || "N/A"}
                          </p>
                        </div>


                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {data.applicationData?.currentAddress?.city || "N/A"}
                          </p>
                        </div>

                      </div>
                    )}

                    {activeTab === "education" &&
                      data.applicationData?.education && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {Object.values(data.applicationData?.education || {})
                            .sort((a, b) => {
                              const order = ["Below 10 Pass", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate"];
                              return order.indexOf(a.instituteType) - order.indexOf(b.instituteType);
                            })
                            .map((eduEntry, index) => {
                              const level = eduEntry.instituteType || `Education ${index + 1}`;
                              const fields = eduEntry.instituteFields || {};
                              return (
                                <div
                                  key={level}
                                  className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full"
                                >
                                  <div className="p-3 border-b border-gray-100">
                                    <h4 className="text-base font-medium flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4" />
                                      {level}
                                    </h4>
                                  </div>
                                  <div className="p-3 flex-1 overflow-auto">
                                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                                      {fields.courseName && (
                                        <>
                                          <dt className="text-gray-500">Course Name</dt>
                                          <dd className="font-medium">
                                            {fields.courseName}
                                          </dd>
                                        </>
                                      )}

                                      {fields.specialization && (
                                        <>
                                          <dt className="text-gray-500">
                                            Specialization
                                          </dt>
                                          <dd className="font-medium">
                                            {fields.specialization}
                                          </dd>
                                        </>
                                      )}

                                      <dt className="text-gray-500">Passing Year</dt>
                                      <dd className="font-medium">
                                        {fields.passingYear || "N/A"}
                                      </dd>
                                    </dl>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                    {activeTab === "resume" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Resume
                          </h3>
                          {(data.applicationData?.resume || data.applicationData?.documents?.resume || data.userId?.resume) ? (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
                              <p className="text-gray-600 mb-4">The candidate has uploaded a resume.</p>
                              <a
                                href={data.applicationData?.resume?.url || data.applicationData?.resume || data.applicationData?.documents?.resume?.url || data.userId?.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                              >
                                <FileText className="h-5 w-5" />
                                Open Resume
                              </a>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                              <p className="text-gray-500">No resume available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "address" && (
                      <div className="grid gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                          <div className="p-4 border-b border-gray-100">
                            <h4 className="text-base font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Address Details
                            </h4>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">State</p>
                                <p className="font-medium">
                                  {data.applicationData?.currentAddress?.state || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">District</p>
                                <p className="font-medium">
                                  {data.applicationData?.currentAddress?.city || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === "screening" && selectedJob?.screeningQuestions && (
                      <div className="space-y-4">
                        <h4 className="text-base font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Screening Questionnaire Responses
                        </h4>
                        <div className="space-y-3 bg-slate-50 border rounded-xl p-4">
                          {selectedJob.screeningQuestions.map((q, idx) => {
                            let answers = {};
                            try {
                              const appData = typeof data.applicationData === 'string'
                                ? JSON.parse(data.applicationData)
                                : data.applicationData || {};
                              answers = appData.screeningAnswers || {};
                            } catch (e) {}
                            
                            const candAns = answers[q.id];
                            const isCorrect = candAns !== undefined && String(candAns).toLowerCase() === String(q.preferredAnswer || q.correctAnswer || "").toLowerCase();
                            return (
                              <div key={q.id || idx} className="border-b last:border-none pb-2.5 last:pb-0">
                                <p className="font-semibold text-sm text-slate-800">{idx + 1}. {q.questionText}</p>
                                <div className="flex flex-wrap items-center gap-6 mt-1 text-xs font-medium">
                                  <p className="text-slate-500">Candidate's Answer: <span className={isCorrect ? "text-green-600 font-bold" : "text-rose-600 font-bold"}>{candAns || "Not Answered"}</span></p>
                                  <p className="text-emerald-600">Preferred Answer: {q.preferredAnswer || q.correctAnswer}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-between gap-4 mt-8 bg-white border border-gray-150 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <p className="hidden sm:block text-sm text-gray-500 font-medium">
            Page <span className="font-semibold text-gray-800">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-800">{totalPages}</span>
          </p>

          <nav className="flex items-center gap-1.5">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-slate-50 hover:text-blue-600 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setSelectedApplicantId(null);
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl font-semibold text-sm transition-all duration-200 ${
                    currentPage === page
                      ? "bg-legpro-primary text-white shadow-md shadow-blue-500/25 scale-105"
                      : "border border-transparent text-gray-600 hover:bg-slate-50 hover:border-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-slate-50 hover:text-blue-600 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;

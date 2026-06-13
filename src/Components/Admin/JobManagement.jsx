import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/Components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";

// Presentational components extracted for readability
import ApplicantsModal from "./JobManagementComponents/ApplicantsModal";
import EditJobModal from "./JobManagementComponents/EditJobModal";
import JobCard from "./JobManagementComponents/JobCard";
import JobFilters from "./JobManagementComponents/JobFilters";
import UserProfileModal from "./JobManagementComponents/UserProfileModal";
import EligibleCandidatesModal from "./JobManagementComponents/EligibleCandidatesModal";
import { Button } from "@/Components/ui/button";
import { Building2 } from "lucide-react";

const backendUrl = import.meta.env?.VITE_API_URL;

const JobManagement = ({ showEligibleView = false, readOnly = false }) => {
  // --- STATE MANAGEMENT ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [editModal, setEditModal] = useState({ open: false, job: null });
  const [applicantsModal, setApplicantsModal] = useState({
    open: false,
    job: null,
    applicants: [],
  });
  const [eligibleModal, setEligibleModal] = useState({
    open: false,
    job: null,
    candidates: [],
  });
  const [userProfileModal, setUserProfileModal] = useState({
    open: false,
    user: null,
    application: null,
  });
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);
  const [loadingEligible, setLoadingEligible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    userProfileModal.application
      ? userProfileModal.application.status?.toLowerCase()
      : "pending"
  );
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    level: "",
    experience: 0,
    requirements: "",
    employmentType: "",
    salary: 0,
    openings: 1,
    deadline: "",
    visible: false,
    
    // Advanced fields
    companyId: "",
    companyName: "",
    companyDesc: "",
    companyCity: "",
    companyState: "",
    companyCountry: "",
    jobType: "white",
    vacancies: "",
    immediateJoining: false,
    joiningWithin: "15 Days",
    experienceOption: "Fresher",
    minExperience: "",
    maxExperience: "",
    minAge: "",
    maxAge: "",
    genderPreference: "Any",
    educationRequirements: [{ qualification: "ITI", specializations: [] }],
    languages: [],
    requiredDocuments: [],
    shiftDetails: {
      shiftType: "General Shift",
      shiftTiming: "",
      weeklyOff: "Sunday",
      workingDays: "6"
    },
    salaryBreakdown: {
      inHand: "",
      gross: "",
      ctc: "",
      variablePay: "",
      incentives: "",
      attendanceBonus: "",
      productionBonus: "",
      otAvailable: "No",
      otRate: ""
    },
    benefits: {
      food: [],
      transportation: [],
      uniform: [],
      incentives: [],
      overtime: [],
      accommodation: [],
      healthcare: [],
      other: []
    },
    workLocationDetails: {
      plantName: "",
      unitName: "",
      address: "",
      pinCode: "",
      latitude: "",
      longitude: ""
    },
    hrContact: {
      name: "",
      mobile: "",
      alternateMobile: "",
      email: "",
      whatsapp: ""
    },
    interviewProcess: {
      type: "Walk-In Interview",
      date: "",
      time: "",
      address: "",
      link: ""
    },
    screeningQuestions: []
  });

  const jobsPerPage = 10;

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/admin/jobs`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error(error.response?.data?.message || "Could not fetch jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (editModal.open || applicantsModal.open || userProfileModal.open || eligibleModal.open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editModal.open, applicantsModal.open, userProfileModal.open, eligibleModal.open]);

  // --- FILTERING & PAGINATION ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyId?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          String(job.jobId).includes(searchQuery)) &&
        job.category?.toLowerCase().includes(filterCategory.toLowerCase()) &&
        job.location?.toLowerCase().includes(filterLocation.toLowerCase())
    );
  }, [jobs, searchQuery, filterCategory, filterLocation]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // --- CSV EXPORT HELPERS ---
  const exportJobsCSV = () => {
    const now = new Date();
    const rows = filteredJobs.map((job) => {
      const deadline = job.deadline ? new Date(job.deadline) : null;
      let status = job.visible ? "Active" : "Inactive";
      if (deadline && deadline < now) status = "Expired";
      return {
        Title: job.title || "",
        Company: job.companyId?.name || "",
        Location: job.location || "",
        Category: job.category || "",
        "Employment Type": job.employmentType || "",
        Salary: job.salary || "",
        Openings: job.openings || "",
        Experience: job.experience || "",
        Deadline: job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "",
        Visible: job.visible ? "Yes" : "No",
        Status: status,
        "Posted On": new Date(job.date || job.createdAt || Date.now()).toLocaleDateString("en-IN"),
      };
    });
    exportToCSV({ data: rows, filename: "jobs" });
  };

  const exportApplicantsCSV = () => {
    const rows = (applicantsModal.applicants || []).map((application) => {
      const applicant = application.userId || application;
      return {
        Name: applicant.name || applicant.firstName || "",
        Email: applicant.email || "",
        Phone: applicant.phone || "",
        Status: (application.status || "").toString(),
        "Applied On": new Date(
          application.appliedAt || application.createdAt || Date.now()
        ).toLocaleString("en-IN"),
        "Resume URL": applicant.resume || applicant.resumeUrl || "",
      };
    });
    exportToCSV({ data: rows, filename: `applications_${applicantsModal.job?.title || "job"}` });
  };

  // --- EVENT HANDLERS ---
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const resp = await axios.delete(`${backendUrl}/api/admin/jobs/${jobId}`, {
        withCredentials: true,
      });
      if (resp.data.success) {
        toast.success("Job deleted successfully");
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      } else {
        toast.error(resp.data.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Delete job error:", error);
      toast.error(error.response?.data?.message || "Deletion failed");
    }
  };

  const handleViewApplications = async (job) => {
    setLoadingApplicants(true);
    setApplicantsModal({ open: true, job: job, applicants: [] });

    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/job-applicants/${job._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setApplicantsModal((prev) => ({
          ...prev,
          applicants: response.data.applications || [],
        }));
      } else {
        toast.error(response.data.message || "Failed to fetch applicants");
      }
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      toast.error(
        error.response?.data?.message || "Could not fetch applicants."
      );
    } finally {
      setLoadingApplicants(false);
    }
  };

  const closeApplicantsModal = () => {
    setApplicantsModal({ open: false, job: null, applicants: [] });
  };

  const handleViewEligibleCandidates = async (job) => {
    setLoadingEligible(true);
    setEligibleModal({ open: true, job, candidates: [] });
    try {
      const response = await axios.get(`${backendUrl}/api/admin/jobs/${job._id}/eligible-candidates`, {
        withCredentials: true
      });
      if (response.data.success) {
        setEligibleModal(prev => ({ ...prev, candidates: response.data.candidates || [] }));
      }
    } catch (error) {
      console.error("Error fetching eligible candidates:", error);
      toast.error("Failed to load eligible candidates");
    } finally {
      setLoadingEligible(false);
    }
  };

  const closeEligibleModal = () => {
    setEligibleModal({ open: false, job: null, candidates: [] });
  };

  const handleViewUserProfile = async (userId, application = null) => {
    setLoadingUserProfile(true);
    setUserProfileModal({ open: true, user: null, application: null });

    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/user-profile/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserProfileModal((prev) => ({
          ...prev,
          user: response.data.profile || response.data.user,
          application: application,
        }));
        setSelectedStatus(
          application ? application.status?.toLowerCase() : "pending"
        );
      } else {
        toast.error(response.data.message || "Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error(
        error.response?.data?.message || "Could not fetch user profile."
      );
    } finally {
      setLoadingUserProfile(false);
    }
  };

  const closeUserProfileModal = () => {
    setUserProfileModal({ open: false, user: null, application: null });
  };

  // --- APPLICATION STATUS MANAGEMENT ---
  const handleUpdateStatus = async (
    applicationId,
    applicantName,
    newStatus
  ) => {
    if (updateStatusLoading) return;
    try {
      setUpdateStatusLoading(true);

      const response = await axios.put(
        `${backendUrl}/api/admin/applications/${applicationId}/status`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the applicants list in the modal
        setApplicantsModal((prev) => ({
          ...prev,
          applicants: prev.applicants.map((applicant) => {
            const id = applicant._id || applicant.applicationId;
            return id === applicationId
              ? { ...applicant, status: newStatus }
              : applicant;
          }),
        }));

        // Update the user profile modal if it's open for this application
        if (
          userProfileModal.application &&
          (userProfileModal.application._id === applicationId ||
            userProfileModal.application.applicationId === applicationId)
        ) {
          setUserProfileModal((prev) => ({
            ...prev,
            application: { ...prev.application, status: newStatus },
          }));
        }

        toast.success(
          `Application from ${applicantName} has been updated successfully!`
        );
      } else {
        toast.error(response.data.message || "Failed to update application");
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error(
        `Failed to accept application from ${applicantName}. Please try again.`
      );
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const handleVerifyJob = async (jobId, status) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/jobs/${jobId}/verify`,
        { status },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Job ${status.toLowerCase()} successfully`);
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? response.data.job : j))
        );
      } else {
        toast.error(response.data.message || "Action failed");
      }
    } catch (error) {
      console.error("Error verifying job:", error);
      toast.error(error.response?.data?.message || "Error verifying job");
    }
  };

  const getApplicationStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "joined":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Joined
          </Badge>
        );
      case "selecte":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            Selecte
          </Badge>
        );
      case "shortlist":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Shortlist
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Accepted
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "under_review":
        return <Badge variant="warning">Under Review</Badge>;
      case "interviewed":
        return <Badge variant="primary">Interviewed</Badge>;
      case "onboarded":
        return <Badge variant="primary">Onboarded</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const startEdit = (job) => {
    setEditForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      category: job.category || "",
      level: job.level || "",
      experience: job.experience || 0,
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join(", ")
        : job.requirements || "",
      employmentType: job.employmentType || "",
      salary: job.salary || 0,
      openings: job.openings || 1,
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
      visible: job.visible || false,
      
      // Advanced fields
      companyId: job.companyId?._id || job.companyId || "",
      companyName: job.companyDetails?.name || "",
      companyDesc: job.companyDetails?.shortDescription || "",
      companyCity: job.companyDetails?.city || "",
      companyState: job.companyDetails?.state || "",
      companyCountry: job.companyDetails?.country || "",
      jobType: job.jobType || "white",
      vacancies: job.vacancies ? String(job.vacancies) : "",
      immediateJoining: job.immediateJoining || false,
      joiningWithin: job.joiningWithin || "15 Days",
      experienceOption: job.experienceOption || "Fresher",
      minExperience: job.minExperience ? String(job.minExperience) : "",
      maxExperience: job.maxExperience ? String(job.maxExperience) : "",
      minAge: job.minAge ? String(job.minAge) : "",
      maxAge: job.maxAge ? String(job.maxAge) : "",
      genderPreference: job.genderPreference || "Any",
      educationRequirements: job.educationRequirements && Array.isArray(job.educationRequirements)
        ? job.educationRequirements
        : [{ qualification: job.qualification || "ITI", specializations: [] }],
      languages: job.languages || [],
      requiredDocuments: job.requiredDocuments || [],
      shiftDetails: {
        shiftType: job.shiftDetails?.shiftType || "General Shift",
        shiftTiming: job.shiftDetails?.shiftTiming || "",
        weeklyOff: job.shiftDetails?.weeklyOff || "Sunday",
        workingDays: job.shiftDetails?.workingDays || "6"
      },
      salaryBreakdown: {
        inHand: job.salaryBreakdown?.inHand || "",
        gross: job.salaryBreakdown?.gross || "",
        ctc: job.salaryBreakdown?.ctc || String(job.salary || ""),
        variablePay: job.salaryBreakdown?.variablePay || "",
        incentives: job.salaryBreakdown?.incentives || "",
        attendanceBonus: job.salaryBreakdown?.attendanceBonus || "",
        productionBonus: job.salaryBreakdown?.productionBonus || "",
        otAvailable: job.salaryBreakdown?.otAvailable || "No",
        otRate: job.salaryBreakdown?.otRate || ""
      },
      benefits: {
        food: job.benefits?.food || [],
        transportation: job.benefits?.transportation || [],
        uniform: job.benefits?.uniform || [],
        incentives: job.benefits?.incentives || [],
        overtime: job.benefits?.overtime || [],
        accommodation: job.benefits?.accommodation || [],
        healthcare: job.benefits?.healthcare || [],
        other: job.benefits?.other || []
      },
      workLocationDetails: {
        plantName: job.workLocationDetails?.plantName || "",
        unitName: job.workLocationDetails?.unitName || "",
        address: job.workLocationDetails?.address || "",
        pinCode: job.workLocationDetails?.pinCode || "",
        latitude: job.workLocationDetails?.latitude || "",
        longitude: job.workLocationDetails?.longitude || ""
      },
      hrContact: {
        name: job.hrContact?.name || job.companyDetails?.hrName || "",
        mobile: job.hrContact?.mobile || job.companyDetails?.hrPhone || "",
        alternateMobile: job.hrContact?.alternateMobile || "",
        email: job.hrContact?.email || job.companyDetails?.hrEmail || "",
        whatsapp: job.hrContact?.whatsapp || ""
      },
      interviewProcess: {
        type: job.interviewProcess?.type || "Walk-In Interview",
        date: job.interviewProcess?.date || "",
        time: job.interviewProcess?.time || "",
        address: job.interviewProcess?.address || "",
        link: job.interviewProcess?.link || ""
      },
      screeningQuestions: job.screeningQuestions || []
    });
    setEditModal({ open: true, job: job });
  };

  const closeEdit = () => {
    setEditModal({ open: false, job: null });
  };

  const submitEdit = async () => {
    if (!editModal.job) return;
    try {
      const payload = {
        ...editForm,
        salary: Number(editForm.salaryBreakdown?.ctc) || Number(editForm.salary) || 0,
        openings: Number(editForm.vacancies) || Number(editForm.openings) || 1,
        experience: editForm.experienceOption === "Fresher" ? 0 : Number(editForm.minExperience || 0),
        requirements:
          typeof editForm.requirements === "string"
            ? editForm.requirements
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : editForm.requirements,
      };
      const resp = await axios.put(
        `${backendUrl}/api/admin/jobs/${editModal.job._id}`,
        payload,
        { withCredentials: true }
      );
      if (resp.data.success) {
        toast.success("Job updated successfully");
        setJobs((prev) =>
          prev.map((j) => (j._id === editModal.job._id ? resp.data.job : j))
        );
        closeEdit();
      } else {
        toast.error(resp.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update job error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatSalary = (salary) => {
    if (!salary) return "N/A";
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${Math.round(salary / 1000)}K`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (job) => {
    const now = new Date();
    const deadline = new Date(job.deadline);
    if (job.deadline && deadline < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (job.status === "Approved") {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Approved
        </Badge>
      );
    }
    if (job.status === "Rejected") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    if (job.isEdited) {
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Under Review (Edited)</Badge>;
    }
    return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending Admin Verification</Badge>;
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Job Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters + Export */}
          <JobFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterLocation={filterLocation}
            setFilterLocation={setFilterLocation}
            exportJobsCSV={exportJobsCSV}
          />

          {/* Jobs Grid (presentational JobCard component handles rendering/actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                formatSalary={formatSalary}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onViewApplications={handleViewApplications}
                onViewEligible={handleViewEligibleCandidates}
                showEligibleView={showEligibleView}
                onEdit={startEdit}
                onDelete={handleDeleteJob}
                onVerify={handleVerifyJob}
                readOnly={readOnly}
              />
            ))}
          </div>

          {/* No jobs found */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-10">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterCategory || filterLocation
                  ? "Try adjusting your search or filters."
                  : "No jobs have been created yet."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Modal (moved to presentational component) */}
      {editModal.open && (
        <EditJobModal
          editModal={editModal}
          editForm={editForm}
          setEditForm={setEditForm}
          closeEdit={closeEdit}
          submitEdit={submitEdit}
        />
      )}

      {/* Applicants Modal (moved to presentational component) */}
      {applicantsModal.open && (
        <ApplicantsModal
          open={applicantsModal.open}
          applicantsModal={applicantsModal}
          loadingApplicants={loadingApplicants}
          closeApplicantsModal={closeApplicantsModal}
          handleViewUserProfile={handleViewUserProfile}
          exportApplicantsCSV={exportApplicantsCSV}
          getApplicationStatusBadge={getApplicationStatusBadge}
        />
      )}

      {/* User Profile Detail Modal (moved to presentational component) */}
      {userProfileModal.open && (
        <UserProfileModal
          open={userProfileModal.open}
          userProfileModal={userProfileModal}
          loadingUserProfile={loadingUserProfile}
          closeUserProfileModal={closeUserProfileModal}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleUpdateStatus={handleUpdateStatus}
          updateStatusLoading={updateStatusLoading}
          getApplicationStatusBadge={getApplicationStatusBadge}
        />
      )}

      {/* Eligible Candidates Modal */}
      {eligibleModal.open && (
        <EligibleCandidatesModal
          modal={eligibleModal}
          loading={loadingEligible}
          onClose={closeEligibleModal}
          onViewProfile={(candidate) => {
            // Can extend to show CRM candidate profile if needed
            toast.success(`Viewing profile of ${candidate.name}`);
          }}
        />
      )}
    </div>
  );
};

export default JobManagement;



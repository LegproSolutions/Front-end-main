import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  User,
  Award,
  Clock,
  ChevronLeft,
  ArrowRight,
  LogIn,
  FileText,
  Gift,
  IndianRupee,
  Share2,
  Building,
  Layers,
  ShieldCheck,
  Home,
  Bus,
  Shirt,
  Coins,
  Coffee,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  Mail,
  Info,
  Percent,
  Footprints,
  Egg,
  Utensils
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isUserAuthenticated, setShowUserLogin, userApplications, userData, profileCompletion, applyForJob, fetchUserJobApplications } = useContext(AppContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && job && location.state?.scrollToChecklist) {
      setTimeout(() => {
        const element = document.getElementById("pre-apply-checklist");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [loading, job, location.state]);
  const backendUrl = import.meta.env?.VITE_API_URL;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          toast.error("Job not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Something went wrong!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate, backendUrl]);

  const evaluateEligibility = () => {
    if (!isUserAuthenticated || !userData || !job) return null;
    
    let qualMatch = false;
    let expMatch = false;
    let ageMatch = false;
    let langMatch = false;
    let genderMatch = false;
    
    // 1. Qualification Match
    if (job.educationRequirements && Array.isArray(job.educationRequirements) && job.educationRequirements.length > 0) {
      let candidateEdu = [];
      try {
        if (userData.education) {
          candidateEdu = typeof userData.education === 'string'
            ? JSON.parse(userData.education)
            : userData.education;
        }
      } catch (e) {}
      if (!Array.isArray(candidateEdu)) {
        candidateEdu = Object.values(candidateEdu || {});
      }
      
      for (const reqBlock of job.educationRequirements) {
        const matchedEdu = candidateEdu.find(edu => 
          (edu.qualification?.toLowerCase() === reqBlock.qualification?.toLowerCase()) || 
          (edu.instituteType?.toLowerCase() === reqBlock.qualification?.toLowerCase())
        );
        if (matchedEdu) {
          const fields = matchedEdu.instituteFields || matchedEdu || {};
          const spec = (fields.specialization || fields.trade || fields.stream || "");
          if (reqBlock.specializations && Array.isArray(reqBlock.specializations) && reqBlock.specializations.length > 0) {
            const specMatched = reqBlock.specializations.some(s => 
              spec.toLowerCase().includes(s.toLowerCase())
            );
            if (specMatched) {
              qualMatch = true;
              break;
            }
          } else {
            qualMatch = true;
            break;
          }
        }
      }
    } else {
      qualMatch = true; // No requirement means anyone matches
    }
    
    // 2. Experience Match
    let candidateExpYears = 0;
    if (userData.experience) {
      let parsedExp = [];
      try {
        parsedExp = typeof userData.experience === 'string'
          ? JSON.parse(userData.experience)
          : userData.experience;
      } catch (e) {}
      if (Array.isArray(parsedExp)) {
        candidateExpYears = parsedExp.reduce((sum, exp) => {
          const years = parseInt(exp.years || exp.experience || 0);
          return sum + (isNaN(years) ? 0 : years);
        }, 0);
      } else if (typeof parsedExp === 'object' && parsedExp !== null) {
        candidateExpYears = parseInt(parsedExp.years || parsedExp.experience || 0);
      } else if (typeof parsedExp === 'number') {
        candidateExpYears = parsedExp;
      }
    }
    
    if (job.experienceOption === "Fresher") {
      if (candidateExpYears === 0) expMatch = true;
    } else if (job.experienceOption === "Experienced") {
      const minExp = job.minExperience !== null && job.minExperience !== undefined ? job.minExperience : 0;
      const maxExp = job.maxExperience !== null && job.maxExperience !== undefined ? job.maxExperience : 99;
      if (candidateExpYears >= minExp && candidateExpYears <= maxExp) {
        expMatch = true;
      }
    } else {
      expMatch = true; // both/default
    }
    
    // 3. Age Match
    if (job.minAge !== null && job.minAge !== undefined || job.maxAge !== null && job.maxAge !== undefined) {
      if (userData.dateOfBirth) {
        const dob = new Date(userData.dateOfBirth);
        const ageDiffMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        const minAge = job.minAge !== null && job.minAge !== undefined ? job.minAge : 0;
        const maxAge = job.maxAge !== null && job.maxAge !== undefined ? job.maxAge : 99;
        if (age >= minAge && age <= maxAge) ageMatch = true;
      }
    } else {
      ageMatch = true;
    }
    
    // 4. Language Match
    if (job.languages && Array.isArray(job.languages) && job.languages.length > 0) {
      let candLanguages = [];
      try {
        if (userData.languages) {
          candLanguages = typeof userData.languages === 'string'
            ? JSON.parse(userData.languages)
            : userData.languages;
        }
      } catch (e) {}
      if (Array.isArray(candLanguages)) {
        const matches = job.languages.filter(lang => 
          candLanguages.some(candLang => {
            const name = typeof candLang === 'object' ? candLang.name : candLang;
            return name?.toLowerCase() === lang?.toLowerCase();
          })
        );
        if (matches.length > 0) langMatch = true;
      }
    } else {
      langMatch = true;
    }

    // 5. Gender Match
    if (job.genderPreference && job.genderPreference !== "Any") {
      if (userData.gender && userData.gender.toLowerCase() === job.genderPreference.toLowerCase()) {
        genderMatch = true;
      }
    } else {
      genderMatch = true;
    }
    
    // Calculate match percentage
    let totalChecks = 5;
    let successfulChecks = (qualMatch ? 1 : 0) + (expMatch ? 1 : 0) + (ageMatch ? 1 : 0) + (langMatch ? 1 : 0) + (genderMatch ? 1 : 0);
    const score = Math.round((successfulChecks / totalChecks) * 100);
    
    return {
      qualMatch,
      expMatch,
      ageMatch,
      langMatch,
      genderMatch,
      score
    };
  };

  const eligibility = evaluateEligibility();

  const [checklist, setChecklist] = useState({
    eduOk: false,
    docsOk: false,
    ageOk: false,
    expOk: false,
    langOk: false,
    shiftOk: false,
    locOk: false
  });

  const [saveStatus, setSaveStatus] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState(false);

  // Load checklist responses from database
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!isUserAuthenticated || !id) {
        setHasLoadedFromDb(false);
        return;
      }
      try {
        const { data } = await axios.get(`/api/profile/checklist/${id}`);
        if (data.success && data.answers) {
          setChecklist(data.answers);
          setSaveStatus("Responses Saved Automatically");
          setLastSaved(new Date());
        } else {
          // If no database state exists, initialize using eligibility checks
          if (eligibility) {
            setChecklist({
              eduOk: eligibility.qualMatch || false,
              docsOk: false,
              ageOk: eligibility.ageMatch || false,
              expOk: eligibility.expMatch || false,
              langOk: eligibility.langMatch || false,
              shiftOk: false,
              locOk: false
            });
          }
        }
      } catch (error) {
        console.error("Error fetching checklist:", error);
      } finally {
        setHasLoadedFromDb(true);
      }
    };
    fetchChecklist();
  }, [isUserAuthenticated, id]);

  // Sync eligibility changes (e.g. after profile update) and auto-save them
  useEffect(() => {
    if (hasLoadedFromDb && eligibility && isUserAuthenticated) {
      setChecklist(prev => {
        const updated = {
          ...prev,
          eduOk: eligibility.qualMatch || prev.eduOk,
          ageOk: eligibility.ageMatch || prev.ageOk,
          expOk: eligibility.expMatch || prev.expOk,
          langOk: eligibility.langMatch || prev.langOk,
        };

        const isChanged =
          updated.eduOk !== prev.eduOk ||
          updated.ageOk !== prev.ageOk ||
          updated.expOk !== prev.expOk ||
          updated.langOk !== prev.langOk;

        if (isChanged && id) {
          axios.post(`/api/profile/checklist/${id}`, { answers: updated })
            .then(() => {
              setSaveStatus("Responses Saved Automatically");
              setLastSaved(new Date());
            })
            .catch(err => console.error("Error auto-saving eligibility sync:", err));
        }

        return updated;
      });
    }
  }, [hasLoadedFromDb, isUserAuthenticated, userData, job, eligibility ? eligibility.score : null]);

  // Handle user toggles and auto-save immediately
  const handleChecklistChange = async (key) => {
    const updated = {
      ...checklist,
      [key]: !checklist[key]
    };
    setChecklist(updated);

    if (isUserAuthenticated && id) {
      setSaveStatus("Saving...");
      try {
        await axios.post(`/api/profile/checklist/${id}`, { answers: updated });
        setSaveStatus("Responses Saved Automatically");
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving checklist:", error);
        setSaveStatus("Failed to save responses");
      }
    }
  };

  const isChecklistComplete = Object.values(checklist).every(val => val === true);
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const checklistScore = Math.round((checkedCount / 7) * 100);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [isFromAutoApply, setIsFromAutoApply] = useState(false);
  const [showProfileWarningModal, setShowProfileWarningModal] = useState(false);

  useEffect(() => {
    if (isUserAuthenticated && userData && job) {
      const autoApply = sessionStorage.getItem("autoApplyPendingJob");
      const pendingJobId = sessionStorage.getItem("pendingJobId");
      if (autoApply === "true" && pendingJobId === id) {
        sessionStorage.removeItem("autoApplyPendingJob");
        sessionStorage.removeItem("pendingJobId");
        sessionStorage.removeItem("returnAfterProfile");
        
        if (isProfileComplete()) {
          setIsFromAutoApply(true);
          if (job?.screeningQuestions && Array.isArray(job.screeningQuestions) && job.screeningQuestions.length > 0) {
            setShowConfirmModal(true);
          } else {
            confirmApply();
          }
        }
      }
    }
  }, [isUserAuthenticated, userData, job, id]);

  const isProfileComplete = () => {
    if (!userData) return false;
    if (profileCompletion !== undefined) {
      return profileCompletion >= 71;
    }
    return false;
  };

  const confirmApply = async () => {
    if (job?.screeningQuestions && Array.isArray(job.screeningQuestions) && job.screeningQuestions.length > 0) {
      const unanswered = job.screeningQuestions.filter(q => !screeningAnswers[q.id]);
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
        if (isFromAutoApply) {
          toast.success("Your profile has been completed and your application has been submitted successfully.");
          setIsFromAutoApply(false);
        } else {
          toast.success("Job applied successfully.");
        }
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

  const matchedApplication = isUserAuthenticated && job && userApplications && userApplications.find((app) => app.jobId === job._id || (app.jobId && app.jobId._id === job._id));
  const hasApplied = !!matchedApplication;

  const getApplicationDateFormatted = () => {
    if (!matchedApplication) return "";
    const dateVal = matchedApplication.createdAt || matchedApplication.date;
    if (!dateVal) return "";
    const dateObj = new Date(typeof dateVal === "number" || typeof dateVal === "string" ? dateVal : Number(dateVal));
    if (isNaN(dateObj.getTime())) {
      try {
        const rawDate = new Date(matchedApplication.createdAt);
        if (!isNaN(rawDate.getTime())) {
          return rawDate.toLocaleDateString("en-GB");
        }
      } catch (e) {}
      return "N/A";
    }
    return dateObj.toLocaleDateString("en-GB");
  };

  const handleApplyClick = () => {
    if (hasApplied) return;
    if (!isUserAuthenticated) {
      toast.error("Please login to apply for this job");
      setShowUserLogin(true);
      return;
    }
    if (checklistScore < 50) {
      toast.error("Please select 'Yes' on at least 50% of the checklist items to apply.");
      const element = document.getElementById("pre-apply-checklist");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (!isProfileComplete()) {
      setShowProfileWarningModal(true);
      return;
    }
    if (job?.url) {
      return window.open(job.url, "_blank");
    }
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#0F3B7A] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading job details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600">The job you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format date for displaying posted date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Salary not disclosed";
    if (typeof salary === "number") {
      if (salary >= 100000) {
        return `₹${(salary / 100000).toFixed(1).replace(/\.0$/, '')} LPA`;
      }
      if (salary >= 1000) {
        return `₹${(salary / 1000).toFixed(0)}K/mo`;
      }
      return `₹${salary.toLocaleString()}`;
    }
    return salary.replace(/\$/g, "").replace(/₹/g, "").trim();
  };

  const sanitizeBenefits = (rawBenefits) => {
    if (!rawBenefits || typeof rawBenefits !== "object") return rawBenefits || {};
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

  // Benefit configuration mapping
  const benefitConfig = {
    food: { icon: Utensils, label: "Food & Canteen", color: "bg-orange-50 text-orange-700 border-orange-100" },
    transportation: { icon: Bus, label: "Transportation", color: "bg-blue-50 text-blue-700 border-blue-100" },
    uniform: { icon: Shirt, label: "Uniform & Safety Essentials", color: "bg-teal-50 text-teal-700 border-teal-100" },
    incentives: { icon: Coins, label: "Performance Incentives", color: "bg-amber-50 text-amber-700 border-amber-100" },
    overtime: { icon: Clock, label: "Overtime (OT) Pay", color: "bg-rose-50 text-rose-700 border-rose-100" },
    accommodation: { icon: Home, label: "Accommodation Facilities", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    healthcare: { icon: Heart, label: "Healthcare & Allowances", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    other: { icon: Sparkles, label: "Additional Benefits", color: "bg-purple-50 text-purple-700 border-purple-100" }
  };

  const getSalaryRangeText = () => {
    if (job.salaryBreakdown) {
      const minSal = job.salaryBreakdown.inHand || job.salaryBreakdown.gross || 0;
      const ctc = job.salaryBreakdown.ctc || job.salary || 0;
      if (minSal) {
        return `₹${Number(minSal).toLocaleString()}/mo (CTC: ${formatSalary(ctc)})`;
      }
    }
    return formatSalary(job.salary);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-[#0F3B7A] transition-colors font-semibold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Job Listings
          </button>

          {/* Job Header Section */}
          <div className="bg-gradient-to-br from-[#0F3B7A] via-[#1D5AB9] to-[#0A2540] text-white p-6 sm:p-10 rounded-2xl relative overflow-hidden shadow-xl mb-8">
            {/* Background absolute elements for premium aesthetics */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border border-white/10">
                  <img
                    src={job.companyId?.image}
                    alt={job.companyDetails?.name || "Company Logo"}
                    onError={(e) => {
                      e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    {job.immediateJoining && (
                      <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" /> Urgent Hiring
                      </span>
                    )}
                    <span className="bg-white/25 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {job.category}
                    </span>
                    <span className="bg-blue-400/30 text-blue-100 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm capitalize">
                      {job.jobType ? `${job.jobType} Collar` : (job.level?.toLowerCase() === "beginner level" || job.level?.toLowerCase() === "beginner" ? "Entry Level" : job.level)}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-blue-100">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <Building className="w-4.5 h-4.5 text-blue-300" />
                      {job.companyDetails?.name}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300 hidden sm:inline-block"></span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4.5 h-4.5 text-blue-300" />
                      {job.location}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300 hidden sm:inline-block"></span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-blue-300" />
                      Posted on {formatDate(job.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Desk/Tablet */}
              <div className="hidden md:flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 min-w-[200px] items-center">
                {isUserAuthenticated && !hasApplied && !isProfileComplete() ? (
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      disabled={true}
                      className="w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide bg-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Apply Now
                    </button>
                    <p className="text-xs text-amber-300 font-bold bg-amber-950/40 p-2 rounded-lg border border-amber-500/20 text-center">
                      ⚠ Complete your profile to at least 71% before applying.
                    </p>
                    <button
                      onClick={() => {
                        sessionStorage.setItem("returnAfterProfile", window.location.pathname);
                        sessionStorage.setItem("pendingJobId", id);
                        navigate("/profile");
                      }}
                      className="w-full py-2.5 px-6 rounded-xl font-bold text-xs tracking-wide bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      Complete Profile
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={hasApplied ? undefined : handleApplyClick}
                    disabled={hasApplied}
                    className={`w-full sm:w-auto xl:flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md transform active:scale-95 flex items-center justify-center gap-2 ${
                      hasApplied
                        ? "bg-emerald-600 text-white cursor-not-allowed"
                        : "bg-white text-[#0F3B7A] hover:bg-slate-100 hover:shadow-lg"
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Applied
                      </>
                    ) : (
                      <>
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
                
                {job.hrContact?.mobile && (
                  <a
                    href={`tel:${job.hrContact.mobile}`}
                    className="bg-transparent hover:bg-white/10 text-white border border-white/30 py-3 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" /> Call HR
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Highlights Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-4 mb-8">
            <HighlightCard icon={<IndianRupee className="w-5 h-5 text-emerald-600" />} label="Salary" value={job.salaryBreakdown?.inHand ? `₹${Number(job.salaryBreakdown.inHand).toLocaleString()}/mo` : formatSalary(job.salary)} subtitle="In-hand/Disclosed" />
            <HighlightCard icon={<Clock className="w-5 h-5 text-blue-600" />} label="Shift Details" value={job.shiftDetails?.shiftType || "General Shift"} subtitle={job.shiftDetails?.shiftTiming || "Day Shift"} />
            <HighlightCard icon={<Award className="w-5 h-5 text-indigo-600" />} label="Experience" value={job.experienceOption === "Fresher" ? "Fresher Only" : (job.experienceOption === "Both" ? "Freshers & Exp. Both" : `${job.minExperience}-${job.maxExperience} Yrs`)} subtitle={job.experienceOption || "Required"} />
            <HighlightCard icon={<ShieldCheck className="w-5 h-5 text-purple-600" />} label="Education" value={job.qualification || "Open"} subtitle={job.educationRequirements?.length ? `${job.educationRequirements.length} Option(s)` : "All Trades"} />
            <HighlightCard icon={<User className="w-5 h-5 text-rose-600" />} label="Gender Pref." value={job.genderPreference || "Any Gender"} subtitle="Male / Female / Any" />
            <HighlightCard icon={<Calendar className="w-5 h-5 text-amber-600" />} label="Age Limit" value={job.minAge ? `${job.minAge}-${job.maxAge} Yrs` : "No Limit"} subtitle="Age Criteria" />
            <HighlightCard icon={<Sparkles className="w-5 h-5 text-emerald-600" />} label="Joining" value={job.immediateJoining ? "Immediate" : "Standard"} subtitle={job.joiningWithin ? `Within ${job.joiningWithin}` : "Flexible"} />
            <HighlightCard icon={<Users className="w-5 h-5 text-cyan-600" />} label="Openings" value={job.vacancies || "Multiple"} subtitle="Active Vacancies" />
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Job Details & Structures */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* ATS Eligibility Checker Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <ShieldCheck className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">ATS Eligibility Checker</h2>
                      <p className="text-xs text-slate-400">Verifies details from your profile against job requirements</p>
                    </div>
                  </div>
                  {!isUserAuthenticated ? (
                    <button
                      onClick={() => setShowUserLogin(true)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Login to check eligibility
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-500">Match Score:</span>
                      <span className={`text-sm font-black px-2.5 py-0.5 rounded-md ${
                        eligibility?.score >= 80 ? "bg-emerald-500/10 text-emerald-600" :
                        eligibility?.score >= 50 ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                      }`}>
                        {eligibility?.score}%
                      </span>
                    </div>
                  )}
                </div>

                {!isUserAuthenticated ? (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                    <p className="text-sm text-slate-500 font-medium">Please login to see if you match the qualifications, experience, age, gender, and language requirements for this job.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <EligibilityItem isMatch={eligibility.qualMatch} label="Education & Trade Match" desc="Qualification & Trade" />
                      <EligibilityItem isMatch={eligibility.expMatch} label="Experience Criteria" desc={job.experienceOption === "Fresher" ? "Fresher preferred" : (job.experienceOption === "Both" ? "Freshers & Exp. Both" : `${job.minExperience} yrs minimum`)} />
                      <EligibilityItem isMatch={eligibility.ageMatch} label="Age Limit Compliance" desc={job.minAge ? `${job.minAge}-${job.maxAge} Years` : "No restriction"} />
                      <EligibilityItem isMatch={eligibility.langMatch} label="Language Compatibility" desc={job.languages?.length ? job.languages.join(", ") : "Any language"} />
                      <EligibilityItem isMatch={eligibility.genderMatch} label="Gender Preference" desc={`Job Prefers: ${job.genderPreference}`} />
                    </div>

                    {eligibility.score < 60 ? (
                      <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span>Some criteria do not match. You can still apply, but candidates meeting all requirements will be prioritized. Consider updating your profile.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-800 text-xs font-semibold flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span>Great! Your profile matches most criteria. This improves your chances of getting shortlisted.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job Description Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText className="w-5.5 h-5.5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-800">Detailed Job Description</h2>
                </div>

                <div 
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />

                {/* Job Metadata tags */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Employment Type</p>
                    <p className="text-sm font-extrabold text-slate-700 capitalize">{job.employmentType || "Full-Time"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Position Level</p>
                    <p className="text-sm font-extrabold text-slate-700 capitalize">{(job.level?.toLowerCase() === "beginner level" || job.level?.toLowerCase() === "beginner") ? "Entry Level" : job.level}</p>
                  </div>
                  {job.workLocationDetails?.unitName && (
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Factory Unit</p>
                      <p className="text-sm font-extrabold text-slate-700">{job.workLocationDetails.unitName}</p>
                    </div>
                  )}
                  {job.shiftDetails?.workingDays && (
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Weekly Schedule</p>
                      <p className="text-sm font-extrabold text-slate-700">{job.shiftDetails.workingDays} Days / Week</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Education & Specializations Requirements Block */}
              {job.educationRequirements && Array.isArray(job.educationRequirements) && job.educationRequirements.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Award className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Educational Qualification Criteria</h2>
                      <p className="text-xs text-slate-400">Candidate must hold one of the following qualifications</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {job.educationRequirements.map((req, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-800 text-base">{req.qualification}</span>
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Required Qualification
                          </span>
                        </div>
                        {req.specializations && req.specializations.length > 0 ? (
                          <div className="mt-3">
                            <p className="text-xs text-slate-400 font-bold mb-2">Accepted Specializations/Trades:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {req.specializations.map((spec, sIdx) => (
                                <span key={sIdx} className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 mt-2 italic font-semibold">Any trade or specialization is eligible</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary Structure & OT Breakdown */}
              {job.salaryBreakdown && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <IndianRupee className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Comprehensive Salary Breakdown</h2>
                      <p className="text-xs text-slate-400">Structured components and extra incentive metrics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">In-Hand Salary</span>
                      <div>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          ₹{Number(job.salaryBreakdown.inHand || 0).toLocaleString()}
                        </p>
                        <span className="text-[10px] text-slate-400 font-semibold">Credited per month</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Salary</span>
                      <div>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          ₹{Number(job.salaryBreakdown.gross || 0).toLocaleString()}
                        </p>
                        <span className="text-[10px] text-slate-400 font-semibold">Before statutory deductions</span>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between">
                      <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Annual CTC</span>
                      <div>
                        <p className="text-2xl font-black text-[#0F3B7A] mt-1">
                          {formatSalary(job.salaryBreakdown.ctc || job.salary)}
                        </p>
                        <span className="text-[10px] text-blue-600 font-semibold">Total cost to company</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Overtime & Added Bonuses</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-200/50">
                        <span>OT Benefits:</span>
                        <span className="font-extrabold text-slate-800">
                          {job.salaryBreakdown.otAvailable === "Yes" ? "Available" : "Not Available"}
                        </span>
                      </div>
                      {job.salaryBreakdown.otAvailable === "Yes" && (
                        <div className="flex justify-between py-1 border-b border-slate-200/50">
                          <span>OT Hourly Rate:</span>
                          <span className="font-extrabold text-slate-800">₹{job.salaryBreakdown.otRate || 0}/Hour</span>
                        </div>
                      )}
                      {job.salaryBreakdown.attendanceBonus && (
                        <div className="flex justify-between py-1 border-b border-slate-200/50">
                          <span>Attendance Bonus:</span>
                          <span className="font-extrabold text-slate-850">₹{job.salaryBreakdown.attendanceBonus}/mo</span>
                        </div>
                      )}
                      {job.salaryBreakdown.productionBonus && (
                        <div className="flex justify-between py-1 border-b border-slate-200/50">
                          <span>Production Incentive:</span>
                          <span className="font-extrabold text-slate-850">₹{job.salaryBreakdown.productionBonus}/mo</span>
                        </div>
                      )}
                      {job.salaryBreakdown.variablePay && (
                        <div className="flex justify-between py-1 border-b border-slate-200/50">
                          <span>Variable Pay / Perks:</span>
                          <span className="font-extrabold text-slate-800">₹{job.salaryBreakdown.variablePay}/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Shift Timing Details & Schedule */}
              {job.shiftDetails && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Clock className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Shift Timing & Schedule</h2>
                      <p className="text-xs text-slate-400">Duty shifts, weekly rest day and duty durations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Shift Type</p>
                      <p className="text-base font-extrabold text-slate-800">{job.shiftDetails.shiftType}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Shift Timing</p>
                      <p className="text-base font-extrabold text-slate-800">{job.shiftDetails.shiftTiming || "Not specified"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Weekly Rest Day</p>
                      <p className="text-base font-extrabold text-slate-800">{job.shiftDetails.weeklyOff || "Sunday"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Working Days</p>
                      <p className="text-base font-extrabold text-slate-800">{job.shiftDetails.workingDays || "6"} Days / Wk</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Benefits & Perks */}
              {job.benefits && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Gift className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Employee Benefits & Perks</h2>
                      <p className="text-xs text-slate-400">Facilities and benefits provided by the factory</p>
                    </div>
                  </div>

                  {typeof job.benefits === "object" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(sanitizeBenefits(job.benefits)).map(([category, items]) => {
                        if (!Array.isArray(items) || items.length === 0) return null;
                        const config = benefitConfig[category] || benefitConfig.other;
                        const IconComponent = config.icon;

                        return (
                          <div key={category} className={`p-4 rounded-xl border flex items-start gap-3.5 ${config.color}`}>
                            <div className="p-2.5 rounded-lg bg-white shadow-sm flex-shrink-0">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-xs font-black uppercase tracking-wider">{config.label}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {items.map((item, idx) => (
                                  <span key={idx} className="bg-white/80 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-black/5">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div 
                      className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.benefits }}
                    />
                  )}
                </div>
              )}

              {/* Factory details & plant location */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                    <Building className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Workplace Location Details</h2>
                    <p className="text-xs text-slate-400">Physical factory and plant addresses</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-100">
                    <img
                      src={job.companyId?.image}
                      alt={job.companyDetails?.name || "Company Logo"}
                      onError={(e) => {
                        e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{job.companyDetails?.name}</h3>
                    {job.workLocationDetails?.plantName && (
                      <p className="text-xs font-black text-blue-700 uppercase tracking-wide mt-0.5">
                        {job.workLocationDetails.plantName} {job.workLocationDetails.unitName ? `- ${job.workLocationDetails.unitName}` : ""}
                      </p>
                    )}
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                      {job.workLocationDetails?.address || job.location}
                    </p>
                  </div>
                </div>

                {job.workLocationDetails?.latitude && job.workLocationDetails?.longitude && (
                  <div className="rounded-xl overflow-hidden border border-slate-200/80 shadow-sm h-64 bg-slate-50 flex items-center justify-center flex-col gap-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F3B7A]/5 to-[#1D5AB9]/5 pointer-events-none"></div>
                    <MapPin className="h-9 w-9 text-rose-600 animate-bounce relative z-10" />
                    <p className="text-xs font-black text-slate-700 relative z-10 uppercase tracking-widest">Geolocation Active</p>
                    <p className="text-[10px] text-slate-400 relative z-10 font-bold">{job.workLocationDetails.latitude}, {job.workLocationDetails.longitude}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${job.workLocationDetails.latitude},${job.workLocationDetails.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 relative z-10 text-xs bg-[#0F3B7A] hover:bg-[#1D5AB9] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                    >
                      Get Directions on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Pre-Application checklist, Interview details, HR Liaison Contact */}
            <div className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto pb-4 pr-1 scrollbar-thin">
              
              {/* Pre-Application Checklist Card */}
              <div id="pre-apply-checklist" className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 overflow-hidden">
                {hasApplied ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-6">Application Submitted Successfully</h3>
                    
                    <div className="space-y-4 bg-slate-50 rounded-2xl p-5 border border-slate-150 text-left">
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                        <span className="text-xs font-bold text-slate-500">Status</span>
                        <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                          Applied
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                        <span className="text-xs font-bold text-slate-500">Profile Completion</span>
                        <span className="text-xs font-black text-[#0F3B7A]">{profileCompletion}%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                        <span className="text-xs font-bold text-slate-500">Eligibility Score</span>
                        <span className="text-xs font-black text-[#0F3B7A]">{eligibility?.score}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Application Date</span>
                        <span className="text-xs font-black text-slate-700">{getApplicationDateFormatted()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-800">Pre-Apply Checklist</h3>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150">
                        <span className="text-[10px] font-bold text-slate-500">Verified:</span>
                        <span className={`text-xs font-black ${
                          checkedCount === 7 ? "text-emerald-600" : "text-[#0F3B7A]"
                        }`}>
                          {checkedCount}/7
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligibility Checked</p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Please confirm all criteria below</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-450">Checklist Score</p>
                        <p className={`text-lg font-black ${
                          checklistScore >= 80 ? "text-emerald-650" :
                          checklistScore >= 50 ? "text-amber-600" : "text-rose-500"
                        }`}>
                          {checklistScore}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <ChecklistItem checked={checklist.eduOk} onChange={() => handleChecklistChange("eduOk")} label="Qualification Eligible" desc="I match the required educational degrees & trade specializations." />
                      <ChecklistItem checked={checklist.docsOk} onChange={() => handleChecklistChange("docsOk")} label="Required Documents Available" desc="I possess all physical required documents." />
                      <ChecklistItem checked={checklist.ageOk} onChange={() => handleChecklistChange("ageOk")} label="Age Criteria Matched" desc="My age falls within the required limits." />
                      <ChecklistItem checked={checklist.expOk} onChange={() => handleChecklistChange("expOk")} label="Experience Criteria Matched" desc="My experience level meets the requirements." />
                      <ChecklistItem checked={checklist.langOk} onChange={() => handleChecklistChange("langOk")} label="Language Requirement Matched" desc="I speak/understand the required languages." />
                      <ChecklistItem checked={checklist.shiftOk} onChange={() => handleChecklistChange("shiftOk")} label="Shift Preference Matched" desc="I am comfortable working in the designated shift timings." />
                      <ChecklistItem checked={checklist.locOk} onChange={() => handleChecklistChange("locOk")} label="Location Requirement Matched" desc="I can commute to or relocate near the factory plant." />
                    </div>

                    <div className="space-y-3">
                      {isUserAuthenticated && !isProfileComplete() ? (
                        <div className="space-y-2.5">
                          <button
                            disabled={true}
                            className="w-full text-slate-450 py-3.5 px-6 rounded-xl font-bold bg-slate-200 cursor-not-allowed flex items-center justify-center gap-2 text-base"
                          >
                            Apply for Job
                          </button>
                          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-800 text-xs font-semibold flex items-start gap-2">
                            <Info className="w-4.5 h-4.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span>⚠ Complete your profile to at least 71% before applying.</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              sessionStorage.setItem("returnAfterProfile", window.location.pathname);
                              sessionStorage.setItem("pendingJobId", id);
                              navigate("/profile");
                            }}
                            className="w-full text-white py-3 px-6 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                          >
                            Complete Profile
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={handleApplyClick}
                            disabled={checklistScore < 50 && isUserAuthenticated}
                            className={`w-full text-white py-3.5 px-6 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 text-base ${
                              checklistScore < 50 && isUserAuthenticated
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:shadow-none"
                                : "bg-[#0F3B7A] hover:bg-[#1C539D] hover:shadow-lg transform active:scale-95"
                            }`}
                          >
                            {isUserAuthenticated ? (
                              <>
                                Apply for Job <ArrowRight className="w-5 h-5" />
                              </>
                            ) : (
                              <>
                                <LogIn className="w-5 h-5" /> Login to Apply
                              </>
                            )}
                          </button>

                          {isUserAuthenticated && checklistScore < 50 && (
                            <p className="text-[10px] text-rose-500 text-center font-bold">
                              ⚠ Please select "Yes" on at least 50% of the checklist items to enable applying.
                            </p>
                          )}

                          {isUserAuthenticated && saveStatus && (
                            <p className="text-[10px] text-slate-400 text-center font-bold mt-3 flex items-center justify-center gap-1">
                              {saveStatus === "Responses Saved Automatically" ? "✓" : "•"} {saveStatus}
                              {lastSaved && ` (Last saved: ${lastSaved.toLocaleTimeString()})`}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Interview Process details */}
              {job.interviewProcess && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800">Interview Process</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Process Type:</span>
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 uppercase tracking-wider">
                        {job.interviewProcess.type || "Walk-In Interview"}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                      {job.interviewProcess.date && (
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span>Interview Date:</span>
                          <span className="text-slate-800 font-extrabold">{job.interviewProcess.date}</span>
                        </div>
                      )}
                      {job.interviewProcess.time && (
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span>Interview Timing:</span>
                          <span className="text-slate-800 font-extrabold">{job.interviewProcess.time}</span>
                        </div>
                      )}
                      {job.interviewProcess.address && (
                        <div className="pt-1">
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Interview Venue Address:</p>
                          <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-150 font-medium">
                            {job.interviewProcess.address}
                          </p>
                        </div>
                      )}
                      {job.interviewProcess.link && (
                        <div className="pt-2">
                          <a
                            href={job.interviewProcess.link}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all"
                          >
                            🔗 Join Online Interview Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Required Documents Checklist */}
              {job.requiredDocuments && Array.isArray(job.requiredDocuments) && job.requiredDocuments.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800">Required Documents Checklist</h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredDocuments.map((doc, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 shadow-sm">
                        <span className="text-emerald-500 font-extrabold">✓</span> {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* HR Liaison Contact Information */}
              {(job.hrContact || job.companyDetails?.hrName) && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800">Hiring Manager Info</h3>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">HR Name</p>
                    <p className="text-base font-extrabold text-slate-800">{job.hrContact?.name || job.companyDetails?.hrName}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {(job.hrContact?.mobile || job.companyDetails?.hrPhone) && (
                      <a
                        href={`tel:${job.hrContact?.mobile || job.companyDetails?.hrPhone}`}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                      >
                        📞 Call HR: {job.hrContact?.mobile || job.companyDetails?.hrPhone}
                      </a>
                    )}
                    
                    {job.hrContact?.whatsapp && (
                      <a
                        href={`https://wa.me/${job.hrContact.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                      >
                        💬 Message on WhatsApp
                      </a>
                    )}

                    {(job.hrContact?.email || job.companyDetails?.hrEmail) && (
                      <a
                        href={`mailto:${job.hrContact?.email || job.companyDetails?.hrEmail}`}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                      >
                        ✉ Email Hiring Manager
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 flex gap-2.5 items-center justify-around z-50 shadow-lg">
        {job.hrContact?.mobile && (
          <a
            href={`tel:${job.hrContact.mobile}`}
            className="flex-1 max-w-[120px] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all"
          >
            <Phone className="w-4 h-4 text-[#0F3B7A]" /> Call
          </a>
        )}
        
        {job.hrContact?.whatsapp && (
          <a
            href={`https://wa.me/${job.hrContact.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 max-w-[120px] bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-green-600" /> WhatsApp
          </a>
        )}

        {isUserAuthenticated && !hasApplied && !isProfileComplete() ? (
          <div className="flex flex-col gap-1 flex-2 w-full max-w-[220px]">
            <button
              onClick={() => {
                sessionStorage.setItem("returnAfterProfile", window.location.pathname);
                sessionStorage.setItem("pendingJobId", id);
                navigate("/profile");
              }}
              className="w-full bg-amber-600 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow"
            >
              Complete Profile
            </button>
            <p className="text-[9px] text-center text-amber-700 font-bold leading-tight">
              Min 71% required
            </p>
          </div>
        ) : (
          <button
            onClick={hasApplied ? undefined : handleApplyClick}
            disabled={hasApplied || (checklistScore < 50 && isUserAuthenticated)}
            className={`flex-2 w-full max-w-[200px] text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow transition-all ${
              hasApplied
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : checklistScore < 50 && isUserAuthenticated
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-[#0F3B7A]"
            }`}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </button>
        )}
      </div>

      {showProfileWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all duration-300 scale-100">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Profile Completion Required</h3>
            </div>
            
            <p className="text-slate-650 text-sm font-semibold mb-6 leading-relaxed">
              Your profile is only {profileCompletion}% complete. A minimum of 71% profile completion is required before applying for jobs.
            </p>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowProfileWarningModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("returnAfterProfile", window.location.pathname);
                  sessionStorage.setItem("pendingJobId", id);
                  navigate("/profile");
                }}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors text-sm shadow-md hover:shadow-lg flex items-center gap-1.5"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {job?.screeningQuestions && job.screeningQuestions.length > 0 ? "Screening Questionnaire" : "Apply for Job"}
            </h3>
            
            <div className="flex-1 overflow-y-auto my-4 pr-1">
              {job?.screeningQuestions && job.screeningQuestions.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 font-semibold mb-3">
                    Please answer the following screening questions to complete your application:
                  </p>
                  {job.screeningQuestions.map((q, idx) => (
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
                <p className="text-slate-650 font-medium">Are you sure you want to apply for this job?</p>
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
                className="px-5 py-2.5 bg-[#0F3B7A] hover:bg-[#1D5AB9] text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {applying ? "Applying..." : "Confirm Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

// Sub-components: Highlight Card
const HighlightCard = ({ icon, label, value, subtitle }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between items-center text-center">
    <div className="p-2 rounded-lg bg-slate-50 mb-2">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">{label}</p>
      <p className="text-xs font-black text-slate-800">{value}</p>
      {subtitle && <p className="text-[9px] text-slate-400 font-semibold">{subtitle}</p>}
    </div>
  </div>
);

// Sub-components: Checklist Item
const ChecklistItem = ({ checked, onChange, label, desc }) => (
  <div 
    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 rounded-xl border transition-all select-none ${
      checked 
        ? "bg-emerald-50/45 border-emerald-150 text-emerald-950" 
        : "bg-rose-50/35 border-rose-150 text-rose-950"
    }`}
  >
    <div className="space-y-0.5 flex-1">
      <div className="flex items-center gap-2">
        {checked ? (
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
        )}
        <span className={`text-xs font-extrabold transition-colors ${checked ? "text-emerald-900" : "text-rose-900"}`}>
          {label}
        </span>
      </div>
      <p className={`text-[10px] leading-relaxed font-semibold pl-4 ${checked ? "text-emerald-600" : "text-rose-500"}`}>{desc}</p>
    </div>
    
    {/* Yes / No Selector Buttons */}
    <div className="flex items-center gap-1.5 self-end sm:self-center">
      <button
        onClick={() => !checked && onChange()}
        className={`px-3.5 py-1 rounded-lg text-xs font-black transition-all shadow-sm ${
          checked 
            ? "bg-emerald-600 text-white hover:bg-emerald-700" 
            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
        }`}
      >
        Yes
      </button>
      <button
        onClick={() => checked && onChange()}
        className={`px-3.5 py-1 rounded-lg text-xs font-black transition-all shadow-sm ${
          !checked 
            ? "bg-rose-600 text-white hover:bg-rose-700" 
            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
        }`}
      >
        No
      </button>
    </div>
  </div>
);

// Sub-components: Eligibility Item
const EligibilityItem = ({ isMatch, label, desc }) => (
  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
    {isMatch ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
    ) : (
      <XCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
    )}
    <div>
      <p className="text-xs font-extrabold text-slate-700">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold">{desc}</p>
    </div>
  </div>
);

export default JobDetails;


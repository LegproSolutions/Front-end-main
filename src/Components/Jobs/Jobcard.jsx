import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  MapPin,
  Clock,
  IndianRupee,
  Briefcase,
  Building,
  GraduationCap,
  Share2,
  Users,
  Utensils,
  Bus,
  Home,
  Shirt,
  Zap,
  Flame,
  Sparkles,
  Award,
  Bookmark,
  CalendarDays
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const JobCard = ({ job, viewMode = "list" }) => {
  const navigate = useNavigate();
  const { isUserAuthenticated, setShowUserLogin, userApplications } = useContext(AppContext);

  // Local storage simulation for Save Job feature
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = localStorage.getItem(`saved_job_${job._id || job.id}`);
      return saved === "true";
    } catch {
      return false;
    }
  });

  const hasApplied = isUserAuthenticated && userApplications && userApplications.some((app) => app.jobId === job._id || (app.jobId && app.jobId._id === job._id));

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (hasApplied) return;
    if (!isUserAuthenticated) {
      toast.error("Please login to apply for this job");
      setShowUserLogin(true);
      return;
    }
    const targetId = job.jobId ? String(job.jobId).padStart(4, "0") : job._id;
    navigate(`/job-details/${targetId}`, { state: { scrollToChecklist: true } });
  };

  const handleViewDetails = () => {
    const targetId = job.jobId ? String(job.jobId).padStart(4, "0") : job._id;
    navigate(`/job-details/${targetId}`);
    window.scrollTo(0, 0);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const targetId = job.jobId ? String(job.jobId).padStart(4, "0") : job._id;
    const shareUrl = `${window.location.origin}/job-details/${targetId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Job link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      localStorage.setItem(`saved_job_${job._id || job.id}`, nextSaved ? "true" : "false");
      toast.success(nextSaved ? "Job saved successfully!" : "Job removed from saved list");
    } catch {
      toast.error("Failed to save job");
    }
  };

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Not disclosed";
    if (typeof salary === "number") {
      if (salary >= 100000) {
        return `${(salary / 100000).toFixed(1).replace(/\.0$/, '')}L`;
      }
      if (salary >= 1000) {
        return `${(salary / 1000).toFixed(0)}K`;
      }
      return `${salary.toLocaleString()}`;
    }
    return typeof salary === "string" ? salary.replace(/\$/g, "").replace(/₹/g, "").trim() : salary;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const now = new Date();
    const jobDate = new Date(date);
    if (isNaN(jobDate.getTime())) return "N/A";
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return jobDate.toLocaleDateString();
  };

  // Get company logo
  const getCompanyLogo = () => {
    return job.companyId?.image;
  };

  // Get company name
  const getCompanyName = () => {
    return job.companyDetails?.name || job.companyId?.name || "Company";
  };

  // Experience option text formatter
  const getExperienceText = () => {
    if (job.experienceOption === "Both") {
      return "Freshers & Experienced";
    }
    if (job.experienceOption === "Fresher") {
      return "Freshers Only";
    }
    if (job.experienceOption === "Experienced") {
      if (job.minExperience !== undefined && job.minExperience !== null) {
        return `${job.minExperience}-${job.maxExperience || 7} Yrs Exp`;
      }
      return `${job.experience || 1} Yrs Exp`;
    }
    return job.experience ? `${job.experience} Years` : "Freshers & Experienced";
  };

  // Dynamic qualification text
  const getQualificationText = () => {
    if (job.educationRequirements && Array.isArray(job.educationRequirements) && job.educationRequirements.length > 0) {
      return job.educationRequirements.map(req => {
        const specs = req.specializations && req.specializations.length > 0 ? ` (${req.specializations.join(", ")})` : "";
        return `${req.qualification}${specs}`;
      }).join(" / ");
    }
    return job.qualification || job.level || "Any Graduate";
  };

  // Benefits parsing
  const benefits = job.benefits || {};
  const hasFood = Array.isArray(benefits.food) && benefits.food.length > 0;
  const hasTransport = Array.isArray(benefits.transportation) && benefits.transportation.length > 0;
  const hasAccommodation = Array.isArray(benefits.accommodation) && benefits.accommodation.length > 0;
  const hasUniform = Array.isArray(benefits.uniform) && benefits.uniform.length > 0;
  const hasOvertime = job.salaryBreakdown?.otAvailable === "Yes";

  const isUrgent = job.immediateJoining === true;
  const isFeatured = job.havePremiumAccess === true;

  return (
    <Card 
      onClick={handleViewDetails}
      className="hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group border border-slate-100 overflow-hidden bg-white rounded-2xl relative"
    >
      {/* Top Highlight strip for Featured */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />
      )}

      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          
          {/* Top Row: Badges, Logo, Title, HR Contact */}
          <div className="flex flex-col md:flex-row items-start gap-4 justify-between">
            <div className="flex items-start gap-4 w-full md:w-auto">
              
              {/* Company Logo Display with fallback */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-shrink-0 w-16 h-16 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {getCompanyLogo() ? (
                  <img
                    src={getCompanyLogo()}
                    alt={getCompanyName()}
                    className="object-contain h-full w-full"
                    onError={(e) => {
                      e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 font-extrabold text-xl flex items-center justify-center rounded-lg">
                    {getCompanyName().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title & Company Name */}
              <div className="min-w-0">
                <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Building size={14} className="text-slate-400" />
                    {getCompanyName()}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="font-semibold text-slate-500 capitalize">
                    {job.jobType ? `${job.jobType} Collar` : (job.level?.toLowerCase() === "beginner level" || job.level?.toLowerCase() === "beginner" ? "Entry Level" : job.level)}
                  </span>
                  {job.category && (
                    <>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="font-semibold text-slate-500">{job.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Badges Container */}
            <div className="flex flex-wrap items-center gap-1.5 md:self-start w-full md:w-auto md:justify-end">
              <span className="bg-slate-100 text-slate-700 font-black text-[10px] tracking-wide px-2 py-0.5 rounded border border-slate-200 uppercase">
                ID: #{job.jobId ? String(job.jobId).padStart(4, "0") : job._id.slice(-5).toUpperCase()}
              </span>
              {isFeatured && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200">
                  <Award size={10} className="fill-amber-400 text-amber-500" /> Featured
                </span>
              )}
              {isUrgent && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-rose-200 animate-pulse">
                  <Flame size={10} className="fill-rose-500 text-rose-600" /> Urgent
                </span>
              )}
              {job.joiningWithin === "Immediate" && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200">
                  <Sparkles size={10} /> Immediate
                </span>
              )}
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 ml-auto md:ml-2">
                <Clock size={12} /> {formatDate(job.date)}
              </span>
            </div>
          </div>

          {/* Middle Row: Grid details for Experience, Education, Salary, Location & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-3 border-y border-slate-100 bg-slate-50/30 rounded-xl px-4">
            
            {/* Salary */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mt-0.5 flex-shrink-0">
                <IndianRupee size={15} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Salary</p>
                <p className="text-sm font-extrabold text-slate-700">₹ {formatSalary(job.salary)} - Lakhs</p>
                {job.salaryBreakdown?.inHand && (
                  <p className="text-[11px] text-slate-500 font-semibold">In-Hand: ₹{Number(job.salaryBreakdown.inHand).toLocaleString()}/mo</p>
                )}
              </div>
            </div>

            {/* Experience & Shift */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mt-0.5 flex-shrink-0">
                <Briefcase size={15} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience & Shift</p>
                <p className="text-sm font-extrabold text-slate-700">{getExperienceText()}</p>
                {job.shiftDetails?.shiftType && (
                  <p className="text-[11px] text-slate-500 font-semibold">{job.shiftDetails.shiftType}</p>
                )}
              </div>
            </div>

            {/* Education / Qualifications */}
            <div className="flex items-start gap-2.5 sm:col-span-1 lg:col-span-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mt-0.5 flex-shrink-0">
                <GraduationCap size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Qualification</p>
                <p className="text-sm font-extrabold text-slate-700 line-clamp-1" title={getQualificationText()}>{getQualificationText()}</p>
                <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-0.5 truncate">
                  <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                  {job.location}{job.companyDetails?.state ? `, ${job.companyDetails.state}` : ""}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Row: Benefits chips & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Benefit chips */}
            <div className="flex flex-wrap gap-1.5 items-center w-full sm:w-auto">
              {hasTransport && (
                <span className="inline-flex items-center gap-1 bg-blue-50/50 text-blue-700 text-[11px] font-bold px-2 py-1 rounded-md border border-blue-100/50">
                  <Bus size={11} /> Bus Facility
                </span>
              )}
              {hasFood && (
                <span className="inline-flex items-center gap-1 bg-amber-50/50 text-amber-700 text-[11px] font-bold px-2 py-1 rounded-md border border-amber-100/50">
                  <Utensils size={11} /> Free Canteen
                </span>
              )}
              {hasAccommodation && (
                <span className="inline-flex items-center gap-1 bg-indigo-50/50 text-indigo-700 text-[11px] font-bold px-2 py-1 rounded-md border border-indigo-100/50">
                  <Home size={11} /> Accommodation
                </span>
              )}
              {hasUniform && (
                <span className="inline-flex items-center gap-1 bg-teal-50/50 text-teal-700 text-[11px] font-bold px-2 py-1 rounded-md border border-teal-100/50">
                  <Shirt size={11} /> Uniform & Safety
                </span>
              )}
              {hasOvertime && (
                <span className="inline-flex items-center gap-1 bg-rose-50/50 text-rose-700 text-[11px] font-bold px-2 py-1 rounded-md border border-rose-100/50">
                  <Zap size={11} /> Overtime Pay
                </span>
              )}
              {!hasTransport && !hasFood && !hasAccommodation && !hasUniform && !hasOvertime && (
                <span className="text-xs text-slate-400 italic">No specific benefits listed</span>
              )}
            </div>

            {/* Quick Apply Experience Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Share Job */}
              <button
                onClick={handleShareClick}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-all"
                title="Share Job"
              >
                <Share2 size={15} />
              </button>

              {/* Save Job */}
              <button
                onClick={handleSaveClick}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved 
                    ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                title={isSaved ? "Unsave Job" : "Save Job"}
              >
                <Bookmark size={15} className={isSaved ? "fill-amber-600" : ""} />
              </button>

              {/* View Details */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                variant="outline"
                className="px-4 py-2 text-xs font-extrabold border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl h-9"
              >
                View Details
              </Button>

              {/* Apply Now */}
              <Button
                onClick={handleApplyClick}
                disabled={hasApplied}
                className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all h-9 ${
                  hasApplied 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {hasApplied ? "Applied ✓" : "Apply Now"}
              </Button>
            </div>

          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;

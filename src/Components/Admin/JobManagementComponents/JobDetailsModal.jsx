import React from "react";
import { Building2, MapPin, IndianRupee, Clock, Users, Calendar, Phone, Mail, MessageSquare, Briefcase, FileText, ShieldAlert } from "lucide-react";

const JobDetailsModal = ({ open, job, onClose }) => {
  if (!open || !job) return null;

  const formatSalary = (salary) => {
    if (!salary) return "N/A";
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L/annum`;
    return `₹${Math.round(salary / 1000)}K/month`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-black px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                Job ID: #{String(job.jobId || "0").padStart(4, "0")}
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                job.status === "Approved" ? "bg-green-100 text-green-700" :
                job.status === "Rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {job.status || "Pending Verification"}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900">{job.title}</h2>
            <p className="text-sm font-semibold text-gray-600 flex items-center gap-1.5 mt-1">
              <Building2 className="h-4 w-4 text-gray-400" />
              {job.companyId?.name || job.companyDetails?.name || "Unknown Company"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 text-lg font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold text-gray-700 truncate">{job.location || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <IndianRupee className="h-4 w-4 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Salary</p>
                <p className="text-xs font-bold text-gray-700 truncate">{formatSalary(job.salary)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                <p className="text-xs font-bold text-gray-700 truncate">{job.experience || 0}+ years</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Openings</p>
                <p className="text-xs font-bold text-gray-700 truncate">{job.openings || 1} vacancies</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Main Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1.5 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" /> Job Description
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.description || "No description provided."}
                </p>
              </div>

              {/* Requirements & Qualifications */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1.5 mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" /> Key Requirements & Criteria
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-500">Education Needed: </span>
                    <span className="font-bold text-gray-800">
                      {job.educationRequirements && Array.isArray(job.educationRequirements)
                        ? job.educationRequirements.map(e => e.qualification).join(", ")
                        : job.qualification || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Gender Preference: </span>
                    <span className="font-bold text-gray-800 capitalize">{job.genderPreference || "Any"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Employment Type: </span>
                    <span className="font-bold text-gray-800 capitalize">{job.employmentType || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Age Limits: </span>
                    <span className="font-bold text-gray-800">
                      {job.minAge && job.maxAge ? `${job.minAge} - ${job.maxAge} years` : "N/A"}
                    </span>
                  </div>
                </div>
                {job.requirements && (
                  <div className="mt-3">
                    <p className="font-semibold text-gray-500 text-xs mb-1.5">Specific Skills / Tools:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(job.requirements) ? job.requirements : [job.requirements]).map((req, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 font-medium text-[10px] rounded-lg">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Salary Structure */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1.5 mb-2 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-blue-600" /> Detailed Salary Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-gray-400 font-medium">In-Hand Salary</p>
                    <p className="font-black text-gray-800 mt-0.5">{job.salaryBreakdown?.inHand ? `₹${job.salaryBreakdown.inHand}` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Gross Salary</p>
                    <p className="font-black text-gray-800 mt-0.5">{job.salaryBreakdown?.gross ? `₹${job.salaryBreakdown.gross}` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">CTC</p>
                    <p className="font-black text-gray-800 mt-0.5">₹{job.salaryBreakdown?.ctc || job.salary || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Overtime Available</p>
                    <p className="font-bold text-gray-800 mt-0.5 capitalize">{job.salaryBreakdown?.otAvailable || "No"}</p>
                  </div>
                  {job.salaryBreakdown?.otAvailable === "Yes" && (
                    <div>
                      <p className="text-gray-400 font-medium">Overtime Rate</p>
                      <p className="font-bold text-gray-800 mt-0.5">{job.salaryBreakdown.otRate || "N/A"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Location Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1.5 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" /> Plant & Work Location
                </h3>
                <div className="text-xs space-y-1">
                  {job.workLocationDetails?.plantName && (
                    <p><span className="font-semibold text-gray-500">Plant/Facility:</span> <span className="font-bold text-gray-800">{job.workLocationDetails.plantName}</span></p>
                  )}
                  {job.workLocationDetails?.address && (
                    <p><span className="font-semibold text-gray-500">Address:</span> <span className="font-bold text-gray-800">{job.workLocationDetails.address}</span></p>
                  )}
                  {job.workLocationDetails?.pinCode && (
                    <p><span className="font-semibold text-gray-500">Pin Code:</span> <span className="font-bold text-gray-800">{job.workLocationDetails.pinCode}</span></p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column - Sideline info */}
            <div className="space-y-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              
              {/* Shift Details */}
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2.5">Shifts & Schedule</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 block">Shift Type</span>
                    <span className="font-bold text-gray-800">{job.shiftDetails?.shiftType || "General Shift"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Weekly Off</span>
                    <span className="font-bold text-gray-800">{job.shiftDetails?.weeklyOff || "Sunday"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Working Days</span>
                    <span className="font-bold text-gray-800">{job.shiftDetails?.workingDays || "6"} days/week</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              {job.benefits && (
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-t pt-3 mb-2.5">Benefits & Perks</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(job.benefits).flatMap(([key, list]) => 
                      Array.isArray(list) ? list.map((val, idx) => (
                        <span key={`${key}-${idx}`} className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 font-bold text-[9px] rounded-md capitalize">
                          {val}
                        </span>
                      )) : []
                    )}
                  </div>
                </div>
              )}

              {/* Interview Process */}
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-t pt-3 mb-2.5">Interview Process</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 block">Process Type</span>
                    <span className="font-bold text-gray-800">{job.interviewProcess?.type || "N/A"}</span>
                  </div>
                  {job.interviewProcess?.date && (
                    <div>
                      <span className="text-gray-400 block">Date</span>
                      <span className="font-bold text-gray-800">{formatDate(job.interviewProcess.date)}</span>
                    </div>
                  )}
                  {job.interviewProcess?.address && (
                    <div>
                      <span className="text-gray-400 block">Address</span>
                      <span className="font-bold text-gray-800">{job.interviewProcess.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* HR Contact */}
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-t pt-3 mb-2.5">HR Contact info</h4>
                <div className="space-y-2 text-xs">
                  {job.hrContact?.name && (
                    <p className="font-bold text-gray-800">{job.hrContact.name}</p>
                  )}
                  {job.hrContact?.mobile && (
                    <a href={`tel:${job.hrContact.mobile}`} className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline">
                      <Phone className="h-3.5 w-3.5" /> {job.hrContact.mobile}
                    </a>
                  )}
                  {job.hrContact?.email && (
                    <a href={`mailto:${job.hrContact.email}`} className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline break-all">
                      <Mail className="h-3.5 w-3.5" /> {job.hrContact.email}
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-[10px] text-gray-400 font-bold">
            Posted On: {formatDate(job.date || job.createdAt)}
          </div>
          <button 
            onClick={onClose}
            className="px-5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobDetailsModal;

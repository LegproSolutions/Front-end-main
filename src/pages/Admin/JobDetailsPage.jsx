import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import Navbar from "./AdminNavbar";
import DetailsNavbarPage from "./DetailsNavbarPage";
import SafeHtml from "../../utils/SafeHtml";

const backendUrl = import.meta.env?.VITE_API_URL;

const JobDetailsPage = () => {
  const { jobId } = useParams(); // from /admin/job-details/:jobId
  const [job, setJob] = useState(null);
  const [showObjectionModal, setShowObjectionModal] = useState(false); // State for modal visibility
  const [objectionMessage, setObjectionMessage] = useState(""); // State for objection message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/jobs/${jobId}`, { withCredentials: true });
        if (res.data?.success && res.data.job) {
          setJob(res.data.job);
        } else {
          toast.error("Job not found.");
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details");
      }
    };
    if (jobId) fetchJob();
  }, [jobId, navigate]);

  // Verify flow not available (no endpoint). If needed, implement later.

  const handleSubmitObjection = async () => {
    if (!objectionMessage.trim()) {
      toast.error("Objection message cannot be empty.");
      return;
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/admin/job-objection/${jobId}`, // New endpoint for raising objection
        { message: objectionMessage },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Objection raised successfully!");
        // Optionally update the job state to reflect the new objection
        setJob(prevJob => ({
          ...prevJob,
          objections: [...(prevJob.objections || []), { message: objectionMessage, timestamp: new Date().toISOString() }],
          objectionsTrack: [...(prevJob.objectionsTrack || []), { message: objectionMessage, timestamp: new Date().toISOString() }]
        }));
        setObjectionMessage(""); // Clear message input
        setShowObjectionModal(false); // Close the modal
      } else {
        toast.error(res.data.message || "Failed to raise objection.");
      }
    } catch (error) {
      console.error("Error raising objection:", error);
      toast.error(error.response?.data?.message || "Something went wrong while raising objection.");
    }
  };

  if (!job) return <div className="text-center mt-10 text-white">Loading job details...</div>;

  return (
    <>
      <DetailsNavbarPage />
      <div className="max-w-4xl mx-auto p-4 mt-16">
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">

          {/* Job Header */}
          <div className="flex items-center gap-4">
            <img
              src={job?.companyId?.image || "https://placehold.co/64x64/cccccc/333333?text=Logo"}
              alt={job?.companyId?.name}
              className="w-16 h-16 object-contain rounded-md border"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {job?.title} <span className="text-sm font-normal text-gray-500 ml-2">#{String(job?.jobId || "0").padStart(4, "0")}</span>
              </h1>
              <p className="text-sm text-gray-500">{job?.companyId?.name}</p>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Job Description</h2>
            <SafeHtml html={job.description} className="text-base text-gray-700 leading-relaxed" />
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Level:</strong> {job.level}</p>
              <p><strong>Salary (Base):</strong> {typeof job.salary === "number" ? (job.salary >= 100000 ? `${(job.salary / 100000).toFixed(1).replace(/\.0$/, '')}L` : (job.salary >= 1000 ? `${(job.salary / 1000).toFixed(0)}K` : job.salary)) : (typeof job.salary === "string" ? job.salary.replace(/\$/g, "").replace(/₹/g, "").trim() : "N/A")}</p>
              <p><strong>Openings:</strong> {job.openings || job.vacancies}</p>
              <p><strong>Experience Required:</strong> {job.experienceOption === "Fresher" ? "Fresher Only" : `${job.experience} Year(s)`}</p>
              <p><strong>Experience Range:</strong> {job.minExperience !== null ? `${job.minExperience} - ${job.maxExperience} Years` : "N/A"}</p>
              <p><strong>Age Eligibility:</strong> {job.minAge !== null ? `${job.minAge} - ${job.maxAge} Years` : "Any"}</p>
              <p><strong>Gender Preference:</strong> {job.genderPreference || "Any"}</p>
              <p><strong>Immediate Joining:</strong> {job.immediateJoining ? `Yes (Within ${job.joiningWithin || "15 Days"})` : "No"}</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {job.category}</p>
            </div>
          </div>

          {/* Education & Qualifications Requirements */}
          {job.educationRequirements && Array.isArray(job.educationRequirements) && job.educationRequirements.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Educational Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {job.educationRequirements.map((block, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border rounded-lg text-sm text-slate-700">
                    <p className="font-semibold">{block.qualification}</p>
                    {block.specializations && block.specializations.length > 0 ? (
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>Specializations:</strong> {block.specializations.join(", ")}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-0.5">All trades / streams accepted</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Breakdown & Shifts */}
          {(job.salaryBreakdown || job.shiftDetails) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.salaryBreakdown && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Salary Structure Breakdown</h2>
                  <div className="space-y-1 text-sm text-gray-600 bg-slate-50 p-3 rounded-lg border">
                    <p><strong>In-Hand:</strong> ₹{Number(job.salaryBreakdown.inHand || 0).toLocaleString()}/month</p>
                    <p><strong>Gross Salary:</strong> ₹{Number(job.salaryBreakdown.gross || 0).toLocaleString()}/month</p>
                    <p><strong>Annual CTC:</strong> ₹{Number(job.salaryBreakdown.ctc || job.salary || 0).toLocaleString()}</p>
                    <p><strong>Overtime (OT):</strong> {job.salaryBreakdown.otAvailable === "Yes" ? `Available (₹${job.salaryBreakdown.otRate || 0}/hr)` : "Not Available"}</p>
                    {(job.salaryBreakdown.variablePay || job.salaryBreakdown.attendanceBonus || job.salaryBreakdown.productionBonus) && (
                      <div className="text-xs text-slate-500 border-t pt-1 mt-1 space-y-0.5">
                        {job.salaryBreakdown.variablePay && <p>• Variable Pay: ₹{job.salaryBreakdown.variablePay}</p>}
                        {job.salaryBreakdown.attendanceBonus && <p>• Attendance Bonus: ₹{job.salaryBreakdown.attendanceBonus}</p>}
                        {job.salaryBreakdown.productionBonus && <p>• Production Incentive: ₹{job.salaryBreakdown.productionBonus}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {job.shiftDetails && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Shift timing & Schedule</h2>
                  <div className="space-y-1 text-sm text-gray-600 bg-slate-50 p-3 rounded-lg border">
                    <p><strong>Shift Type:</strong> {job.shiftDetails.shiftType}</p>
                    <p><strong>Shift Timings:</strong> {job.shiftDetails.shiftTiming || "N/A"}</p>
                    <p><strong>Weekly Off:</strong> {job.shiftDetails.weeklyOff || "N/A"}</p>
                    <p><strong>Working Days:</strong> {job.shiftDetails.workingDays || "6"} days/week</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Benefits & Required Documents */}
          {(job.benefits || job.requiredDocuments) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.benefits && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Employee Benefits</h2>
                  <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-lg border">
                    {typeof job.benefits === 'object' ? (
                      <div className="space-y-2">
                        {Object.entries(job.benefits).map(([category, items]) => {
                          if (!Array.isArray(items) || items.length === 0) return null;
                          return (
                            <div key={category}>
                              <p className="text-xs font-bold text-blue-700 capitalize mb-1">{category}</p>
                              <p className="text-xs font-medium text-slate-700">{items.join(", ")}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>{job.benefits}</p>
                    )}
                  </div>
                </div>
              )}

              {job.requiredDocuments && Array.isArray(job.requiredDocuments) && job.requiredDocuments.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Required Documents</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {job.requiredDocuments.map((doc, idx) => (
                      <span key={idx} className="bg-slate-100 border text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Screening Questions */}
          {job.screeningQuestions && Array.isArray(job.screeningQuestions) && job.screeningQuestions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Custom ATS Screening Questions</h2>
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border text-sm text-slate-700">
                {job.screeningQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="border-b last:border-none pb-2 last:pb-0">
                    <p className="font-semibold">{idx + 1}. {q.questionText}</p>
                    {q.options && q.options.length > 0 && (
                      <p className="text-xs text-slate-500 mt-0.5"><strong>Options:</strong> {q.options.join(" | ")}</p>
                    )}
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5"><strong>Preferred Answer:</strong> {q.preferredAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Company Details</h2>
            <div className="text-sm text-gray-600 space-y-1 bg-slate-50 p-3 rounded-lg border">
              <p><strong>Name:</strong> {job.companyDetails?.name || job.companyId?.name}</p>
              <p><strong>Short Description:</strong> {job.companyDetails?.shortDescription}</p>
              <p><strong>Location:</strong> {job.companyDetails?.city}, {job.companyDetails?.state}, {job.companyDetails?.country}</p>
              {job.workLocationDetails && (
                <div className="border-t mt-2 pt-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-800 text-sm mb-1">Specific Work Location Address</p>
                  <p><strong>Plant/Unit Name:</strong> {job.workLocationDetails.plantName} {job.workLocationDetails.unitName ? `(${job.workLocationDetails.unitName})` : ""}</p>
                  <p><strong>Address:</strong> {job.workLocationDetails.address} {job.workLocationDetails.pinCode ? `- ${job.workLocationDetails.pinCode}` : ""}</p>
                  {job.workLocationDetails.latitude && (
                    <p className="mt-1">
                      <strong>Geolocation:</strong> {job.workLocationDetails.latitude}, {job.workLocationDetails.longitude} &nbsp;
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${job.workLocationDetails.latitude},${job.workLocationDetails.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline font-semibold"
                      >
                        [Open In Google Maps]
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* HR Liaison Representative Info */}
          {(job.hrContact || job.companyDetails?.hrName) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">HR Representative Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-slate-50 p-3 rounded-lg border">
                <p><strong>Name:</strong> {job.hrContact?.name || job.companyDetails?.hrName}</p>
                <p><strong>Email:</strong> {job.hrContact?.email || job.companyDetails?.hrEmail}</p>
                <p><strong>Phone/Mobile:</strong> {job.hrContact?.mobile || job.companyDetails?.hrPhone}</p>
                {job.hrContact?.whatsapp && <p><strong>WhatsApp:</strong> {job.hrContact.whatsapp}</p>}
              </div>
            </div>
          )}

          {/* Objections Section (New) */}
          {/* {job.objectionsTrack && job.objectionsTrack.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Objections Raised</h2>
              <div className="space-y-2">
                {job.objectionsTrack.map((obj, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
                    <p className="text-sm">{obj.message}</p>
                    <p className="text-xs text-red-600 mt-1">
                      <span className="font-semibold">Raised On:</span> {new Date(obj.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {job.objectionsTrack && job.objectionsTrack.length > 0 ? ( // Ensure job.objections exists and has items
  job.objectionsTrack.map((obj, index) => (
    <div key={index} className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md relative mb-3">
      <p className="text-sm">
        <span className="font-semibold">Objection:</span> {obj.message}
      </p>
      <p className="text-xs text-red-600 mt-1">
        <span className="font-semibold">Raised On:</span> {new Date(obj.timestamp).toLocaleString()}
      </p>
      {/* Badge to show if the job has been edited */}
      {obj.isEditedTrack && ( // Check the top-level 'job.isEdited' property
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          Job Edited
        </span>
      )}
    </div>
  ))
) : (
  <p className="text-gray-500 italic">No objections recorded for this job.</p>
)}


          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setShowObjectionModal(true)}
              className="bg-red-600 hover:bg-red-700 transition text-white font-medium py-2 px-6 rounded-lg shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Raise Objection
            </button>
          </div>

        </div>
      </div>

      {/* Objection Modal */}
      {showObjectionModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Raise an Objection</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
              rows="5"
              placeholder="Enter your objection message here..."
              value={objectionMessage}
              onChange={(e) => setObjectionMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowObjectionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitObjection}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Submit Objection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetailsPage;

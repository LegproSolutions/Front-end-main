import moment from "moment";
import { useContext } from "react";
import { FaFileAlt } from "react-icons/fa";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { AppContext } from "../../context/AppContext";

const Application = () => {
  const { userApplications, profileCompletion } = useContext(AppContext);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 my-10">
          
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {profileCompletion === 100 ? "Profile Completion: Fully Completed" : "Profile Completion Status"}
                </span>
                <span className={`text-lg font-black ${profileCompletion >= 71 ? "text-emerald-600" : "text-amber-600"}`}>
                  {profileCompletion}%
                </span>
              </div>
              
              {/* Progress bar container */}
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200/50">
                <div 
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    profileCompletion === 100
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : profileCompletion >= 71 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                      : "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>

              <p className="text-slate-600 text-sm font-medium">
                {profileCompletion === 100 ? (
                  "Your profile is complete and ready for job applications."
                ) : profileCompletion >= 71 ? (
                  "🎉 Your profile meets the minimum requirement of 71% and is ready for job applications!"
                ) : (
                  `Complete ${71 - profileCompletion}% more of your profile to start applying for jobs.`
                )}
              </p>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Link
                to="/profile"
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-[#0F3B7A] hover:from-indigo-700 hover:to-[#1C539D] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Complete Profile
              </Link>
            </div>
          </div>

          {/* Jobs Applied Section */}
          <div className="bg-white shadow-sm rounded-2xl p-8 border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">
                Application History
              </h2>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Track and monitor your job application status
            </p>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              {userApplications && userApplications.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        HR Contact
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userApplications.map((app, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.company?.image || app.companyId?.image}
                              alt="Company Logo"
                              className="h-11 w-11 rounded-lg shadow-sm border border-slate-200 object-cover"
                              onError={(e) => {
                                e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
                              }}
                            />
                            <span className="font-semibold text-slate-800">
                              {app.company?.name || app.companyId?.name || "Unknown Company"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-700 font-medium hover:text-[#0F3B7A] transition-colors">
                          {app.job ? (
                            <Link
                              to={`/job-details/${app.job.jobId ? String(app.job.jobId).padStart(4, "0") : app.job.id}`}
                              className="hover:underline inline-flex items-center gap-1.5 font-bold"
                            >
                              {app.job.title}
                              <ExternalLink className="w-3.5 h-3.5 text-slate-405" />
                            </Link>
                          ) : app.jobId?.title || "N/A"}
                        </td>
                        <td className="p-4 text-slate-650 font-medium">
                          {app.job?.location || app.jobId?.location || "N/A"}
                        </td>
                        <td className="p-4 text-slate-500 text-sm">
                          {app.date
                            ? moment(app.date).format("MMM DD, YYYY")
                            : app.createdAt
                            ? moment(app.createdAt).format("MMM DD, YYYY")
                            : "N/A"}
                        </td>
                        <td className="p-4">
                          {app.job?.hrContact || app.job?.companyDetails ? (
                            <div className="text-xs space-y-1">
                              <p className="font-bold text-slate-800">
                                {app.job.hrContact?.name || app.job.companyDetails?.hrName || "Hiring Manager"}
                              </p>
                              {(app.job.hrContact?.mobile || app.job.companyDetails?.hrPhone) && (
                                <a
                                  href={`tel:${app.job.hrContact?.mobile || app.job.companyDetails?.hrPhone}`}
                                  className="text-blue-700 hover:underline block font-semibold"
                                >
                                  📞 {app.job.hrContact?.mobile || app.job.companyDetails?.hrPhone}
                                </a>
                              )}
                              {(app.job.hrContact?.email || app.job.companyDetails?.hrEmail) && (
                                <a
                                  href={`mailto:${app.job.hrContact?.email || app.job.companyDetails?.hrEmail}`}
                                  className="text-slate-500 hover:underline block"
                                >
                                  ✉ {app.job.hrContact?.email || app.job.companyDetails?.hrEmail}
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Not available</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              app.status === "Joined"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : app.status === "Selecte"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : app.status === "Shortlist"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <FaFileAlt className="text-slate-400 text-2xl" />
                  </div>
                  <p className="text-slate-600 font-medium">
                    No applications found
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Start applying to jobs to see them here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Application;


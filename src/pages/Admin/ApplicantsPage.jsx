import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import moment from "moment"; // For date formatting
import DetailsNavbarPage from "./DetailsNavbarPage"; // Assuming you have this navbar

const backendUrl = import.meta.env?.VITE_API_URL;

const ApplicantsPage = () => {
  const { jobId } = useParams(); // Get jobId from the URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobApplicants = async () => {
      try {
        setLoading(true);
        setError(null);
        // Note: The backend controller getCompanyJobApplicants expects companyId in req.company._id
        // and jobId in req.params.jobId. For this admin view, we'll assume the admin
        // has the necessary permissions to fetch applicants by jobId directly.
        // If your backend requires companyId in the route for this endpoint,
        // you'll need to adjust the route or pass it from RecruiterJobPostsPage.
        // For now, I'm assuming the provided backend function `getCompanyJobApplicants`
        // can be adapted to work with just `jobId` from the admin context.
        // If not, you might need a separate admin-specific controller for this.
        const response = await axios.get(
          `${backendUrl}/api/admin/job-applicants/${jobId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setApplicants(response.data.applications);
        } else {
          toast.error(response.data.message || "Failed to fetch applicants.");
          setApplicants([]);
        }
      } catch (err) {
        console.error("Error fetching job applicants:", err);
        setError("Failed to load applicants. Please try again later.");
        toast.error("Error fetching applicants.");
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobApplicants();
    } else {
      setLoading(false);
      setError("Job ID not found in URL.");
    }
  }, [jobId]); // Re-run effect if jobId changes

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
      <DetailsNavbarPage />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Applicants</h1>
        <p className="text-gray-600 mb-6">List of users who applied for this job.</p>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {applicants && applicants.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ATS Match Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applicants.map((applicant) => (
                  <tr key={applicant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={applicant.userId?.image || "https://placehold.co/40x40/cccccc/333333?text=User"}
                            alt={applicant.userId?.name || "Applicant"}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.userId?.name || "Unknown User"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {applicant.userId?.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(applicant.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {applicant.matchScore !== undefined ? (
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          applicant.matchScore >= 80 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : applicant.matchScore >= 50 
                            ? "bg-blue-100 text-blue-800 border border-blue-200" 
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}>
                          {applicant.matchScore}% Match
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          applicant.status === "Accepted" || applicant.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : applicant.status === "Rejected" || applicant.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {applicant.userId?.resume ? (
                        <a
                          href={applicant.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-legpro-primary hover:text-blue-900"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No applicants found for this job post.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;

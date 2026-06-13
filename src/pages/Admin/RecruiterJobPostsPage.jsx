import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import DetailsNavbarPage from "./DetailsNavbarPage"; // Assuming you have this navbar
import { IndianRupee } from "lucide-react"; // For currency icon

const backendUrl = import.meta.env?.VITE_API_URL;

const RecruiterJobPostsPage = () => {
  const { companyId } = useParams(); // Get companyId from the URL
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyJobPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${backendUrl}/api/admin/company-jobs/${companyId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setJobPosts(response.data.jobs);
        } else {
          toast.error(response.data.message || "Failed to fetch job posts.");
          setJobPosts([]);
        }
      } catch (err) {
        console.error("Error fetching company job posts:", err);
        setError("Failed to load job posts. Please try again later.");
        toast.error("Error fetching job posts.");
        setJobPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyJobPosts();
    } else {
      setLoading(false);
      setError("Company ID not found in URL.");
    }
  }, [companyId]); // Re-run effect if companyId changes

  const handleViewApplicants = (jobId) => {
    navigate(`/admin/job-applicants/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Loading job posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
      <DetailsNavbarPage />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Recruiter Job Posts</h1>
        <p className="text-gray-600 mb-6">Jobs posted by this recruiter.</p>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {jobPosts && jobPosts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPosts.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title || "N/A"}
                      </div>
                     <div className="text-sm text-gray-500">
  {job.description ? `${stripHtml(job.description).substring(0, 70)}...` : "No description"}
</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {job.salary || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.applicants || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewApplicants(job._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-xs font-semibold transition"
                      >
                        View Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No job posts found for this recruiter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobPostsPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get userId from URL
import axios from "axios";
import { toast } from "react-hot-toast";
import moment from "moment"; // For date formatting
import DetailsNavbarPage from "./DetailsNavbarPage"; // Assuming you have this navbar

const backendUrl = import.meta.env?.VITE_API_URL; // Ensure this is correctly configured

const AppliedJobsPage = () => {
  const { userId } = useParams(); // Get userId from the URL
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${backendUrl}/api/admin/job-applications/${userId}`,
          { withCredentials: true } // Important for sending cookies/auth tokens
        );

        if (response.data.success) {
          setUserApplications(response.data.applications);
        } else {
          toast.error(response.data.message || "Failed to fetch applications.");
          setUserApplications([]);
        }
      } catch (err) {
        console.error("Error fetching user job applications:", err);
        setError("Failed to load job applications. Please try again later.");
        toast.error("Error fetching job applications.");
        setUserApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserApplications();
    } else {
      setLoading(false);
      setError("User ID not found in URL.");
    }
  }, [userId]); // Re-run effect if userId changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Loading job applications...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
      <DetailsNavbarPage />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Jobs Applied</h1>
        <p className="text-gray-600 mb-6">Track the jobs this user has applied for.</p>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {userApplications && userApplications.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Applied
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={app.companyId?.image || "https://placehold.co/40x40/cccccc/333333?text=Logo"}
                            alt="Company Logo"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {app.companyId?.name || "Unknown Company"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.companyId?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {app.jobId?.title || "N/A"}
                      </div>
                    
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.jobId?.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(app.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : app.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
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
            <div className="p-6 text-center text-gray-600">
              No job applications found for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobsPage;

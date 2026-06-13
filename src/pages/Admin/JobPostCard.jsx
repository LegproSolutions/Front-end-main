import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

const JobVerificationPage = ({
  jobs: initialJobs, // Receives the full list of jobs from parent
  onVerifyJob, // Function to verify a job post
  itemsPerPage, // Items per page is still passed as a prop
}) => {
  const [searchQuery, setSearchQuery] = useState(""); // Internal state for search query
  const [currentPage, setCurrentPage] = useState(1); // Internal state for current page

  // Filter jobs based on the internal searchQuery state
  const filteredJobs = initialJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.companyId?.name && job.companyId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate total pages based on filtered jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Slice the filtered jobs array to get data for the current page
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset current page to 1 whenever the searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]); // Dependency array: re-run effect when searchQuery changes

  // Function to change the current page
  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar for Job Posts */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      {/* Job Post Table */}
      {paginatedJobs.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white text-gray-800">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Job Title</th>
                <th className="py-3 px-6 text-left">Company Name</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Salary</th>
                <th className="py-3 px-6 text-left">Openings</th>
                <th className="py-3 px-6 text-center">Verify Job Post</th>
                <th className="py-3 px-6 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left font-medium">
                    {job.title}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {job.companyId?.name || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-left">{job.location}</td>
                  <td className="py-3 px-6 text-left flex items-center">
                    <span>{typeof job.salary === "number" ? (job.salary >= 100000 ? `${(job.salary / 100000).toFixed(1).replace(/\.0$/, '')}L` : (job.salary >= 1000 ? `${(job.salary / 1000).toFixed(0)}K` : job.salary)) : (typeof job.salary === "string" ? job.salary.replace(/\$/g, "").replace(/₹/g, "").trim() : "N/A")}</span>
                  </td>
                  <td className="py-3 px-6 text-left">{job.openings}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => onVerifyJob(job._id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition"
                    >
                      Verify
                    </button>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link to={`/admin/job-details/${job._id}`}>
                      <div className="relative inline-block">
                        <button className="bg-legpro-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition">
                          View Details
                        </button>

                        {job.objectionsTrack && job.objectionsTrack.length > 0 && (
                          <span
                            className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                              job.objectionsTrack[
                                job.objectionsTrack.length - 1
                              ].isEditedTrack
                                ? "bg-blue-900"
                                : "bg-red-600"
                            }`}
                          ></span>
                        )}
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full mt-12">
          <p className="text-gray-400 text-lg italic">
            {searchQuery
              ? "No matching job posts found."
              : "No unverified job posts at the moment."}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-white hover:bg-gray-700"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => changePage(pageNum)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNum
                    ? "bg-legpro-primary text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => changePage(totalPages)}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-800"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-white hover:bg-gray-700"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobVerificationPage;

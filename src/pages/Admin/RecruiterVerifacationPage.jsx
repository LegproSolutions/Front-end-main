import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react"; // Import Search icon and Chevron icons for pagination

const RecruiterVerifacationPage = ({
  recruiters: initialRecruiters, // Receives the full list of recruiters from parent
  onVerify,
  itemsPerPage, // This is used here for slicing the data
}) => {
  const [searchQuery, setSearchQuery] = useState(""); // Internal state for search query
  const [currentPage, setCurrentPage] = useState(1); // Internal state for current page

  // Filter recruiters based on the internal searchQuery state
  const filteredRecruiters = initialRecruiters.filter(recruiter =>
    recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recruiter.phone && recruiter.phone.includes(searchQuery))
  );

  // Calculate total pages based on filtered recruiters
  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);

  // Slice the filtered recruiters array to get data for the current page
  const paginatedRecruiters = filteredRecruiters.slice(
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
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Recruiter Table */}
      {paginatedRecruiters.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white text-gray-800">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Company Image</th>
                <th className="py-3 px-6 text-left">Company Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-center">Verify Recruiter</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedRecruiters.map((recruiter) => (
                <tr key={recruiter._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <img
                      src={recruiter.image || "https://placehold.co/40x40/cccccc/333333?text=Logo"}
                      alt={recruiter.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">{recruiter.name}</td>
                  <td className="py-3 px-6 text-left break-words">{recruiter.email}</td>
                  <td className="py-3 px-6 text-left">{recruiter.phone}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => onVerify(recruiter._id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition"
                    >
                      Verify
                    </button>
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
              ? "No matching recruiters found."
              : "No unverified recruiters at the moment."}
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
            // Logic to display a maximum of 5 page numbers around the current page
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
                    ? 'bg-legpro-primary text-white'
                    : 'bg-gray-200 text-gray-800'
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

export default RecruiterVerifacationPage;

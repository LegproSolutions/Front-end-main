import React, { useContext, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { JobLocations } from "../../assets/assets";
import Jobcard from "./Jobcard";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  SlidersHorizontal,
  GraduationCap,
  Shirt,
  Home,
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles
} from "lucide-react";
import SkeletonJobCard from "./SkeletonJobCard";

const JobListing = () => {
  const {
    searchFilter,
    setSearchFilter,
    homeJobs,
    isJobsLoading,
    jobsPagination,
    fetchHomeJobs,
  } = useContext(AppContext);

  const [searchParams] = useSearchParams();

  // Filter states
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedUniforms, setSelectedUniforms] = useState([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  // Local input states for search title and location to prevent immediate API triggering on keystroke
  const [localTitle, setLocalTitle] = useState(searchFilter.title || "");
  const [localLocation, setLocalLocation] = useState(searchFilter.location || "");

  // Sync from context search filters (e.g. if set from Hero page)
  useEffect(() => {
    if (searchFilter.title !== undefined) setLocalTitle(searchFilter.title);
    if (searchFilter.location !== undefined) setLocalLocation(searchFilter.location);
  }, [searchFilter]);

  // Initialize category from URL parameters if present
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);
  
  // Default view mode to list as requested
  const [viewMode] = useState("list");

  // Get unique categories from current jobs
  const JobCategories = [...new Set(homeJobs.map((job) => job.category).filter(Boolean))];

  // Build filters object for API
  const buildFilters = useCallback(() => {
    const filters = {};

    if (searchFilter.title) filters.title = searchFilter.title;
    if (searchFilter.location) filters.location = searchFilter.location;
    if (searchFilter.education) filters.qualification = searchFilter.education;
    if (selectedCategories.length > 0) filters.category = selectedCategories[0];
    if (selectedLocations.length > 0) filters.states = selectedLocations;
    if (selectedExperience) filters.experienceOption = selectedExperience;
    if (selectedJobType) filters.jobType = selectedJobType;

    if (selectedSalary) {
      switch (selectedSalary) {
        case "0-3 LPA":
          filters.salaryMin = 0;
          filters.salaryMax = 299999;
          break;
        case "3-6 LPA":
          filters.salaryMin = 300000;
          filters.salaryMax = 599999;
          break;
        case "6-10 LPA":
          filters.salaryMin = 600000;
          filters.salaryMax = 1000000;
          break;
        case "10+ LPA":
          filters.salaryMin = 1000001;
          break;
      }
    }

    if (selectedUniforms.includes("Company Uniform")) filters.uniformProvided = "true";
    if (selectedUniforms.includes("Safety Shoes")) filters.safetyShoesProvided = "true";
    if (selectedUniforms.includes("Safety Kit")) filters.safetyKitProvided = "true";

    if (selectedAccommodations.includes("Company Accommodation")) filters.accommodationAvailable = "true";
    if (selectedAccommodations.includes("PG Facility")) filters.pgAvailable = "true";
    if (selectedAccommodations.includes("Company Support to Find Room (Paid by Candidate)")) filters.roomSupport = "true";

    return filters;
  }, [
    searchFilter,
    selectedCategories,
    selectedLocations,
    selectedSalary,
    selectedUniforms,
    selectedAccommodations,
    selectedExperience,
    selectedJobType
  ]);

  // Fetch jobs when filters change
  useEffect(() => {
    const filters = buildFilters();
    fetchHomeJobs(filters, 1, 9);
  }, [buildFilters, fetchHomeJobs]);

  // Handle pagination
  const changePage = (page) => {
    if (page >= 1 && page <= jobsPagination.totalPages) {
      const filters = buildFilters();
      fetchHomeJobs(filters, page, 9);
    }
  };

  // Apply inputs on search trigger
  const triggerSearch = () => {
    setSearchFilter(prev => ({
      ...prev,
      title: localTitle,
      location: localLocation
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSearchFilter({ title: "", location: "", education: "" });
    setLocalTitle("");
    setLocalLocation("");
    setSelectedSalary("");
    setSelectedUniforms([]);
    setSelectedAccommodations([]);
    setSelectedExperience("");
    setSelectedJobType("");
    fetchHomeJobs({}, 1, 9);
  };

  // Toggle filter functions
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const toggleUniformFilter = (filterVal) => {
    setSelectedUniforms((prev) =>
      prev.includes(filterVal)
        ? prev.filter((u) => u !== filterVal)
        : [...prev, filterVal]
    );
  };

  const toggleAccommodationFilter = (filterVal) => {
    setSelectedAccommodations((prev) =>
      prev.includes(filterVal)
        ? prev.filter((a) => a !== filterVal)
        : [...prev, filterVal]
    );
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchFilter.title ||
    searchFilter.location ||
    searchFilter.education ||
    selectedCategories.length > 0 ||
    selectedLocations.length > 0 ||
    selectedSalary ||
    selectedUniforms.length > 0 ||
    selectedAccommodations.length > 0 ||
    selectedExperience ||
    selectedJobType;

  return (
    <div id="job-listing" className="bg-transparent py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Horizontal Modern Top Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 mb-8 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-legpro-primary rounded-full inline-block"></span>
              Search and Filter Jobs
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-extrabold transition-colors flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-lg"
              >
                <X size={14} /> Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Job title, skills..."
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-9 pr-3 py-2.5 w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-legpro-primary focus:bg-white transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="State, City..."
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-9 pr-3 py-2.5 w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-legpro-primary focus:bg-white transition-all text-slate-700"
                  list="filter-locations"
                />
                <datalist id="filter-locations">
                  {JobLocations.map((loc, idx) => (
                    <option key={idx} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Education Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Education</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <select
                  value={searchFilter.education}
                  onChange={(e) => setSearchFilter(prev => ({ ...prev, education: e.target.value }))}
                  className="pl-9 pr-8 py-2.5 w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-legpro-primary focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">All Education</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="ITI">ITI</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduation">Graduate</option>
                  <option value="Post Graduation">Post Graduate</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Salary Range Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salary Range</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className="pl-9 pr-8 py-2.5 w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-legpro-primary focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">All Salaries</option>
                  <option value="0-3 LPA">0-3 LPA</option>
                  <option value="3-6 LPA">3-6 LPA</option>
                  <option value="6-10 LPA">6-10 LPA</option>
                  <option value="10+ LPA">10+ LPA</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Experience Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience Option</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="pl-9 pr-8 py-2.5 w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-legpro-primary focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">All Experiences</option>
                  <option value="Fresher">Freshers Only</option>
                  <option value="Experienced">Experienced Only</option>
                  <option value="Both">Freshers & Exp. Both</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Job Type Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Type</label>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="pl-9 pr-8 py-2.5 w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-legpro-primary focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">All Job Types</option>
                  <option value="white">White Collar</option>
                  <option value="blue">Blue Collar / Technical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Action Buttons & Toggle Advanced Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-bold text-legpro-primary hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2.5 rounded-xl"
            >
              <Settings size={16} />
              {showAdvanced ? "Hide Benefits & Categories" : "Show Benefits & Categories"}
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <button
              onClick={triggerSearch}
              className="px-8 py-3 bg-gradient-to-r from-[#0F3B7A] to-[#1D5AB9] text-white font-extrabold rounded-xl hover:shadow-lg hover:from-[#1D5AB9] hover:to-[#0F3B7A] transition-all flex items-center gap-2"
            >
              <Search size={16} /> Apply Filters
            </button>
          </div>

          {/* Advanced Collapsible Section for Uniforms, Accommodation, and Categories */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-6 rounded-2xl bg-slate-50/70 border border-slate-100 animate-fadeIn">
              
              {/* Category Checkboxes */}
              {JobCategories.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-legpro-primary" /> Job Category
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {JobCategories.map((category, index) => (
                      <label
                        key={index}
                        className="flex items-center px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="mr-2.5 h-4 w-4 accent-legpro-primary rounded cursor-pointer"
                        />
                        <span className="text-xs text-slate-700 font-bold">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Uniform & Safety Checkboxes */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Shirt size={14} className="text-legpro-primary" /> Uniform & Safety Essentials
                </h4>
                <div className="space-y-1.5">
                  {[
                    { value: "Company Uniform", label: "Uniform Provided" },
                    { value: "Safety Shoes", label: "Safety Shoes Provided" },
                    { value: "Safety Kit", label: "Safety Kit Provided" }
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUniforms.includes(item.value)}
                        onChange={() => toggleUniformFilter(item.value)}
                        className="mr-2.5 h-4 w-4 accent-legpro-primary rounded cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 font-bold">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accommodation Checkboxes */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Home size={14} className="text-legpro-primary" /> Accommodation Facilities
                </h4>
                <div className="space-y-1.5">
                  {[
                    { value: "Company Accommodation", label: "Accommodation Available" },
                    { value: "PG Facility", label: "PG Available" },
                    { value: "Company Support to Find Room (Paid by Candidate)", label: "Room Support Available" }
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAccommodations.includes(item.value)}
                        onChange={() => toggleAccommodationFilter(item.value)}
                        className="mr-2.5 h-4 w-4 accent-legpro-primary rounded cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 font-bold">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Active Filters Tag Summary Bar */}
        {hasActiveFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-extrabold text-slate-500 mr-2">Selected Filters:</span>
            
            {searchFilter.title && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                "{searchFilter.title}"
                <button onClick={() => { setSearchFilter(p => ({ ...p, title: "" })); setLocalTitle(""); }} className="hover:bg-blue-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}

            {searchFilter.location && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                Loc: {searchFilter.location}
                <button onClick={() => { setSearchFilter(p => ({ ...p, location: "" })); setLocalLocation(""); }} className="hover:bg-emerald-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}

            {searchFilter.education && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                Edu: {searchFilter.education}
                <button onClick={() => setSearchFilter(p => ({ ...p, education: "" }))} className="hover:bg-purple-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}

            {selectedSalary && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                Salary: {selectedSalary}
                <button onClick={() => setSelectedSalary("")} className="hover:bg-amber-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}

            {selectedExperience && (
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                Exp: {selectedExperience}
                <button onClick={() => setSelectedExperience("")} className="hover:bg-indigo-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}

            {selectedJobType && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-100">
                Type: {selectedJobType === "white" ? "White Collar" : "Blue Collar"}
                <button onClick={() => setSelectedJobType("")} className="hover:bg-rose-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            )}

            {selectedCategories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                {cat}
                <button onClick={() => toggleCategory(cat)} className="hover:bg-teal-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            ))}

            {selectedUniforms.map(uni => (
              <span key={uni} className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold border border-cyan-100">
                {uni}
                <button onClick={() => toggleUniformFilter(uni)} className="hover:bg-cyan-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            ))}

            {selectedAccommodations.map(acc => (
              <span key={acc} className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-bold border border-violet-100">
                {acc}
                <button onClick={() => toggleAccommodationFilter(acc)} className="hover:bg-violet-150 rounded-full p-0.5"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}

        {/* Job Listing Results Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-black text-2xl text-slate-800 tracking-tight">
                Available Positions
              </h2>
              <p className="text-slate-500 text-sm font-semibold mt-1">
                {homeJobs.length > 0 ? (
                  <>
                    Showing <span className="text-slate-800 font-extrabold">{homeJobs.length}</span> of{" "}
                    <span className="text-legpro-primary font-extrabold">{jobsPagination.totalJobs}</span> matching positions
                  </>
                ) : (
                  <span className="text-slate-400">No jobs match your criteria</span>
                )}
              </p>
            </div>
          </div>

          {/* Job List Container */}
          <div className="space-y-5">
            {isJobsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonJobCard key={`skeleton-${i}`} />
              ))
            ) : homeJobs.length > 0 ? (
              homeJobs.map((job) => (
                <div
                  key={job._id || job.id}
                  className="transition-all duration-300 hover:-translate-y-1"
                >
                  <Jobcard job={job} viewMode="list" />
                </div>
              ))
            ) : (
              <div className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  No Matching Positions Found
                </h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto font-medium">
                  Try broadening your search keywords or resetting some of the filters to find more relevant positions.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-legpro-primary to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {jobsPagination.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 px-3 py-2">
                <button
                  onClick={() => changePage(jobsPagination.currentPage - 1)}
                  disabled={!jobsPagination.hasPrev}
                  className={`p-2 rounded-xl transition-all ${
                    !jobsPagination.hasPrev
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-700 hover:bg-white hover:text-legpro-primary shadow-sm"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex px-2">
                  {Array.from(
                    { length: Math.min(5, jobsPagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (jobsPagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (jobsPagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        jobsPagination.currentPage >=
                        jobsPagination.totalPages - 2
                      ) {
                        pageNum = jobsPagination.totalPages - 4 + i;
                      } else {
                        pageNum = jobsPagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => changePage(pageNum)}
                          className={`min-w-[2.5rem] h-10 flex items-center justify-center mx-1 rounded-xl font-bold transition-all ${
                            jobsPagination.currentPage === pageNum
                              ? "bg-legpro-primary text-white shadow-md scale-105"
                              : "text-slate-700 hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {jobsPagination.totalPages > 5 &&
                    jobsPagination.currentPage <
                      jobsPagination.totalPages - 2 && (
                      <>
                        <span className="min-w-[2.5rem] h-10 flex items-center justify-center mx-1 text-slate-400">
                          ...
                        </span>
                        <button
                          onClick={() =>
                            changePage(jobsPagination.totalPages)
                          }
                          className="min-w-[2.5rem] h-10 flex items-center justify-center mx-1 rounded-xl text-slate-700 hover:bg-white font-bold transition-all"
                        >
                          {jobsPagination.totalPages}
                        </button>
                      </>
                    )}
                </div>

                <button
                  onClick={() => changePage(jobsPagination.currentPage + 1)}
                  disabled={!jobsPagination.hasNext}
                  className={`p-2 rounded-xl transition-all ${
                    !jobsPagination.hasNext
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-700 hover:bg-white hover:text-legpro-primary shadow-sm"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          )}

          {/* Job Count Details */}
          {jobsPagination.totalJobs > 0 && (
            <div className="text-center text-slate-400 mt-6 text-xs font-bold tracking-wide">
              Displaying positions {(jobsPagination.currentPage - 1) * 9 + 1}-
              {Math.min(
                jobsPagination.currentPage * 9,
                jobsPagination.totalJobs
              )}{" "}
              of {jobsPagination.totalJobs}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
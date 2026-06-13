import { useContext, useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "../../utils/axiosConfig";

const Dashboard = () => {
  const navigate = useNavigate();

  const { companyData, logout, isRecruiterLoggingOut } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Credit system removed

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (companyData && window.location.pathname === "/dashboard") {
      navigate("/dashboard/profile");
    }

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [companyData, navigate]);

  // Close sidebar when navigation happens on mobile
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Credit system removed

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Navbar */}
      <nav className="bg-white shadow-md py-3 px-4 md:px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-20 h-16">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-xl font-bold text-legpro-primary tracking-tight">
            Job Mela <span className="text-gray-600">Admin</span>
          </h1>
        </div>

        {/* Company Profile Section */}
        {companyData && (
          <div className="relative flex items-center gap-3 profile-dropdown">
            {/* Credit system removed */}
            {/* Company Name */}
            <span className="font-medium text-gray-800 max-md:hidden">
              {companyData.name}
            </span>

            {/* Company Profile Image */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center focus:outline-none"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <img
                className="w-10 h-10 border border-gray-200 rounded-full cursor-pointer object-cover hover:ring-2 hover:ring-blue-300 transition-all"
                src={companyData.image || assets.company_icon}
                alt={`${companyData.name} profile`}
                onError={(e) => {
                  e.target.src = assets.company_icon;
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                  <p className="text-sm font-medium text-gray-800">
                    {companyData.name}
                  </p>
                </div>
                <ul className="list-none text-sm">
                  <li>
                    <button
                      onClick={logout}
                      disabled={isRecruiterLoggingOut}
                      className="w-full text-left px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors opacity-80 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isRecruiterLoggingOut ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          Logging out...
                        </>
                      ) : (
                        "Logout"
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="flex flex-1 pt-16">
        {" "}
        {/* Add top padding to account for fixed navbar */}
        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Sticky Sidebar */}
        <aside
          className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-20 bg-white border-r shadow-md transition-all duration-300 overflow-y-auto ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full md:translate-x-0"
          }`}
        >
          <ul className="flex flex-col pt-2 text-gray-800">
            <SidebarItem
              to="/dashboard/profile"
              icon={assets.profile_upload_icon}
              label="Company Profile"
              isSidebarOpen={true}
              onClick={handleNavigation}
            />

            <SidebarItem
              to="/dashboard/add-job"
              icon={assets.add_icon}
              label="Add Job"
              isSidebarOpen={true}
              onClick={handleNavigation}
            />

            <SidebarItem
              to="/dashboard/manage-jobs"
              icon={assets.home_icon}
              label="Manage Jobs"
              isSidebarOpen={true}
              onClick={handleNavigation}
            />

            <SidebarItem
              to="/dashboard/view-applications"
              icon={assets.person_tick_icon}
              label="Search Candidate"
              isSidebarOpen={true}
              onClick={handleNavigation}
            />

            <li>
              <a
                href="/dashboard/crm"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavigation}
                className="flex items-center p-3 px-5 gap-3 w-full transition-all duration-200 hover:bg-gray-100 hover:border-l-4 hover:border-blue-300"
              >
                <img className="w-5 h-5" src={assets.person_tick_icon} alt="" />
                <p className="font-medium">Recruitment CRM</p>
              </a>
            </li>
          </ul>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Credit system removed */}
    </div>
  );
};

/**
 * Sidebar Navigation Item Component
 */
const SidebarItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center p-3 px-5 gap-3 w-full transition-all duration-200
        ${
          isActive
            ? "bg-blue-500 text-white border-l-4 border-blue-700"
            : "hover:bg-gray-100 hover:border-l-4 hover:border-blue-300"
        }`
      }
    >
      <img className="w-5 h-5" src={icon} alt="" />
      <p className="transition-opacity font-medium">{label}</p>
    </NavLink>
  );
};

export default Dashboard;

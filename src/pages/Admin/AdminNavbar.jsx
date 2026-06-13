import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext);
  const { backendUrl, isAdminSidebar, setIsAdminSidebar } =
    useContext(AppContext);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      if (!adminToken) return;
      try {
        const [uRes, jRes, cRes] = await Promise.all([
          fetch(`${backendUrl}/api/admin/all-users`, {
            credentials: "include",
          }),
          fetch(`${backendUrl}/api/jobs/`, { credentials: "include" }),
          fetch(`${backendUrl}/api/admin/companies`, {
            credentials: "include",
          }),
        ]);

        if (!isMounted) return;
        if (uRes.ok) {
          const d = await uRes.json();
          setTotalUsers(
            Array.isArray(d?.users) ? d.users.length : d?.users?.total ?? 0
          );
        }
        if (jRes.ok) {
          const d = await jRes.json();
          setTotalJobs(
            Array.isArray(d?.jobs) ? d.jobs.length : d?.jobs?.total ?? 0
          );
        }
        if (cRes.ok) {
          const d = await cRes.json();
          setTotalCompanies(
            Array.isArray(d?.companies)
              ? d.companies.length
              : d?.companies?.total ?? 0
          );
        }
      } catch (error) {
        // Avoid noisy JSON parse errors if backend returns HTML (e.g., 401/redirect)
        console.debug("AdminNavbar stats fetch skipped:", error?.message);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [adminToken, backendUrl]);

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/api/admin/logout`, { credentials: "include" });
    } catch (e) {
      // non-blocking
    } finally {
      setAdminToken("");
      localStorage.removeItem("aToken");
      localStorage.setItem("boolAP", false);
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Mobile menu + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminSidebar(!isAdminSidebar)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Job Mela Admin</span>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600">
              Admin
            </span>
          </div>
        </div>

        {/* Right: Stats + Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs text-gray-700">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
              Users: {totalUsers}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-green-50 border border-green-100">
              Jobs: {totalJobs}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100">
              Companies: {totalCompanies}
            </span>
          </div>
          <button
            onClick={logout}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

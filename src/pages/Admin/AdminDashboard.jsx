import React, { useContext, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/Components/Admin/Sidebar";
import AdminNavbar from "./AdminNavbar";
import JobCreationForm from "@/Components/Admin/JobCreationForm";
import JobManagement from "@/Components/Admin/JobManagement";
import CompaniesManagement from "@/Components/Admin/CompaniesManagement";
import Analytics from "@/Components/Admin/Analytics";
import UsersManagement from "@/Components/Admin/UsersManagement";
import SubAdmins from "@/Components/Admin/SubAdmins";

const AdminDashboard = () => {
  const { adminToken } = useContext(AdminContext);
  const { backendUrl } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("manage_jobs");
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      if (activeTab === 'all_user') {
        const res = await axios.get(`${backendUrl}/api/admin/all-users`, { 
          withCredentials: true 
        });
        setUsers(res.data?.users || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, backendUrl]);

  const renderContent = () => {
    switch (activeTab) {
      case "manage_jobs":
        return <JobManagement />;
      case "all_user":
        return <UsersManagement />;
      case "sub_admins":
        return <SubAdmins />;
      case "companies":
        return <CompaniesManagement />;
      case "analytics":
        return <Analytics />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600">Welcome to the admin dashboard! Manage jobs, users, and analyze your platform metrics.</p>
            </div>
          </div>
        );
    }
  };

  // Access is already protected by AdminPrivateRoute

  // Main admin dashboard
  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;



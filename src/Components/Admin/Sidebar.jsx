import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { Plus, Briefcase, User, Building2, BarChart3, ExternalLink } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { isAdminSidebar } = useContext(AppContext);

  const tabs = [
    {
      name: "Manage Jobs",
      icon: <Briefcase className="w-5 h-5" />,
      value: "manage_jobs",
    },
    {
      name: "All Users",
      icon: <User className="w-5 h-5" />,
      value: "all_user",
    },
    {
      name: "Companies",
      icon: <Building2 className="w-5 h-5" />,
      value: "companies",
    },
    {
      name: "SubAdmins",
      icon: <User className="w-5 h-5" />,
      value: "sub_admins",
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      value: "analytics",
    },
  ];

  return (
    <aside
      className={`
        w-64 bg-blue-950 text-white p-4 min-h-[100vh] z-40 fixed top-14 md:top-0 md:relative transition-transform duration-300
        ${isAdminSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <div className="text-lg font-semibold mb-4 tracking-wide opacity-80">
        Navigation
      </div>
      <nav className="flex flex-col gap-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                active ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-900/60"
              }`}
            >
              {/* Active indicator bar */}
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r ${active ? "bg-white" : "bg-transparent"}`} />
              <span className="opacity-90">{tab.icon}</span>
              <span className="text-sm">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

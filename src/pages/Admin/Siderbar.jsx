import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Plus, Briefcase, User, Building2, BarChart3 } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { isAdminSidebar } = useContext(AppContext);

  const tabs = [
    {
      name: "Create Job",
      icon: <Plus className="w-5 h-5" />,
      value: "create_job",
    },
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
      name: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      value: "analytics",
    },
  ];

  return (
    <div
      className={`
        w-64  bg-blue-950 text-white p-4  min-h-[100vh] z-40 fixed top-14 md:relative transition-transform duration-300
        ${isAdminSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <div className="text-2xl font-bold mb-6 tracking-wide">
        Job Mela Admin
      </div>
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
              activeTab === tab.value
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-800 hover:text-white text-gray-300"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

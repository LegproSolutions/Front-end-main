import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
const backendUrl = import.meta.env?.VITE_API_URL;

const DetailsNavbarPage = () => {
  const { adminData, setAdminData, setIsAdminAuthenticated } =
      useContext(AppContext);
  const navigate = useNavigate();

 

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
        localStorage.removeItem("boolAP");
        setIsAdminAuthenticated(false)
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-legpro-primary text-white shadow-md p-4 flex items-center justify-between">
     
      

      {/* Logo */}
      <div className=" text-2xl font-bold tracking-wide text-center md:text-left">
        <span className="text-orange-400">Job</span> Mela{" "}
        <span className="text-sm font-light">Admin Panel</span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
      >
        Logout
      </button>
    </nav>
  );
};

export default DetailsNavbarPage;

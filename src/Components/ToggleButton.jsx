import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import toast from "react-hot-toast";

const ToggleButton = () => {
  const { isJobsLoading, setIsJobsLoading, sethomeJobs, jobType, setJobType } =
    useContext(AppContext);

  const handleJobTypeChange = async (type) => {
    const newType = jobType === type ? "" : type;
    setJobType(newType);
  };

  return (
    <div className="flex flex-row w-full gap-2 mt-2">
      <div className="flex flex-row w-full bg-[#e3c89d] py-1 gap-1 rounded-2xl pr-2">
        <button
          disabled={isJobsLoading}
          className={`px-4 py-2 rounded-xl ml-2 font-semibold transition-all duration-300 ease-in-out w-4/12
          ${
            jobType === ""
              ? "bg-[#bb9d74] text-gray-100"
              : "bg-[#e3c89d] text-[#896341]"
          }`}
          onClick={() => handleJobTypeChange("")}
        >
          All
        </button>
        <button
          disabled={isJobsLoading}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ease-in-out w-full
          ${
            jobType === "blue"
              ? "bg-[#bb9d74] text-gray-100"
              : "bg-[#e3c89d] text-[#896341]"
          }`}
          onClick={() => handleJobTypeChange("blue")}
        >
          Blue Collar
        </button>
        <button
          disabled={isJobsLoading}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ease-in-out w-full
          ${
            jobType === "white"
              ? "bg-[#bb9d74] text-gray-100"
              : "bg-[#e3c89d] text-[#896341]"
          }`}
          onClick={() => handleJobTypeChange("white")}
        >
          White Collar
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;

// EducationForm.jsx
import React, { forwardRef, useImperativeHandle,useContext, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, X } from "lucide-react";
// import { AppContext } from "../context/AppContext";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EducationForm = forwardRef(({ initialEducationData = {}, updateEducationData },ref) => {
  const { userData } = useContext(AppContext);

  // Use user's education data if available; otherwise fall back to initialEducationData.
  const [educationData, setEducationData] = useState(
    userData.education || initialEducationData
  );
  const [selectedLevels, setSelectedLevels] = useState(
    Object.keys(userData.education || initialEducationData)
  );
  
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 1;
  const educationLevels = ["12th", "ITI", "Diploma", "UG", "PG"];
  // levelsorder for validate education pages
  const levelsOrder = ["10th", "12th", "UG", "PG", "Diploma", "ITI"];





const selectedPaginationList = [...selectedLevels];
  

  // Update state if userData.education changes (for example, on reload) or  reset page when levels change from backend reload:
  useEffect(() => {
    if (userData.education) {
      const levels = Object.keys(userData.education);
      setEducationData(userData.education);
      setSelectedLevels(levels);
      setTotalPages(Math.ceil(levelsOrder.filter((l) => levels.includes(l)).length / itemsPerPage));
      setCurrentPage(1);
    }
  }, [userData.education]);

  // useEffect to recalculate on level changes:
  useEffect(() => {
    const pages = Math.ceil(selectedPaginationList.length / itemsPerPage);
    setTotalPages(pages);
    if (currentPage > pages) {
      setCurrentPage(pages || 1); // fallback to page 1
    }
  }, [selectedPaginationList]);

  const levelSpecificFields = {
    "10th": ["courseType"],
    "12th": ["courseType"],
    ITI: ["courseDuration", "trade"],
    Diploma: ["courseDuration", "specialization"],
    UG: ["courseDuration", "courseName", "specialization"],
    PG: ["courseDuration", "courseName", "specialization", "courseType"],
  };

  const getRequiredFields = (level) => {
    const commonFields = ["instituteName", "certificationBody", "passingYear", "percentage"];
    const extraFields = levelSpecificFields[level] || [];
    return [...commonFields, ...extraFields];
  };
// Form field validation 
const fieldLabels = {
  instituteName: "Institute Name",
  certificationBody: "Certification Body",
  passingYear: "Passing Year",
  percentage: "Percentage/CGPA",
  courseType: "Course Type",
  courseDuration: "Course Duration",
  specialization: "Specialization",
  courseName: "Course Name",
  trade: "Trade",
};

const isFormFilled = (level) => {
  const fields = educationData[level]?.instituteFields;
  if (!fields) return false;

  const requiredFields = getRequiredFields(level);

  for (let field of requiredFields) {
    const label = fieldLabels[field] || field;
    const value = fields[field]?.toString().trim();

    // ✅ Check empty
    if (!value) {
      toast.error(`Please fill the ${label} in ${level}`);
      return false;
    }

    // ✅ Field-specific validation
    switch (field) {
      case "passingYear":
        if (!/^[0-9]{4}$/.test(value)) {
          toast.error(`"${label}" in ${level} must be a valid 4-digit year.`);
          return false;
        }
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (year < 1950 || year > currentYear) {
          toast.error(`${label} in ${level} must be between 1950 and ${currentYear}`);
          return false;
        }
        break;

      case "percentage":
        const percent = parseFloat(value);
        if (isNaN(percent) || percent < 0 || percent > 100) {
          toast.error(`${label} in ${level} must be between 0 and 100`);
          return false;
        }
        break;

      case "courseDuration":
        const duration = parseFloat(value);
        if (isNaN(duration) || duration <= 0 || duration > 10) {
          toast.error(`${label} in ${level} must be between 1 and 10 years`);
          return false;
        }
        break;
    }
  }

  return true;
};


const handleLevelSelection = (level) => {
  // ✅ Unselect logic with validations remains same...
  
  if (selectedLevels.includes(level)) {
    if (level === "12th") {
      const stillSelected = [];
      if (selectedLevels.includes("UG")) stillSelected.push("UG");
      if (selectedLevels.includes("PG")) stillSelected.push("PG");

      if (stillSelected.length > 0) {
        toast.error(`Please unselect ${stillSelected.join(" and ")} before unselecting 12th.`);
        return;
      }
    }

    if (level === "UG" && selectedLevels.includes("PG")) {
      toast.error("Please unselect PG before unselecting UG.");
      return;
    }

    const newLevels = selectedLevels.filter((l) => l !== level);
    setSelectedLevels(newLevels);

    const newEducationData = { ...educationData };
    delete newEducationData[level];
    setEducationData(newEducationData);
    updateEducationData(newEducationData);

    toast.success(`${level} removed from education`);
  } else {
    // ✅ Additional Validations for selection only (sequence logic)
    if (level === "UG" && !selectedLevels.includes("12th")) {
      toast.error("Please select 12th before choosing UG.");
      return;
    }

    if (level === "PG") {
      const missing = [];
      if (!selectedLevels.includes("12th")) missing.push("12th");
      if (!selectedLevels.includes("UG")) missing.push("UG");

      if (missing.length > 0) {
        toast.error(`Please select ${missing.join(" and ")} before choosing PG.`);
        return;
      }
    }

    const newLevels = [...selectedLevels, level];
    setSelectedLevels(newLevels);

    const newEducationData = {
      ...educationData,
      [level]: {
        instituteType: level,
        instituteFields: {
          instituteName: "",
          certificationBody: "",
          passingYear: "",
          percentage: "",
          courseType: "",
          courseDuration: "",
          specialization: "",
          courseName: "",
          trade: "",
        },
      },
    };

    setEducationData(newEducationData);
    updateEducationData(newEducationData);

    toast.success(`${level} added to education`);
  }
};
const handleNext = () => {
  const currentLevel = selectedPaginationList[currentPage - 1];
  const nextLevel = selectedPaginationList[currentPage];

  if (!currentLevel) {
    toast.error("Invalid page level.");
    return;
  }

  if (!isFormFilled(currentLevel)) {
    return; // error already handled inside isFormFilled
  }

  // 🔁 Ensure all previous levels (before nextLevel) are filled
  if (nextLevel) {
    const currentIndex = selectedPaginationList.findIndex((l) => l === nextLevel);
    for (let i = 0; i < currentIndex; i++) {
      const level = selectedPaginationList[i];
      if (!isFormFilled(level)) {
        toast.error(`Please fill ${level} details before proceeding to ${nextLevel}.`);
        return;
      }
    }
  }

  // ✅ Go to next page
  if (currentPage < selectedPaginationList.length) {
    setCurrentPage((prev) => prev + 1);
  } else {
    toast.success("All education details filled successfully!");
  }
};




 // This function checks all selected levels are filled properly
const isAllSelectedLevelsValid = () => {
  for (let level of selectedLevels) {
    if (!isFormFilled(level)) {
      return { valid: false, level };
    }
  }
  return { valid: true };
};

 // Expose it to parent using useImperativeHandle
 useImperativeHandle(ref, () => ({
  validateEducationForms: isAllSelectedLevelsValid,
}));





  const handleInputChange = (level, field, value) => {
    const newEducationData = {
      ...educationData,
      [level]: {
        ...educationData[level],
        instituteFields: {
          ...educationData[level].instituteFields,
          [field]: value,
        },
      },
    };
    setEducationData(newEducationData);
    updateEducationData(newEducationData);
  };

  const renderEducationFields = (level) => {
    // Local data from state.
    const data = educationData[level]?.instituteFields || {};
    const instituteName = data.instituteName || "";
    const certificationBody = data.certificationBody || "";
    const passingYear = data.passingYear || "";
    const percentage = data.percentage || "";
    const courseType = data.courseType || "";
    const courseDuration = data.courseDuration || "";
    const specialization = data.specialization || "";
    const courseName = data.courseName || "";
    const trade = data.trade || "";
    
    
    const commonFields = (
      <>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institute Name
          </label>
          <input
            type="text"
            value={instituteName}
            onChange={(e) =>
              handleInputChange(level, "instituteName", e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Enter institute name"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certification Body
          </label>
          <input
            type="text"
            value={certificationBody}
            onChange={(e) =>
              handleInputChange(level, "certificationBody", e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Enter certification body"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passing Year
            </label>
            <input
              type="number"
              value={passingYear}
              onChange={(e) =>
                handleInputChange(level, "passingYear", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="YYYY"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentage/CGPA
            </label>
            <input
              type="number"
              step="0.01"
              value={percentage}
              onChange={(e) =>
                handleInputChange(level, "percentage", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Enter percentage"
              required
            />
          </div>
        </div>
      </>
    );

    const additionalFields = {
      "10th": (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Type
          </label>
          <input
            type="text"
            value={courseType}
            onChange={(e) =>
              handleInputChange(level, "courseType", e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Enter course type"
            required
          />
        </div>
      ),
      "12th": (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Type
          </label>
          <select
            value={courseType}
            onChange={(e) =>
              handleInputChange(level, "courseType", e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            required
          >
            <option value="">Select Course Type</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
          </select>
        </div>
      ),
      ITI: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Duration (Years)
            </label>
            <input
              type="number"
              value={courseDuration}
              onChange={(e) =>
                handleInputChange(level, "courseDuration", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Enter duration"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trade/Specialization
            </label>
            <input
              type="text"
              value={trade}
              onChange={(e) =>
                handleInputChange(level, "trade", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Enter trade/specialization"
              required
            />
          </div>
        </div>
      ),
      Diploma: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Duration (Years)
            </label>
            <input
              type="number"
              value={courseDuration}
              onChange={(e) =>
                handleInputChange(level, "courseDuration", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Enter duration"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) =>
                handleInputChange(level, "specialization", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Enter specialization"
              required
            />
          </div>
        </div>
      ),
      UG: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Duration (Years)
              </label>
              <input
                type="number"
                value={courseDuration}
                onChange={(e) =>
                  handleInputChange(level, "courseDuration", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter duration"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) =>
                  handleInputChange(level, "courseName", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter course name"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) =>
                handleInputChange(level, "specialization", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Enter specialization"
              required
            />
          </div>
        </>
      ),
      PG: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Duration (Years)
              </label>
              <input
                type="number"
                value={courseDuration}
                onChange={(e) =>
                  handleInputChange(level, "courseDuration", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter duration"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) =>
                  handleInputChange(level, "courseName", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter course name"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) =>
                  handleInputChange(level, "specialization", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter specialization"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type
              </label>
              <select
                value={courseType}
                onChange={(e) =>
                  handleInputChange(level, "courseType", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Select Course Type</option>
                <option value="Regular">Regular</option>
                <option value="Distance">Distance</option>
              </select>
            </div>
          </div>
        </>
      ),
    };
     
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2" />
            {level} Grade Details
          </h2>
          {level !== "10th" && (
            <button
              type="button"
              onClick={() => handleLevelSelection(level)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {commonFields}
        {additionalFields[level]}
      </div>
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleLevels = selectedLevels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Section to select additional education levels */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <GraduationCap className="w-6 h-6 mr-2" />
          Select Additional Education Levels
        </h3>
        <div className="flex flex-wrap gap-4">
          {educationLevels.map((level) => (
            <label
              key={level}
              className={`
                inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  selectedLevels.includes(level)
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => handleLevelSelection(level)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-2"
              />
              <span className="font-medium">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {visibleLevels.map((level) => (
        <div key={level}>{renderEducationFields(level)}</div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>
        <span className="text-sm font-medium text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        {/* Add Handle next function */}
        <button
          type="button"
          onClick={() =>
            handleNext()
            
          }
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
        </div>
      )}
    </div>
  );
});

export default EducationForm;

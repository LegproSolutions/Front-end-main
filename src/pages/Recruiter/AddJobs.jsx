import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import statesAndCities from "../../../states_districts_raw.json";
import toast from "react-hot-toast";
import {
  Briefcase,
  Plus,
  Building2,
  User,
  DollarSign,
  MapPin,
  GraduationCap,
  IndianRupee,
  Users,
  TrendingUp,
  Trash2,
  HelpCircle,
  Calendar,
  Clock,
  MapPin as MapPinIcon,
  Shield,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const qualificationSpecializations = {
  "ITI": ["Fitter", "Turner", "Machinist", "Electrician", "Welder", "COPA", "Diesel Mechanic", "Motor Mechanic", "Wireman", "Others"],
  "Diploma": ["Mechanical Engineering", "Electrical Engineering", "Automobile Engineering", "Civil Engineering", "Electronics Engineering", "Production Engineering", "Others"],
  "Graduation": ["B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry", "B.Com", "BBA", "BA", "B.Tech Mechanical", "B.Tech Electrical", "B.Tech Civil", "Others"],
  "Post Graduation": ["M.Tech", "MBA", "M.Sc", "MCA", "M.Com", "MA", "Others"],
  "10th": ["General"],
  "12th": ["Science", "Commerce", "Arts"],
  "Others": ["General"]
};

const documentOptions = ["Aadhaar Card", "PAN Card", "Bank Account Details", "Resume", "Educational Certificates", "Passport Size Photo", "Experience Letter", "Police Verification (Optional)"];
const languageOptions = ["Hindi", "English", "Marathi", "Tamil", "Telugu", "Kannada", "Gujarati", "Bengali", "Punjabi", "Other"];

const AddJob = () => {
  const navigate = useNavigate();
  const { postJob } = useContext(AppContext);

  // Active Tab State
  const [activeSection, setActiveSection] = useState("core");

  // Core Details States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [categories, setCategories] = useState(JobCategories);
  const [level, setLevel] = useState("Entry Level");
  const [employmentType, setEmploymentType] = useState("full-time");
  const [jobType, setJobType] = useState("white");
  const [location, setLocation] = useState("Bangalore");
  const [deadline, setDeadline] = useState("");
  
  // Vacancy & Joining Details
  const [vacancies, setVacancies] = useState("");
  const [immediateJoining, setImmediateJoining] = useState(false);
  const [joiningWithin, setJoiningWithin] = useState("15 Days");

  // Experience, Age & Gender Limits
  const [experienceOption, setExperienceOption] = useState("Fresher");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");

  // Multiple Qualifications Block State
  const [educationRequirements, setEducationRequirements] = useState([
    { qualification: "ITI", specializations: [] }
  ]);

  // Languages & Documents Checklists
  const [languages, setLanguages] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);

  // Shift details
  const [shiftDetails, setShiftDetails] = useState({
    shiftType: "General Shift",
    shiftTiming: "",
    weeklyOff: "Sunday",
    workingDays: "6"
  });

  // Detailed Salary Breakdown
  const [salaryBreakdown, setSalaryBreakdown] = useState({
    inHand: "",
    gross: "",
    ctc: "",
    variablePay: "",
    incentives: "",
    attendanceBonus: "",
    productionBonus: "",
    otAvailable: "No",
    otRate: ""
  });

  // Benefits & Facilities Module
  const [benefits, setBenefits] = useState({
    food: [],
    transportation: [],
    uniform: [],
    incentives: [],
    overtime: [],
    accommodation: [],
    healthcare: [],
    other: []
  });

  // Location details
  const [workLocationDetails, setWorkLocationDetails] = useState({
    plantName: "",
    unitName: "",
    address: "",
    pinCode: "",
    latitude: "",
    longitude: ""
  });

  // HR Contact Information
  const [hrContact, setHrContact] = useState({
    name: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    whatsapp: ""
  });

  // Company details
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");

  // Interview Process Configuration
  const [interviewProcess, setInterviewProcess] = useState({
    type: "Walk-In Interview",
    date: "",
    time: "",
    address: "",
    link: ""
  });

  // Custom Screening Questions
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("yes_no");
  const [newQuestionOptions, setNewQuestionOptions] = useState("");
  const [newPreferredAnswer, setNewPreferredAnswer] = useState("");

  // Location search states
  const [customCity, setCustomCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [stateIsOpen, setStateIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Category handler functions
  const handleCategoryChange = (value) => {
    if (value === "Other") {
      setShowCustomInput(true);
      setCategory("");
    } else {
      setCategory(value);
      setShowCustomInput(false);
      setCustomCategory("");
    }
  };

  const addCustomCategory = () => {
    if (customCategory.trim()) {
      const newCategory = customCategory.trim();
      if (!categories.includes(newCategory)) {
        const updated = [
          ...categories.filter((c) => c !== "Other"),
          newCategory,
          "Other",
        ];
        setCategories(updated);
      }
      setCategory(newCategory);
      setCustomCategory("");
      setShowCustomInput(false);
    }
  };

  const handleCustomCategorySubmit = (e) => {
    if (e.key === "Enter") {
      addCustomCategory();
    }
  };

  const filteredStates = Object.keys(statesAndCities).filter((st) =>
    st.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const citiesList = companyState ? (statesAndCities[companyState] || []) : [];
  const filteredLocations = citiesList.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById("citySearchInput");
        input?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (stateIsOpen) {
      setTimeout(() => {
        const input = document.getElementById("stateSearchInput");
        input?.focus();
      }, 100);
    }
  }, [stateIsOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setStateIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showOtherCityInput = location === "Other City";
  const handleConfirmCity = () => {
    if (customCity.trim()) {
      setLocation(customCity.trim());
      setCustomCity("");
      setIsOpen(false);
    }
  };

  // Multiple Qualifications handlers
  const handleAddQualification = () => {
    setEducationRequirements([
      ...educationRequirements,
      { qualification: "ITI", specializations: [] }
    ]);
  };

  const handleRemoveQualification = (index) => {
    setEducationRequirements(educationRequirements.filter((_, i) => i !== index));
  };

  const handleQualificationChange = (index, value) => {
    const updated = [...educationRequirements];
    updated[index].qualification = value;
    updated[index].specializations = []; // Reset trades/specs on qualification change
    setEducationRequirements(updated);
  };

  const handleSpecializationToggle = (blockIndex, spec) => {
    const updated = [...educationRequirements];
    const specs = updated[blockIndex].specializations;
    if (specs.includes(spec)) {
      updated[blockIndex].specializations = specs.filter((s) => s !== spec);
    } else {
      updated[blockIndex].specializations = [...specs, spec];
    }
    setEducationRequirements(updated);
  };

  // Screening Questions handlers
  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error("Screening question text is required.");
      return;
    }
    
    let optionsArray = [];
    if (newQuestionType === "mcq") {
      optionsArray = newQuestionOptions.split(",").map((o) => o.trim()).filter(Boolean);
      if (optionsArray.length < 2) {
        toast.error("Please provide at least 2 comma-separated options for MCQ.");
        return;
      }
    } else if (newQuestionType === "yes_no") {
      optionsArray = ["Yes", "No"];
    }

    const question = {
      id: Date.now().toString(),
      questionText: newQuestionText.trim(),
      type: newQuestionType,
      options: optionsArray,
      preferredAnswer: newPreferredAnswer.trim()
    };

    setScreeningQuestions([...screeningQuestions, question]);
    setNewQuestionText("");
    setNewQuestionType("yes_no");
    setNewQuestionOptions("");
    setNewPreferredAnswer("");
    toast.success("Screening question added!");
  };

  const handleRemoveQuestion = (id) => {
    setScreeningQuestions(screeningQuestions.filter((q) => q.id !== id));
  };

  const toggleDocument = (doc) => {
    if (requiredDocuments.includes(doc)) {
      setRequiredDocuments(requiredDocuments.filter((d) => d !== doc));
    } else {
      setRequiredDocuments([...requiredDocuments, doc]);
    }
  };

  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  // Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!quillRef.current) return;

    const description = quillRef.current.root.innerHTML;

    if (!title || !description || !location || !category || !deadline || !vacancies || !companyName) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    const jobData = {
      title,
      description,
      location,
      salary: salaryBreakdown.ctc ? Number(salaryBreakdown.ctc) : 0,
      openings: vacancies ? Number(vacancies) : 1,
      experience: experienceOption === "Fresher" ? 0 : Number(minExperience || 0),
      category,
      qualification: educationRequirements[0]?.qualification || "Graduate",
      level,
      jobType,
      employmentType,
      deadline: new Date(deadline),
      
      // Advanced fields
      educationRequirements,
      benefits,
      hrContact,
      shiftDetails,
      salaryBreakdown,
      workLocationDetails,
      genderPreference,
      minAge: minAge ? parseInt(minAge) : null,
      maxAge: maxAge ? parseInt(maxAge) : null,
      experienceOption,
      minExperience: minExperience ? parseInt(minExperience) : null,
      maxExperience: maxExperience ? parseInt(maxExperience) : null,
      languages,
      requiredDocuments,
      immediateJoining,
      joiningWithin,
      vacancies: vacancies ? parseInt(vacancies) : null,
      interviewProcess,
      screeningQuestions,
      companyDetails: {
        name: companyName || "",
        shortDescription: companyDesc || "",
        city: companyCity || "",
        state: companyState || "",
        country: companyCountry || "",
        hrName: hrContact.name || "",
        hrEmail: hrContact.email || "",
        hrPhone: hrContact.mobile || "",
      },
    };

    const result = await postJob(jobData);

    if (result.success) {
      toast.success("Job posted successfully. It will be visible once approved by the admin team.");
      navigate("/dashboard/manage-jobs");
    } else {
      toast.error(result.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write detailed job description here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["link"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-legpro-primary px-8 py-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-200" />
              Advanced Job Posting Creator
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Add granular requirements, benefits checklists, shifts, maps, and custom ATS screening questionnaires.
            </p>
          </div>

          {/* Form Tabs */}
          <div className="bg-slate-50 px-8 py-3 border-b border-gray-200 overflow-x-auto flex gap-4">
            {[
              { id: "core", label: "Core Job Details" },
              { id: "edu", label: "Education & Qualifications" },
              { id: "salary", label: "Salary, Shifts & Benefits" },
              { id: "location", label: "Location & HR Contact" },
              { id: "screening", label: "Interview & Custom Screening" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeSection === tab.id
                    ? "bg-legpro-primary text-white shadow"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmitHandler} className="p-8 space-y-8">

            {/* TAB 1: CORE JOB DETAILS */}
            {activeSection === "core" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical Fitter Lead"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">
                      Job Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={category || (showCustomInput ? "Other" : "")}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>Select Category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {showCustomInput && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg outline-none"
                          placeholder="Specify custom category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          onKeyDown={handleCustomCategorySubmit}
                        />
                        <button
                          type="button"
                          onClick={addCustomCategory}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <div ref={editorRef} className="border border-gray-300 rounded-lg min-h-[200px]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Job Type</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option value="white">White Collar</option>
                      <option value="blue">Blue Collar / Technical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Employment Type</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="internship">Internship</option>
                      <option value="unpaid">Unpaid Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Experience Option</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={experienceOption}
                      onChange={(e) => setExperienceOption(e.target.value)}
                    >
                      <option value="Fresher">Fresher Only</option>
                      <option value="Experienced">Experienced Only</option>
                      <option value="Both">Both (Fresher & Experienced)</option>
                    </select>
                  </div>
                </div>

                {experienceOption === "Experienced" && (
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Minimum Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 1"
                        value={minExperience}
                        onChange={(e) => setMinExperience(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Maximum Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        value={maxExperience}
                        onChange={(e) => setMaxExperience(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Min Age Eligibility</label>
                    <input
                      type="number"
                      placeholder="e.g. 18"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Max Age Eligibility</label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Gender Preference</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      value={genderPreference}
                      onChange={(e) => setGenderPreference(e.target.value)}
                    >
                      <option value="Any">Any Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">
                      Total Vacancies <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={vacancies}
                      onChange={(e) => setVacancies(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Immediate Joining Required?</label>
                    <div className="flex items-center gap-3 h-11">
                      <input
                        type="checkbox"
                        checked={immediateJoining}
                        onChange={(e) => setImmediateJoining(e.target.checked)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">Yes, hiring urgently</span>
                    </div>
                  </div>

                  {immediateJoining && (
                    <div>
                      <label className="block text-gray-700 font-bold text-sm mb-2">Joining Timeline</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                        value={joiningWithin}
                        onChange={(e) => setJoiningWithin(e.target.value)}
                      >
                        <option value="3 Days">Within 3 Days</option>
                        <option value="7 Days">Within 7 Days</option>
                        <option value="15 Days">Within 15 Days</option>
                        <option value="30 Days">Within 30 Days</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Application Deadline <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Language Requirements</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-xl border border-gray-200">
                      {languageOptions.map((lang) => (
                        <label key={lang} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={languages.includes(lang)}
                            onChange={() => toggleLanguage(lang)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          {lang}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold text-sm mb-2">Required Documents</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
                      {documentOptions.map((doc) => (
                        <label key={doc} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={requiredDocuments.includes(doc)}
                            onChange={() => toggleDocument(doc)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          {doc}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveSection("edu")}
                    className="px-6 py-2.5 bg-legpro-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow"
                  >
                    Next: Education Config
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: EDUCATION CONFIG (MULTI-BLOCK SPECIALIZATIONS) */}
            {activeSection === "edu" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Multiple Qualification Requirement Blocks</h3>
                  <button
                    type="button"
                    onClick={handleAddQualification}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Qualification Block
                  </button>
                </div>

                <div className="space-y-6">
                  {educationRequirements.map((block, blockIdx) => (
                    <div key={blockIdx} className="bg-slate-50 p-6 rounded-2xl border border-gray-200 relative">
                      {educationRequirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQualification(blockIdx)}
                          className="absolute top-4 right-4 text-rose-600 hover:text-rose-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}

                      <h4 className="font-bold text-sm text-blue-700 mb-4">Qualification Requirement #{blockIdx + 1}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-gray-700 font-bold text-xs mb-2">Education / Degree</label>
                          <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                            value={block.qualification}
                            onChange={(e) => handleQualificationChange(blockIdx, e.target.value)}
                          >
                            <option value="10th">10th Pass</option>
                            <option value="12th">12th Pass</option>
                            <option value="ITI">ITI</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Graduation">Graduation</option>
                            <option value="Post Graduation">Post Graduation</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-bold text-xs mb-2">
                            Trades / Stream / Specializations (Matches any selected)
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-4 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
                            {(qualificationSpecializations[block.qualification] || ["General"]).map((spec) => (
                              <label key={spec} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={block.specializations.includes(spec)}
                                  onChange={() => handleSpecializationToggle(blockIdx, spec)}
                                  className="h-4 w-4 text-blue-600 rounded"
                                />
                                {spec}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("core")}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("salary")}
                    className="px-6 py-2.5 bg-legpro-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow"
                  >
                    Next: Compensation & Benefits
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SALARY, SHIFTS & BENEFITS */}
            {activeSection === "salary" && (
              <div className="space-y-8">
                
                {/* Shift Configuration */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Shift & Schedule Config</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Shift Type</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                        value={shiftDetails.shiftType}
                        onChange={(e) => setShiftDetails({ ...shiftDetails, shiftType: e.target.value })}
                      >
                        <option value="General Shift">General Shift</option>
                        <option value="Day Shift">Day Shift</option>
                        <option value="Night Shift">Night Shift</option>
                        <option value="Rotational Shift">Rotational Shift</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Shift Timing</label>
                      <input
                        type="text"
                        placeholder="e.g. 9:00 AM - 6:00 PM"
                        value={shiftDetails.shiftTiming}
                        onChange={(e) => setShiftDetails({ ...shiftDetails, shiftTiming: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Weekly Off</label>
                      <input
                        type="text"
                        placeholder="e.g. Sunday / Rotational"
                        value={shiftDetails.weeklyOff}
                        onChange={(e) => setShiftDetails({ ...shiftDetails, weeklyOff: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Working Days / Week</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                        value={shiftDetails.workingDays}
                        onChange={(e) => setShiftDetails({ ...shiftDetails, workingDays: e.target.value })}
                      >
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                        <option value="6.5">6.5 Days</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Salary Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Salary Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">In-Hand Salary (Monthly)</label>
                      <input
                        type="number"
                        placeholder="e.g. 18000"
                        value={salaryBreakdown.inHand}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, inHand: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Gross Salary (Monthly)</label>
                      <input
                        type="number"
                        placeholder="e.g. 21000"
                        value={salaryBreakdown.gross}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, gross: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">CTC (Annual) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 250000"
                        value={salaryBreakdown.ctc}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, ctc: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Variable Pay / Performance Bonus</label>
                      <input
                        type="text"
                        placeholder="e.g. 2000"
                        value={salaryBreakdown.variablePay}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, variablePay: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Attendance Bonus</label>
                      <input
                        type="text"
                        placeholder="e.g. 1000"
                        value={salaryBreakdown.attendanceBonus}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, attendanceBonus: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Production Incentives</label>
                      <input
                        type="text"
                        placeholder="e.g. 1500"
                        value={salaryBreakdown.productionBonus}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, productionBonus: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Overtime Available?</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                        value={salaryBreakdown.otAvailable}
                        onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, otAvailable: e.target.value })}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>

                    {salaryBreakdown.otAvailable === "Yes" && (
                      <div>
                        <label className="block text-gray-700 font-bold text-xs mb-2">OT Rate Per Hour (INR)</label>
                        <input
                          type="number"
                          placeholder="e.g. 150"
                          value={salaryBreakdown.otRate}
                          onChange={(e) => setSalaryBreakdown({ ...salaryBreakdown, otRate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Employee Benefits Checklists */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Employee Benefits & Facilities Checklist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Food & canteen */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-xs text-blue-700 mb-3">Food & Canteen</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["Free Canteen", "Subsidized Canteen", "Breakfast Facility", "Snacks Facility"].map((facility) => (
                          <label key={facility} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={benefits.food.includes(facility)}
                              onChange={(e) => {
                                const list = e.target.checked
                                  ? [...benefits.food, facility]
                                  : benefits.food.filter((f) => f !== facility);
                                setBenefits({ ...benefits, food: list });
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Transportation */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-xs text-blue-700 mb-3">Transportation</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["Company Bus", "Pick & Drop Facility", "Transportation Allowance"].map((facility) => (
                          <label key={facility} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={benefits.transportation.includes(facility)}
                              onChange={(e) => {
                                const list = e.target.checked
                                  ? [...benefits.transportation, facility]
                                  : benefits.transportation.filter((f) => f !== facility);
                                setBenefits({ ...benefits, transportation: list });
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Uniform & Safety Essentials */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-xs text-blue-700 mb-3">Uniform & Safety Essentials</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {["Company Uniform", "Safety Shoes", "Safety Kit"].map((facility) => (
                          <label key={facility} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={benefits.uniform.includes(facility)}
                              onChange={(e) => {
                                const list = e.target.checked
                                  ? [...benefits.uniform, facility]
                                  : benefits.uniform.filter((f) => f !== facility);
                                setBenefits({ ...benefits, uniform: list });
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation Facilities */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-xs text-blue-700 mb-3">Accommodation Facilities</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {["PG Facility", "Company Accommodation", "Company Support to Find Room (Paid by Candidate)"].map((facility) => (
                          <label key={facility} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={benefits.accommodation.includes(facility)}
                              onChange={(e) => {
                                const list = e.target.checked
                                  ? [...benefits.accommodation, facility]
                                  : benefits.accommodation.filter((f) => f !== facility);
                                setBenefits({ ...benefits, accommodation: list });
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Healthcare & Health insurance */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-xs text-blue-700 mb-3">Healthcare & Allowances</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["Medical Facility", "ESI", "Health Insurance", "Accident Insurance", "PF", "Gratuity", "Annual Bonus", "Festival Bonus"].map((facility) => (
                          <label key={facility} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={benefits.healthcare.includes(facility)}
                              onChange={(e) => {
                                const list = e.target.checked
                                  ? [...benefits.healthcare, facility]
                                  : benefits.healthcare.filter((f) => f !== facility);
                                setBenefits({ ...benefits, healthcare: list });
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("edu")}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("location")}
                    className="px-6 py-2.5 bg-legpro-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow"
                  >
                    Next: Location & Contact
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: LOCATION DETAILS & HR CONTACT */}
            {activeSection === "location" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Plant & Factory Location Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Company Name *</label>
                      <input
                        type="text"
                        placeholder="Company/Factory Entity"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Plant / Factory Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Unit 3 Steel Plant"
                        value={workLocationDetails.plantName}
                        onChange={(e) => setWorkLocationDetails({ ...workLocationDetails, plantName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Unit Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Heavy Machining Unit"
                        value={workLocationDetails.unitName}
                        onChange={(e) => setWorkLocationDetails({ ...workLocationDetails, unitName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold text-xs mb-2">Complete Address *</label>
                    <input
                      type="text"
                      placeholder="Street, Industrial Area"
                      value={workLocationDetails.address}
                      onChange={(e) => setWorkLocationDetails({ ...workLocationDetails, address: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                    />
                  </div>

                  <div className="relative w-full" ref={stateDropdownRef}>
                    <label className="block text-gray-700 font-bold text-xs mb-2">Select State *</label>
                    <div
                      onClick={() => setStateIsOpen(!stateIsOpen)}
                      className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white cursor-pointer"
                    >
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="flex-1 text-sm text-gray-700">{companyState || "Select State"}</span>
                    </div>

                    {stateIsOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          id="stateSearchInput"
                          className="w-full px-3 py-2 border-b border-gray-200 outline-none bg-white"
                          placeholder="Search state"
                          value={stateSearchTerm}
                          onChange={(e) => setStateSearchTerm(e.target.value)}
                        />
                        {filteredStates.map((st, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:text-white hover:bg-[#2563EB] cursor-pointer text-sm"
                            onClick={() => {
                              setCompanyState(st);
                              setStateIsOpen(false);
                              setStateSearchTerm("");
                              // Reset city when state changes
                              setLocation("");
                              setCompanyCity("");
                            }}
                          >
                            {st}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative w-full" ref={dropdownRef}>
                    <label className="block text-gray-700 font-bold text-xs mb-2">City / Location Hub *</label>
                    <div
                      onClick={() => {
                        if (!companyState) {
                          toast.error("Please select a State first.");
                          return;
                        }
                        setIsOpen(!isOpen);
                      }}
                      className={`flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white cursor-pointer ${!companyState ? "opacity-60 bg-gray-50 cursor-not-allowed" : ""}`}
                    >
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="flex-1 text-sm text-gray-700">{location || "Search city"}</span>
                    </div>

                    {isOpen && companyState && (
                      <div className="absolute z-15 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          id="citySearchInput"
                          className="w-full px-3 py-2 border-b border-gray-200 outline-none bg-white"
                          placeholder="Search city"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredLocations.map((loc, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:text-white hover:bg-[#2563EB] cursor-pointer text-sm"
                            onClick={() => {
                              setLocation(loc);
                              setCompanyCity(loc);
                              setIsOpen(false);
                              setSearchTerm("");
                            }}
                          >
                            {loc}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Country</label>
                      <input
                        type="text"
                        placeholder="Country"
                        value={companyCountry}
                        onChange={(e) => setCompanyCountry(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">PIN Code</label>
                      <input
                        type="text"
                        placeholder="PIN"
                        value={workLocationDetails.pinCode}
                        onChange={(e) => setWorkLocationDetails({ ...workLocationDetails, pinCode: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Maps Coordinates */}
                <div>
                  <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4 text-rose-500" /> Google Maps Geolocation Coordinates
                  </h4>
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Latitude</label>
                      <input
                        type="text"
                        placeholder="e.g. 12.971598"
                        value={workLocationDetails.latitude}
                        onChange={(e) => setWorkLocationDetails({ ...workLocationDetails, latitude: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Longitude</label>
                      <input
                        type="text"
                        placeholder="e.g. 77.594562"
                        value={workLocationDetails.longitude}
                        onChange={(e) => setWorkLocationDetails({ ...workLocationDetails, longitude: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* HR Contact Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" /> HR/Liaison Contact Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">HR Representative Name *</label>
                      <input
                        type="text"
                        placeholder="Full Liaison Name"
                        value={hrContact.name}
                        onChange={(e) => setHrContact({ ...hrContact, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">HR Mobile Number *</label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={hrContact.mobile}
                        onChange={(e) => setHrContact({ ...hrContact, mobile: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">HR Alternate Number</label>
                      <input
                        type="tel"
                        placeholder="Alternate phone"
                        value={hrContact.alternateMobile}
                        onChange={(e) => setHrContact({ ...hrContact, alternateMobile: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">HR Email ID</label>
                      <input
                        type="email"
                        placeholder="hr@company.com"
                        value={hrContact.email}
                        onChange={(e) => setHrContact({ ...hrContact, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">WhatsApp Number</label>
                      <input
                        type="tel"
                        placeholder="WhatsApp contact"
                        value={hrContact.whatsapp}
                        onChange={(e) => setHrContact({ ...hrContact, whatsapp: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Company description */}
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">About the Company / Factory</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe entity culture, mission, and growth prospects..."
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                  ></textarea>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("edu")}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("screening")}
                    className="px-6 py-2.5 bg-legpro-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow"
                  >
                    Next: Screening Config
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: INTERVIEW CONFIG & CUSTOM SCREENING QUESTIONS */}
            {activeSection === "screening" && (
              <div className="space-y-8">
                
                {/* Interview Process Configuration */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" /> Interview Process Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Interview Method</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                        value={interviewProcess.type}
                        onChange={(e) => setInterviewProcess({ ...interviewProcess, type: e.target.value })}
                      >
                        <option value="Walk-In Interview">Walk-In Interview</option>
                        <option value="Telephonic Interview">Telephonic Interview</option>
                        <option value="Virtual Interview">Virtual Interview (Google Meet / Zoom)</option>
                        <option value="Face-to-Face Interview">Face-to-Face Office Interview</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Google Meet / Zoom / Venue Link</label>
                      <input
                        type="url"
                        placeholder="https://zoom.us/j/..."
                        value={interviewProcess.link}
                        onChange={(e) => setInterviewProcess({ ...interviewProcess, link: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Interview Date</label>
                      <input
                        type="date"
                        value={interviewProcess.date}
                        onChange={(e) => setInterviewProcess({ ...interviewProcess, date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-xs mb-2">Interview Time</label>
                      <input
                        type="time"
                        value={interviewProcess.time}
                        onChange={(e) => setInterviewProcess({ ...interviewProcess, time: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold text-xs mb-2">Interview Address (For Walk-In/F2F)</label>
                      <input
                        type="text"
                        placeholder="Complete interview office/venue address"
                        value={interviewProcess.address}
                        onChange={(e) => setInterviewProcess({ ...interviewProcess, address: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Application Screening Questions */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-violet-600" /> ATS Application Screening Questions
                  </h3>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 space-y-4 mb-6">
                    <h4 className="font-bold text-xs text-blue-700">Add a New Screening Question</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold text-[10px] mb-1">Question Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Do you have ITI Fitter certification?"
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-[10px] mb-1">Question Type</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                          value={newQuestionType}
                          onChange={(e) => {
                            setNewQuestionType(e.target.value);
                            setNewPreferredAnswer("");
                          }}
                        >
                          <option value="yes_no">Yes / No</option>
                          <option value="mcq">Multiple Choice (MCQ)</option>
                          <option value="text">Text Input</option>
                          <option value="numeric">Numeric Input</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-[10px] mb-1">Preferred/Correct Answer (For ATS Scoring)</label>
                        {newQuestionType === "yes_no" ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            value={newPreferredAnswer}
                            onChange={(e) => setNewPreferredAnswer(e.target.value)}
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Preferred response for candidate ranking"
                            value={newPreferredAnswer}
                            onChange={(e) => setNewPreferredAnswer(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                          />
                        )}
                      </div>
                    </div>

                    {newQuestionType === "mcq" && (
                      <div>
                        <label className="block text-gray-700 font-bold text-[10px] mb-1">MCQ Options (Comma Separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Fitter, Machinist, Electrician"
                          value={newQuestionOptions}
                          onChange={(e) => setNewQuestionOptions(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white text-sm"
                        />
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 text-xs shadow"
                      >
                        Insert Question
                      </button>
                    </div>
                  </div>

                  {/* Added Questions List */}
                  {screeningQuestions.length > 0 && (
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-inner">
                      <table className="w-full bg-white text-left text-xs">
                        <thead className="bg-slate-100 font-bold text-gray-600 uppercase border-b border-gray-200">
                          <tr>
                            <th className="p-4">#</th>
                            <th className="p-4">Question Text</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Preferred Answer</th>
                            <th className="p-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-semibold text-slate-700">
                          {screeningQuestions.map((q, idx) => (
                            <tr key={q.id}>
                              <td className="p-4">{idx + 1}</td>
                              <td className="p-4">{q.questionText}</td>
                              <td className="p-4 uppercase text-blue-600">{q.type}</td>
                              <td className="p-4 text-emerald-600">{q.preferredAnswer}</td>
                              <td className="p-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQuestion(q.id)}
                                  className="text-rose-600 hover:text-rose-800"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveSection("location")}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg"
                  >
                    Post Advanced Job
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;

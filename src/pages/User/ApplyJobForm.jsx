import {
  Calendar,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  User
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import { AppContext } from "../../context/AppContext";
import axios from "../../utils/axiosConfig";
// import EducationForm from "@/Components/EducationForm";
import toast from "react-hot-toast";
import EducationForm from "@/Components/Form/EducationForm";

const ApplyJobForm = ({ jobTitle}) => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { applyForJob, setUserData } = useContext(AppContext);
  const backendUrl = import.meta.env?.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    fatherName: "",
    maritalStatus: "",
    nationality: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    altPhone: "",
    aadharNumber: "",
    height: "",
    weight: "",
    // Auto-filled from the job (read-only)
    appliedJobTitle: jobTitle || "",
    // Address Information (split into two)
    currentAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    // Education – managed via EducationForm.
    // Always include a default "10th" entry.
    education: {
      "10th": {
        instituteType: "10th",
        instituteFields: {
          instituteName: "",
          certificationBody: "",
          passingYear: "",
          percentage: "",
          courseType: "",
        },
      },
    },
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    // Apprenticeship Experience (separate from work experience)
    apprenticeship: {
      companyName: "",
      salary: "",
      location: "",
      tenure: "",
    },
    skills: [],
    languages: [
      {
        name: "",
        proficiency: "",
      },
    ],
    resume: "",
    profilePicture: "",
  });

  const [profileLoaded, setProfileLoaded] = useState(false);
  // For the address checkbox state
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  // For validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  
  // On mount, fetch the user profile and map DB fields to form fields
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
      

        const response = await axios.get(`${backendUrl}/api/profile/get-user`);

        if (response.data.success) {
          const profile = response.data.profile || {};
          // Always ensure "10th" entry in education
          const edu = profile.education || {};
          if (!edu["10th"]) {
            edu["10th"] = {
              instituteType: "10th",
              instituteFields: {
                instituteName: "",
                certificationBody: "",
                passingYear: "",
                percentage: "",
                courseType: "",
              },
            };
          }

          setFormData((prev) => ({
            ...prev,
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            fatherName: profile.fatherName || "",
            maritalStatus: profile.maritalStatus || "",
            nationality: profile.nationality || "",
            gender: profile.gender || "",
            dateOfBirth: profile.dateOfBirth
              ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
              : "",
            email: profile.email || "",
            phone: profile.phone || "",
            altPhone: profile.altPhone || "",
            aadharNumber: profile.aadharNumber || "",
            height: profile.height || "",
            weight: profile.weight || "",
            // appliedJobTitle remains from jobTitle prop
            currentAddress: {
              street: profile.address?.street || "",
              city: profile.address?.city || "",
              state: profile.address?.state || "",
              country: profile.address?.country || "",
              pincode: profile.address?.pincode || "",
            },
            permanentAddress: {
              street: profile.permanentAddress?.street || "",
              city: profile.permanentAddress?.city || "",
              state: profile.permanentAddress?.state || "",
              country: profile.permanentAddress?.country || "",
              pincode: profile.permanentAddress?.pincode || "",
            },
            education: edu,
            experience: profile.experience || [],
            apprenticeship: profile.apprenticeship || {
              companyName: "",
              salary: "",
              location: "",
              tenure: "",
            },
            skills: profile.skills || [],
            languages: profile.languages || [],
            resume: profile.resume || "",
            profilePicture: profile.profilePicture || "",
          }));

          setUserData(profile);
          setProfileLoaded(true);
        } else {
          console.error("Failed to fetch profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/");
      }
    };

    fetchUserProfile();
  }, [backendUrl, navigate, setUserData]);

  // Called by EducationForm to update formData.education
  const updateEducationData = (newEducationData) => {
    setFormData((prev) => ({
      ...prev,
      education: newEducationData,
    }));
  };
const onCancel=()=>{
  navigate(-1);
}
  // Standard handleChange for non-nested fields
  const handleChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (!section) {
      clearFieldError(name);
    }
    
    if (section) {
      // For array-based sections (like experience)
      if (index !== null) {
        setFormData((prev) => ({
          ...prev,
          [section]: prev[section].map((item, i) =>
            i === index
              ? {
                  ...item,
                  [name]:
                    name === "startDate" || name === "endDate"
                      ? new Date(value).toISOString().split("T")[0]
                      : value,
                }
              : item
          ),
        }));
      } else {
        // For object-based sections (like apprenticeship)
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        }));
      }
    } else {
      // Top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "startDate" || name === "endDate"
            ? new Date(value).toISOString().split("T")[0]
            : value,
      }));
    }
  };

  // Handle address change for both current and permanent addresses
  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [name]: value,
      },
    }));
  };

  // Handle checkbox for "Permanent address same as current address"
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAsCurrent(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: { ...prev.currentAddress },
      }));
    }
  };

  // Work Experience add/remove
  const handleAddWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Skills
  const handleSkillsChange = (e) => {
    const newSkills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  // Validation for essential fields only
  const validateEssentialFields = () => {
    const errors = [];
    const newFieldErrors = {};
    
    // Essential personal information
    if (!formData.firstName?.trim()) {
      errors.push("First name is required");
      newFieldErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName?.trim()) {
      errors.push("Last name is required");
      newFieldErrors.lastName = "Last name is required";
    }
    
    if (!formData.email?.trim()) {
      errors.push("Email is required");
      newFieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
      newFieldErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone?.trim()) {
      errors.push("Phone number is required");
      newFieldErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.push("Please enter a valid phone number");
      newFieldErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.dateOfBirth) {
      errors.push("Date of birth is required");
      newFieldErrors.dateOfBirth = "Date of birth is required";
    }
    
    setFieldErrors(newFieldErrors);
    return errors;
  };

  // Clear field error when user starts typing
  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate essential fields
    const validationErrors = validateEssentialFields();
    
    if (validationErrors.length > 0) {
      toast.error(`Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }
    
    try {
      setLoading(true);
      const result = await applyForJob(jobId, formData);
      if (result.success) {
        toast.success("Applied Successfully");
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        "An error occurred while submitting your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        {/* Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-legpro-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-legpro-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onCancel}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft size={20} />
                  <span className="ml-1">Back to Job Details</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Apply for Position
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {jobTitle || "Complete your application"}
                  </p>
                </div>
              </div>
            </div>

            {profileLoaded && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  <span>Your profile data has been pre-filled. Please review and update any information before submitting.</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Basic details about yourself</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.firstName 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-legpro-primary'
                      }`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.lastName 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-legpro-primary'
                      }`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {fieldErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
                  )}
                </div>
              {/* Father’s Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.dateOfBirth 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-legpro-primary'
                      }`}
                    />
                  </div>
                  {fieldErrors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.dateOfBirth}</p>
                  )}
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.email 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-legpro-primary'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.phone 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-legpro-primary'
                      }`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              {/* Alternate Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Aadhar Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Job Title (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="appliedJobTitle"
                  value={formData.appliedJobTitle}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

            {/* Address Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
                  <p className="text-sm text-gray-600">Current and permanent addresses</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Address */}
              <div>
                <h4 className="text-base font-medium mb-2">Current Address</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.currentAddress.street}
                    onChange={(e) => handleAddressChange(e, "currentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.currentAddress.city}
                    onChange={(e) => handleAddressChange(e, "currentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.currentAddress.state}
                    onChange={(e) => handleAddressChange(e, "currentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.currentAddress.country}
                    onChange={(e) => handleAddressChange(e, "currentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.currentAddress.pincode}
                    onChange={(e) => handleAddressChange(e, "currentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              {/* Permanent Address */}
              <div>
                <h4 className="text-base font-medium mb-2">
                  Permanent Address
                </h4>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={sameAsCurrent}
                    onChange={handleSameAddressChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Same as current address
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.permanentAddress.street}
                    onChange={(e) => handleAddressChange(e, "permanentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.permanentAddress.city}
                    onChange={(e) => handleAddressChange(e, "permanentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.permanentAddress.state}
                    onChange={(e) => handleAddressChange(e, "permanentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.permanentAddress.country}
                    onChange={(e) => handleAddressChange(e, "permanentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.permanentAddress.pincode}
                    onChange={(e) => handleAddressChange(e, "permanentAddress")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Education
            </h3>
            <EducationForm
              initialEducationData={formData.education}
              updateEducationData={updateEducationData}
            />
          </div>

          {/* Experience & Apprenticeship */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Work Experience
            </h3>
            {/* Experience Section */}
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleChange(e, "experience", index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={exp.position}
                      onChange={(e) => handleChange(e, "experience", index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleChange(e, "experience", index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={exp.endDate}
                      onChange={(e) => handleChange(e, "experience", index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleChange(e, "experience", index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                    />
                  </div>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        experience: prev.experience.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="text-red-600 hover:text-red-800 mt-2"
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddWorkExperience}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-legpro-primary"
            >
              Add Experience
            </button>

            {/* Apprenticeship Experience Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                Apprenticeship Experience
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.apprenticeship.companyName}
                    onChange={(e) => handleChange(e, "apprenticeship")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.apprenticeship.salary}
                    onChange={(e) => handleChange(e, "apprenticeship")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.apprenticeship.location}
                    onChange={(e) => handleChange(e, "apprenticeship")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tenure (years)
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={formData.apprenticeship.tenure}
                    onChange={(e) => handleChange(e, "apprenticeship")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Skills</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills.join(", ")}
              onChange={handleSkillsChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. JavaScript, React, Node.js"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Languages
            </h3>
            {formData.languages.map((lang, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 mb-4 rounded-md"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">
                    Language #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        languages: prev.languages.filter((_, i) => i !== index),
                      }))
                    }
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={lang.name}
                      onChange={(e) => {
                        const updated = [...formData.languages];
                        updated[index].name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          languages: updated,
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proficiency
                    </label>
                    <select
                      name="proficiency"
                      value={lang.proficiency}
                      onChange={(e) => {
                        const updated = [...formData.languages];
                        updated[index].proficiency = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          languages: updated,
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  languages: [...prev.languages, { name: "", proficiency: "" }],
                }))
              }
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-legpro-primary"
            >
              Add Language
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-legpro-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none font-medium"
            >
              Submit Application
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default ApplyJobForm;



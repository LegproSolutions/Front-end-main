import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { X, Plus, Building2, MapPin, IndianRupee, Clock, Users, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const backendUrl = import.meta.env?.VITE_API_URL;

const JobCreationForm = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [currentRequirement, setCurrentRequirement] = useState("");

  const [formData, setFormData] = useState({
    // Job details
    title: "",
    description: "",
    location: "",
    category: "",
    level: "",
    employmentType: "",
    experience: "",
    salary: "",
    openings: 1,
    deadline: "",
    requirements: [],
    
    // Company details (for new or existing company)
    companyId: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyCountry: "",
    companyWebsite: "",
    companyDescription: "",
    companyPassword: "DefaultPass123!", // Default password for auto-created companies
  });
  const [companyImageFile, setCompanyImageFile] = useState(null);

  // Fetch existing companies for dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/companies`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setCompanies(response.data.companies);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    if (name === "companyId" && value === "new_company") {
      // Handle new company creation
      setFormData(prev => ({
        ...prev,
        [name]: ""
      }));
      // You might want to show a new company form here or clear the field
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setRequirements(prev => [...prev, currentRequirement.trim()]);
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Minimal client-side validation to match backend schema
      const allowedEmploymentTypes = ["full-time", "part-time", "internship", "unpaid"]; // backend enum
      if (!allowedEmploymentTypes.includes(formData.employmentType)) {
        toast.error("Please select a valid Employment Type.");
        setLoading(false);
        return;
      }
      if (!formData.deadline) {
        toast.error("Application deadline is required.");
        setLoading(false);
        return;
      }
      if (!formData.companyCity || !formData.companyState || !formData.companyCountry) {
        toast.error("Company City, State and Country are required.");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      // Job details
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("location", formData.location);
      fd.append("category", formData.category);
      fd.append("level", formData.level);
      fd.append("employmentType", formData.employmentType);
      fd.append("experience", String(parseInt(formData.experience || 0)));
      fd.append("salary", String(parseInt(formData.salary || 0)));
      fd.append("openings", String(parseInt(formData.openings || 1)));
      if (formData.deadline) fd.append("deadline", formData.deadline);
      requirements.forEach((req) => fd.append("requirements", req));

      // Append location details for companyDetails (required by backend) in both flows
      if (formData.companyCity) fd.append("companyCity", formData.companyCity);
      if (formData.companyState) fd.append("companyState", formData.companyState);
      if (formData.companyCountry) fd.append("companyCountry", formData.companyCountry);

      if (formData.companyId) {
        fd.append("companyId", formData.companyId);
      } else {
        fd.append("companyName", formData.companyName);
        fd.append("companyEmail", formData.companyEmail);
        if (formData.companyPhone) fd.append("companyPhone", formData.companyPhone);
        if (formData.companyAddress) fd.append("companyAddress", formData.companyAddress);
        if (formData.companyWebsite) fd.append("companyWebsite", formData.companyWebsite);
        if (formData.companyDescription) fd.append("companyDescription", formData.companyDescription);
        if (formData.companyPassword) fd.append("companyPassword", formData.companyPassword);
        if (companyImageFile) fd.append("companyImage", companyImageFile);
      }

      const response = await axios.post(`${backendUrl}/api/admin/create-job`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Job created successfully!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          location: "",
          category: "",
          level: "",
          
          employmentType: "",
          experience: "",
          salary: "",
          openings: 1,
          deadline: "",
          companyId: "",
          companyName: "",
          companyEmail: "",
          companyPhone: "",
          companyAddress: "",
          companyCity: "",
          companyState: "",
          companyCountry: "",
          companyWebsite: "",
          companyDescription: "",
          companyPassword: "DefaultPass123!",
        });
        setRequirements([]);
        setCompanyImageFile(null);
      } else {
        toast.error(response.data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const isNewCompany = !formData.companyId;

  return (
    <div className=" mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <Plus className="h-6 w-6" />
            Create New Job Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Company Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="companyId">Select Existing Company (Optional)</Label>
                <Select 
                  value={formData.companyId} 
                  onValueChange={(value) => handleSelectChange("companyId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose existing company or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_company">Create New Company</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name} ({company.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* New Company Details */}
              {isNewCompany && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required={isNewCompany}
                      placeholder="Enter company name"
                    />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="companyImage">Company Logo</Label>
                  <Input
                    id="companyImage"
                    name="companyImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCompanyImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email *</Label>
                    <Input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      required={isNewCompany}
                      placeholder="company@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="https://company.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyCity">City</Label>
                    <Input
                      id="companyCity"
                      name="companyCity"
                      value={formData.companyCity}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyState">State</Label>
                    <Input
                      id="companyState"
                      name="companyState"
                      value={formData.companyState}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyCountry">Country *</Label>
                    <Input
                      id="companyCountry"
                      name="companyCountry"
                      value={formData.companyCountry}
                      onChange={handleInputChange}
                      placeholder="India"
                      required={isNewCompany}
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="companyAddress">Address</Label>
                    <Input
                      id="companyAddress"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      placeholder="Complete company address"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="companyDescription">Company Description</Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.companyDescription}
                      onChange={(value) => setFormData((p) => ({ ...p, companyDescription: value }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Company Location (for existing company selection as well) */}
            {!isNewCompany && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="companyCity">Company City *</Label>
                  <Input
                    id="companyCity"
                    name="companyCity"
                    value={formData.companyCity}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyState">Company State *</Label>
                  <Input
                    id="companyState"
                    name="companyState"
                    value={formData.companyState}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCountry">Company Country *</Label>
                  <Input
                    id="companyCountry"
                    name="companyCountry"
                    value={formData.companyCountry}
                    onChange={handleInputChange}
                    placeholder="India"
                    required
                  />
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Senior Software Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Experience Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Job Type removed as per request */}
                
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleSelectChange("employmentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years) *</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    placeholder="2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (₹ per month) *</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    min="0"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    placeholder="50000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openings">Number of Openings *</Label>
                  <Input
                    id="openings"
                    name="openings"
                    type="number"
                    min="1"
                    value={formData.openings}
                    onChange={handleInputChange}
                    required
                    placeholder="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => setFormData((p) => ({ ...p, description: value }))}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <Label>Job Requirements</Label>
              <div className="flex gap-2">
                <Input
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  placeholder="Add a requirement"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {req}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeRequirement(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="px-8 py-2 bg-legpro-primary hover:bg-legpro-primary-hover"
              >
                {loading ? "Creating Job..." : "Create Job Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCreationForm;


import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../../../utils/axiosConfig";
import { Plus, Trash2, HelpCircle, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env?.VITE_API_URL;

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

const EditJobModal = ({
  editModal,
  editForm,
  setEditForm,
  closeEdit,
  submitEdit,
}) => {
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("core");

  // Local states for custom screening questions input
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("yes_no");
  const [newQuestionOptions, setNewQuestionOptions] = useState("");
  const [newPreferredAnswer, setNewPreferredAnswer] = useState("");

  // fetch companies for selection
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const resp = await axios.get(`${backendUrl}/api/admin/companies`, {
          withCredentials: true,
        });
        if (resp.data.success) setCompanies(resp.data.companies || []);
      } catch (err) {
        console.error("Failed to load companies for edit modal", err);
      }
    };
    fetchCompanies();
  }, []);

  // Sync company location info on company change
  const onCompanyChange = (value) => {
    const selected = companies.find((c) => String(c._id) === String(value)) || null;
    setEditForm((f) => ({
      ...f,
      companyId: value,
      companyName: selected?.name || "",
      companyDesc: selected?.description || "",
      companyCity: selected?.city || "",
      companyState: selected?.state || "",
      companyCountry: selected?.country || "",
    }));
  };

  useEffect(() => {
    if (companies.length && editForm?.companyId) {
      const sel = companies.find((c) => String(c._id) === String(editForm.companyId));
      if (sel) {
        setEditForm((f) => ({
          ...f,
          companyName: sel.name || f.companyName || "",
          companyDesc: sel.description || f.companyDesc || "",
          companyCity: sel.city || f.companyCity || "",
          companyState: sel.state || f.companyState || "",
          companyCountry: sel.country || f.companyCountry || "",
        }));
      }
    }
  }, [companies, editForm?.companyId]);

  if (!editModal?.open) return null;

  // Education Helpers
  const addEducationBlock = () => {
    const currentBlocks = editForm.educationRequirements || [];
    setEditForm((prev) => ({
      ...prev,
      educationRequirements: [...currentBlocks, { qualification: "ITI", specializations: [] }]
    }));
  };

  const removeEducationBlock = (idx) => {
    const currentBlocks = [...(editForm.educationRequirements || [])];
    currentBlocks.splice(idx, 1);
    setEditForm((prev) => ({
      ...prev,
      educationRequirements: currentBlocks
    }));
  };

  const handleQualificationChange = (idx, val) => {
    const currentBlocks = [...(editForm.educationRequirements || [])];
    currentBlocks[idx] = { qualification: val, specializations: [] };
    setEditForm((prev) => ({
      ...prev,
      educationRequirements: currentBlocks,
      qualification: currentBlocks[0]?.qualification || ""
    }));
  };

  const handleSpecializationToggle = (blockIdx, spec) => {
    const currentBlocks = [...(editForm.educationRequirements || [])];
    const block = { ...currentBlocks[blockIdx] };
    const specs = [...(block.specializations || [])];
    const specIdx = specs.indexOf(spec);

    if (specIdx > -1) {
      specs.splice(specIdx, 1);
    } else {
      specs.push(spec);
    }

    block.specializations = specs;
    currentBlocks[blockIdx] = block;

    setEditForm((prev) => ({
      ...prev,
      educationRequirements: currentBlocks
    }));
  };

  // Checkbox Checklist Helpers
  const handleDocumentToggle = (doc) => {
    const docs = [...(editForm.requiredDocuments || [])];
    const idx = docs.indexOf(doc);
    if (idx > -1) {
      docs.splice(idx, 1);
    } else {
      docs.push(doc);
    }
    setEditForm((prev) => ({ ...prev, requiredDocuments: docs }));
  };

  const handleLanguageToggle = (lang) => {
    const langs = [...(editForm.languages || [])];
    const idx = langs.indexOf(lang);
    if (idx > -1) {
      langs.splice(idx, 1);
    } else {
      langs.push(lang);
    }
    setEditForm((prev) => ({ ...prev, languages: langs }));
  };

  // Benefits Toggler
  const handleBenefitToggle = (category, item) => {
    const currentBenefits = { ...(editForm.benefits || {}) };
    const items = [...(currentBenefits[category] || [])];
    const idx = items.indexOf(item);
    if (idx > -1) {
      items.splice(idx, 1);
    } else {
      items.push(item);
    }
    currentBenefits[category] = items;
    setEditForm((prev) => ({ ...prev, benefits: currentBenefits }));
  };

  // Screening Questions Helpers
  const addScreeningQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error("Question text is required");
      return;
    }
    const newQ = {
      id: Date.now().toString(),
      questionText: newQuestionText.trim(),
      answerType: newQuestionType,
      options: newQuestionType === "multiple_choice"
        ? newQuestionOptions.split(",").map(o => o.trim()).filter(Boolean)
        : [],
      preferredAnswer: newPreferredAnswer
    };
    setEditForm((prev) => ({
      ...prev,
      screeningQuestions: [...(prev.screeningQuestions || []), newQ]
    }));
    setNewQuestionText("");
    setNewQuestionOptions("");
    setNewPreferredAnswer("");
    toast.success("Question added successfully!");
  };

  const removeScreeningQuestion = (qId) => {
    const currentQ = [...(editForm.screeningQuestions || [])];
    const filteredQ = currentQ.filter(q => q.id !== qId);
    setEditForm((prev) => ({ ...prev, screeningQuestions: filteredQ }));
  };

  const handleSave = () => {
    const city = (editForm.companyCity || "").toString().trim();
    const state = (editForm.companyState || "").toString().trim();
    const country = (editForm.companyCountry || "").toString().trim();
    const newErrors = {};
    if (!city) newErrors.companyCity = "Company city is required";
    if (!state) newErrors.companyState = "Company state is required";
    if (!country) newErrors.companyCountry = "Company country is required";
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required company address details");
      setActiveTab("location");
      return;
    }
    submitEdit();
  };

  return (
    <div className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0F3B7A] px-6 py-4 text-white flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-200" />
              Edit Job Details (Admin Mode)
            </h3>
            <p className="text-blue-150 text-xs mt-0.5">
              Review and modify all ATS parameter segments and validation details.
            </p>
          </div>
          <Button variant="ghost" onClick={closeEdit} className="text-white hover:bg-white/10 hover:text-white font-bold">
            ✕
          </Button>
        </div>

        {/* Tab Headers */}
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 overflow-x-auto flex gap-2 flex-shrink-0">
          {[
            { id: "core", label: "Core Information" },
            { id: "edu", label: "Qualifications" },
            { id: "salary", label: "Compensation & Shift" },
            { id: "location", label: "Location & Liaison" },
            { id: "screening", label: "ATS Screening & Interview" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#0F3B7A] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">

          {/* TAB 1: CORE INFORMATION */}
          {activeTab === "core" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Machine Operator"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Existing Company *</Label>
                  <Select value={String(editForm.companyId || "")} onValueChange={onCompanyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={String(company._id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Description *</Label>
                <ReactQuill
                  theme="snow"
                  value={editForm.description || ""}
                  onChange={(val) => setEditForm(p => ({ ...p, description: val }))}
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input
                    value={editForm.category || ""}
                    onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Collar/Job Type</Label>
                  <Select value={editForm.jobType || "white"} onValueChange={(val) => setEditForm(f => ({ ...f, jobType: val }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White Collar</SelectItem>
                      <SelectItem value="blue">Blue Collar / Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select value={editForm.employmentType || "full-time"} onValueChange={(val) => setEditForm(f => ({ ...f, employmentType: val }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="unpaid">Unpaid Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Experience Criteria</Label>
                  <Select value={editForm.experienceOption || "Fresher"} onValueChange={(val) => setEditForm(f => ({ ...f, experienceOption: val }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fresher">Fresher Only</SelectItem>
                      <SelectItem value="Experienced">Experienced Only</SelectItem>
                      <SelectItem value="Both">Both (Fresher & Exp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editForm.experienceOption === "Experienced" && (
                  <>
                    <div className="space-y-2">
                      <Label>Min Experience (Years)</Label>
                      <Input
                        type="number"
                        value={editForm.minExperience || ""}
                        onChange={(e) => setEditForm(f => ({ ...f, minExperience: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Experience (Years)</Label>
                      <Input
                        type="number"
                        value={editForm.maxExperience || ""}
                        onChange={(e) => setEditForm(f => ({ ...f, maxExperience: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Min Age Eligibility</Label>
                  <Input
                    type="number"
                    value={editForm.minAge || ""}
                    onChange={(e) => setEditForm(f => ({ ...f, minAge: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Age Eligibility</Label>
                  <Input
                    type="number"
                    value={editForm.maxAge || ""}
                    onChange={(e) => setEditForm(f => ({ ...f, maxAge: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender Preference</Label>
                  <Select value={editForm.genderPreference || "Any"} onValueChange={(val) => setEditForm(f => ({ ...f, genderPreference: val }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any Gender</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Openings *</Label>
                  <Input
                    type="number"
                    value={editForm.vacancies || ""}
                    onChange={(e) => setEditForm(f => ({ ...f, vacancies: e.target.value, openings: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 cursor-pointer mt-8">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!editForm.immediateJoining}
                      onChange={(e) => setEditForm(f => ({ ...f, immediateJoining: e.target.checked }))}
                    />
                    Urgent / Immediate Joining?
                  </Label>
                </div>
                {editForm.immediateJoining && (
                  <div className="space-y-2">
                    <Label>Joining Timeline</Label>
                    <Select value={editForm.joiningWithin || "15 Days"} onValueChange={(val) => setEditForm(f => ({ ...f, joiningWithin: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate Joining</SelectItem>
                        <SelectItem value="7 Days">Within 7 Days</SelectItem>
                        <SelectItem value="15 Days">Within 15 Days</SelectItem>
                        <SelectItem value="30 Days">Within 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Application Deadline</Label>
                  <Input
                    type="date"
                    value={editForm.deadline || ""}
                    onChange={(e) => setEditForm(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 bg-slate-50 p-3 rounded-xl border">
                <input
                  id="adminVisible"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={!!editForm.visible}
                  onChange={(e) => setEditForm(f => ({ ...f, visible: e.target.checked }))}
                />
                <Label htmlFor="adminVisible" className="cursor-pointer font-bold text-slate-700">
                  Publish Job Post Directly (Makes Visible to Candidates)
                </Label>
              </div>
            </div>
          )}

          {/* TAB 2: QUALIFICATIONS */}
          {activeTab === "edu" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-slate-700">Qualification Options Block</h4>
                <Button type="button" size="sm" onClick={addEducationBlock} className="bg-[#0F3B7A]">
                  <Plus className="w-4 h-4 mr-1" /> Add Qualification Option
                </Button>
              </div>

              <div className="space-y-4">
                {(editForm.educationRequirements || []).map((block, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-blue-700">Block #{idx + 1} Criteria</span>
                      {editForm.educationRequirements.length > 1 && (
                        <button type="button" onClick={() => removeEducationBlock(idx)} className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-0.5">
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Education Type</Label>
                        <Select value={block.qualification || "ITI"} onValueChange={(val) => handleQualificationChange(idx, val)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <option value="10th">10th Pass</option>
                            <option value="12th">12th Pass</option>
                            <option value="ITI">ITI</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Graduation">Graduation</option>
                            <option value="Post Graduation">Post Graduation</option>
                            <option value="Others">Others</option>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label className="block mb-2">Trade / Specialization List</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-3 rounded-lg border max-h-36 overflow-y-auto">
                          {(qualificationSpecializations[block.qualification] || ["General"]).map((spec) => (
                            <label key={spec} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(block.specializations || []).includes(spec)}
                                onChange={() => handleSpecializationToggle(idx, spec)}
                                className="h-3.5 w-3.5 text-blue-600 rounded"
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
            </div>
          )}

          {/* TAB 3: SALARY, SHIFTS & BENEFITS */}
          {activeTab === "salary" && (
            <div className="space-y-6">
              
              {/* Shift Timing Details */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">Shift Configuration Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <Label>Shift Type</Label>
                    <Select
                      value={editForm.shiftDetails?.shiftType || "General Shift"}
                      onValueChange={(val) => setEditForm(f => ({
                        ...f,
                        shiftDetails: { ...(f.shiftDetails || {}), shiftType: val }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Shift">General Shift</SelectItem>
                        <SelectItem value="Day Shift">Day Shift</SelectItem>
                        <SelectItem value="Night Shift">Night Shift</SelectItem>
                        <SelectItem value="Rotational Shift">Rotational Shift</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Shift Timings</Label>
                    <Input
                      value={editForm.shiftDetails?.shiftTiming || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        shiftDetails: { ...(f.shiftDetails || {}), shiftTiming: e.target.value }
                      }))}
                      placeholder="e.g. 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <Label>Weekly Off Day</Label>
                    <Input
                      value={editForm.shiftDetails?.weeklyOff || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        shiftDetails: { ...(f.shiftDetails || {}), weeklyOff: e.target.value }
                      }))}
                      placeholder="e.g. Sunday"
                    />
                  </div>
                  <div>
                    <Label>Working Days</Label>
                    <Select
                      value={editForm.shiftDetails?.workingDays || "6"}
                      onValueChange={(val) => setEditForm(f => ({
                        ...f,
                        shiftDetails: { ...(f.shiftDetails || {}), workingDays: val }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Days</SelectItem>
                        <SelectItem value="6">6 Days</SelectItem>
                        <SelectItem value="6.5">6.5 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Detailed Salary Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">Compensation Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>In-Hand Salary (Monthly) *</Label>
                    <Input
                      type="number"
                      value={editForm.salaryBreakdown?.inHand || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), inHand: e.target.value }
                      }))}
                      placeholder="e.g. 18000"
                    />
                  </div>
                  <div>
                    <Label>Gross Salary (Monthly) *</Label>
                    <Input
                      type="number"
                      value={editForm.salaryBreakdown?.gross || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), gross: e.target.value }
                      }))}
                      placeholder="e.g. 21000"
                    />
                  </div>
                  <div>
                    <Label>Annual CTC *</Label>
                    <Input
                      type="number"
                      value={editForm.salaryBreakdown?.ctc || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), ctc: e.target.value },
                        salary: e.target.value
                      }))}
                      placeholder="e.g. 250000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Variable Pay / Performance Bonus</Label>
                    <Input
                      value={editForm.salaryBreakdown?.variablePay || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), variablePay: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Attendance Bonus</Label>
                    <Input
                      value={editForm.salaryBreakdown?.attendanceBonus || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), attendanceBonus: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Production Incentive</Label>
                    <Input
                      value={editForm.salaryBreakdown?.productionBonus || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), productionBonus: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <Label>Overtime Benefit Available?</Label>
                    <Select
                      value={editForm.salaryBreakdown?.otAvailable || "No"}
                      onValueChange={(val) => setEditForm(f => ({
                        ...f,
                        salaryBreakdown: { ...(f.salaryBreakdown || {}), otAvailable: val }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {editForm.salaryBreakdown?.otAvailable === "Yes" && (
                    <div>
                      <Label>OT Rate (₹/Hour)</Label>
                      <Input
                        type="number"
                        value={editForm.salaryBreakdown?.otRate || ""}
                        onChange={(e) => setEditForm(f => ({
                          ...f,
                          salaryBreakdown: { ...(f.salaryBreakdown || {}), otRate: e.target.value }
                        }))}
                        placeholder="e.g. 150"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits Checklist Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">Perks & Facilities Checklist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "food", label: "Food & Canteen", options: ["Free Canteen", "Subsidized Canteen", "Breakfast Facility", "Snacks Facility"] },
                    { key: "transportation", label: "Transportation", options: ["Company Bus", "Pick & Drop Facility", "Transportation Allowance"] },
                    { key: "uniform", label: "Uniform & Safety Essentials", options: ["Company Uniform", "Safety Shoes", "Safety Kit"] },
                    { key: "accommodation", label: "Accommodation Facilities", options: ["PG Facility", "Company Accommodation", "Company Support to Find Room (Paid by Candidate)"] },
                    { key: "healthcare", label: "Healthcare & Allowances", options: ["Medical Facility", "ESI", "Health Insurance", "Accident Insurance", "PF", "Gratuity", "Annual Bonus", "Festival Bonus"] }
                  ].map((cat) => (
                    <div key={cat.key} className="p-3 bg-white rounded-lg border space-y-2">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-wide">{cat.label}</span>
                      <div className="flex flex-col gap-1">
                        {cat.options.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(editForm.benefits?.[cat.key] || []).includes(opt)}
                              onChange={() => handleBenefitToggle(cat.key, opt)}
                              className="h-3.5 w-3.5 rounded text-blue-650"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOCATION & HR LIAISON */}
          {activeTab === "location" && (
            <div className="space-y-6">

              {/* Plant Workplace Address */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">Factory Workplace Location Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Factory / Plant Name</Label>
                    <Input
                      value={editForm.workLocationDetails?.plantName || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        workLocationDetails: { ...(f.workLocationDetails || {}), plantName: e.target.value }
                      }))}
                      placeholder="e.g. CNH Industrial Unit 1"
                    />
                  </div>
                  <div>
                    <Label>Unit / Division Name</Label>
                    <Input
                      value={editForm.workLocationDetails?.unitName || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        workLocationDetails: { ...(f.workLocationDetails || {}), unitName: e.target.value }
                      }))}
                      placeholder="e.g. Assembly Line"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Full Address *</Label>
                  <Textarea
                    value={editForm.workLocationDetails?.address || ""}
                    onChange={(e) => setEditForm(f => ({
                      ...f,
                      workLocationDetails: { ...(f.workLocationDetails || {}), address: e.target.value },
                      location: e.target.value.split(",").slice(-2).join(",").trim() || f.location
                    }))}
                    placeholder="Enter complete plant directions address..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={editForm.companyCity || ""}
                      onChange={(e) => setEditForm(f => ({ ...f, companyCity: e.target.value }))}
                      className={errors.companyCity ? "border-rose-500" : ""}
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input
                      value={editForm.companyState || ""}
                      onChange={(e) => setEditForm(f => ({ ...f, companyState: e.target.value }))}
                      className={errors.companyState ? "border-rose-500" : ""}
                    />
                  </div>
                  <div>
                    <Label>Country *</Label>
                    <Input
                      value={editForm.companyCountry || ""}
                      onChange={(e) => setEditForm(f => ({ ...f, companyCountry: e.target.value }))}
                      className={errors.companyCountry ? "border-rose-500" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Pin Code</Label>
                    <Input
                      value={editForm.workLocationDetails?.pinCode || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        workLocationDetails: { ...(f.workLocationDetails || {}), pinCode: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Map Latitude Coordinate</Label>
                    <Input
                      value={editForm.workLocationDetails?.latitude || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        workLocationDetails: { ...(f.workLocationDetails || {}), latitude: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Map Longitude Coordinate</Label>
                    <Input
                      value={editForm.workLocationDetails?.longitude || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        workLocationDetails: { ...(f.workLocationDetails || {}), longitude: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* HR Liaison contact card */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">HR Liaison Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Hiring Manager Name</Label>
                    <Input
                      value={editForm.hrContact?.name || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        hrContact: { ...(f.hrContact || {}), name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Mobile Number (For Candidates Calling)</Label>
                    <Input
                      value={editForm.hrContact?.mobile || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        hrContact: { ...(f.hrContact || {}), mobile: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>WhatsApp Contact Number</Label>
                    <Input
                      value={editForm.hrContact?.whatsapp || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        hrContact: { ...(f.hrContact || {}), whatsapp: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Alternate Phone Number</Label>
                    <Input
                      value={editForm.hrContact?.alternateMobile || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        hrContact: { ...(f.hrContact || {}), alternateMobile: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Official HR Email</Label>
                    <Input
                      value={editForm.hrContact?.email || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        hrContact: { ...(f.hrContact || {}), email: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ATS SCREENING & INTERVIEW */}
          {activeTab === "screening" && (
            <div className="space-y-6">

              {/* Interview Process details */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">Interview Process Config</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Interview Stage Type</Label>
                    <Select
                      value={editForm.interviewProcess?.type || "Walk-In Interview"}
                      onValueChange={(val) => setEditForm(f => ({
                        ...f,
                        interviewProcess: { ...(f.interviewProcess || {}), type: val }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Walk-In Interview">Walk-In Interview</SelectItem>
                        <SelectItem value="Telephonic Round">Telephonic Round</SelectItem>
                        <SelectItem value="Online Video Conference">Online Video Conference</SelectItem>
                        <SelectItem value="Written Assessment">Written Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Interview Meeting Link (For Online Rounds)</Label>
                    <Input
                      value={editForm.interviewProcess?.link || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        interviewProcess: { ...(f.interviewProcess || {}), link: e.target.value }
                      }))}
                      placeholder="https://zoom.us/j/1234..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Interview Date</Label>
                    <Input
                      value={editForm.interviewProcess?.date || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        interviewProcess: { ...(f.interviewProcess || {}), date: e.target.value }
                      }))}
                      placeholder="e.g. 10th June onwards"
                    />
                  </div>
                  <div>
                    <Label>Interview Reporting Time</Label>
                    <Input
                      value={editForm.interviewProcess?.time || ""}
                      onChange={(e) => setEditForm(f => ({
                        ...f,
                        interviewProcess: { ...(f.interviewProcess || {}), time: e.target.value }
                      }))}
                      placeholder="e.g. 10:00 AM - 2:00 PM"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Venue Location Address (For Physical Rounds)</Label>
                  <Textarea
                    value={editForm.interviewProcess?.address || ""}
                    onChange={(e) => setEditForm(f => ({
                      ...f,
                      interviewProcess: { ...(f.interviewProcess || {}), address: e.target.value }
                    }))}
                    placeholder="Enter walk-in venue address detail..."
                  />
                </div>
              </div>

              {/* Checklists for Documents and Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                <div className="space-y-2">
                  <Label className="font-extrabold text-xs text-slate-500 uppercase tracking-wide">Required Candidate Documents</Label>
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto bg-white p-3 rounded-lg border">
                    {documentOptions.map((doc) => (
                      <label key={doc} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(editForm.requiredDocuments || []).includes(doc)}
                          onChange={() => handleDocumentToggle(doc)}
                          className="h-3.5 w-3.5 rounded text-blue-600"
                        />
                        {doc}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-extrabold text-xs text-slate-500 uppercase tracking-wide">Spoken Languages Requirement</Label>
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto bg-white p-3 rounded-lg border">
                    {languageOptions.map((lang) => (
                      <label key={lang} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(editForm.languages || []).includes(lang)}
                          onChange={() => handleLanguageToggle(lang)}
                          className="h-3.5 w-3.5 rounded text-blue-600"
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic screening questions */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">ATS Custom Screening Questionnaire</h4>
                
                {/* Questions list */}
                {(editForm.screeningQuestions || []).length > 0 && (
                  <div className="space-y-3 bg-white p-3 rounded-lg border">
                    {editForm.screeningQuestions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="flex items-start justify-between p-3.5 rounded-xl border bg-slate-50/50 gap-4">
                        <div className="space-y-1 text-xs">
                          <p className="font-black text-slate-800">Q{qIdx + 1}: {q.questionText}</p>
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">
                            Type: {q.answerType} | Preferred Answer: {q.preferredAnswer || "None"}
                          </p>
                          {q.options?.length > 0 && (
                            <p className="text-slate-500 text-[10px]">Choices: {q.options.join(", ")}</p>
                          )}
                        </div>
                        <button type="button" onClick={() => removeScreeningQuestion(q.id)} className="text-rose-600 hover:text-rose-800 p-1 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add question form */}
                <div className="p-4 bg-white rounded-lg border space-y-4">
                  <span className="text-xs font-black text-blue-800 uppercase tracking-wider">Configure New Screening Question</span>
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="e.g. Do you have a valid LMV driving license?"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Question Answer Format</Label>
                      <Select value={newQuestionType} onValueChange={(val) => setNewQuestionType(val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes_no">Yes / No</SelectItem>
                          <SelectItem value="multiple_choice">Multiple Choice (Options)</SelectItem>
                          <SelectItem value="text">Free Text Input</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newQuestionType === "multiple_choice" && (
                      <div>
                        <Label>Choices (Comma-Separated)</Label>
                        <Input
                          value={newQuestionOptions}
                          onChange={(e) => setNewQuestionOptions(e.target.value)}
                          placeholder="Option A, Option B, Option C"
                        />
                      </div>
                    )}
                  </div>

                  {newQuestionType !== "text" && (
                    <div className="space-y-2">
                      <Label>Preferred / Correct Choice (For ATS shortlisting weight)</Label>
                      <Input
                        value={newPreferredAnswer}
                        onChange={(e) => setNewPreferredAnswer(e.target.value)}
                        placeholder={newQuestionType === "yes_no" ? "Yes or No" : "Enter correct option exactly"}
                      />
                    </div>
                  )}

                  <Button type="button" onClick={addScreeningQuestion} size="sm" className="bg-[#0F3B7A] mt-2">
                    Add Question to Form
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="mt-auto px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center flex-shrink-0">
          <Button variant="outline" onClick={closeEdit}>
            Cancel / Discard
          </Button>
          <Button onClick={handleSave} className="bg-[#0F3B7A] hover:bg-[#1C539D] font-bold text-white px-6">
            Apply & Save Job Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;

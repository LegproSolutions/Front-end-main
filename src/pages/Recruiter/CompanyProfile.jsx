import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Building2, Mail, Phone, Globe, MapPin, Upload, FileText, Loader2, Save, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import statesAndCities from "../../../states_districts_raw.json";
import { assets } from "../../assets/assets";

const CompanyProfile = () => {
  const { companyData, setCompanyData, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  // Logo upload state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // Populate form from context
  useEffect(() => {
    if (companyData) {
      setName(companyData.name || "");
      setEmail(companyData.email || "");
      setPhone(companyData.phone || "");
      setDescription(companyData.description || "");
      setWebsite(companyData.website || "");
      setIndustry(companyData.industry || "");
      setState(companyData.state || "");
      setCity(companyData.city || "");
      setCountry(companyData.country || "India");
      setLogoPreview(companyData.image || "");
    }
  }, [companyData]);

  // Handle Logo selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo size must be less than 5MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("description", description.trim());
      formData.append("website", website.trim());
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("industry", industry);

      if (logoFile) {
        formData.append("image", logoFile);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/company/update-company`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        setCompanyData(data.company);
        if (logoFile) {
          setLogoFile(null);
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const statesList = Object.keys(statesAndCities || {});
  const citiesList = state ? (statesAndCities[state] || []) : [];

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-200" />
                Company Profile Settings
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Keep your company details, logo, and contact info up-to-date.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Top Area: Logo & Core info */}
            <div className="flex flex-col md:flex-row gap-8 items-start pb-6 border-b border-gray-100">
              
              {/* Logo Upload Box */}
              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <label className="text-gray-700 font-bold text-sm">Company Logo</label>
                <div className="relative group w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:border-blue-500 transition-all cursor-pointer">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company logo preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = assets.company_icon;
                      }}
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-500">Max 5MB (JPG, PNG, WEBP)</span>
              </div>

              {/* Core Details (Name, Email) */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Acme Corporation"
                  />
                  {companyData?.pendingNameChange && (
                    <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded mt-1.5 block font-semibold">
                      Pending Admin approval: "{companyData.pendingNameChange}"
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 mt-1 block">Changing company name requires Admin approval.</span>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-gray-400" />
                    Company Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="company@example.com"
                  />
                  {companyData?.pendingEmailChange && (
                    <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded mt-1.5 block font-semibold">
                      Pending Admin approval: "{companyData.pendingEmailChange}"
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 mt-1 block">Changing email address requires Admin approval.</span>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-gray-400" />
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-gray-400" />
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. https://acme.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    Industry Type
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Industry</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Services">Services</option>
                    <option value="Retail">Retail</option>
                    <option value="IT">IT</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-gray-400" />
                Company Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="Briefly describe your company, industry, vision, and focus areas..."
              />
            </div>

            {/* Location Section */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-150 space-y-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Office Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold text-xs mb-2">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                    placeholder="e.g. India"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-xs mb-2">State</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity("");
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                  >
                    <option value="">Select State</option>
                    {statesList.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-xs mb-2">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
                    disabled={!state}
                  >
                    <option value="">Select City</option>
                    {citiesList.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

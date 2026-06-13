import {
  Building2,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
  Download,
  Key,
  Trash2,
  Loader2,
  UserPlus
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";

const backendUrl = import.meta.env?.VITE_API_URL || "http://localhost:5002";

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // CRM Credential Management State
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [crmStaff, setCrmStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [crmDialogOpen, setCrmDialogOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("manager");
  
  const companiesPerPage = 12;

  // Fetch all companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/admin/companies`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies based on search
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.city && company.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.state && company.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

  const handleViewJobs = (companyId) => {
    window.open(`/admin/recruiter-jobs/${companyId}`, '_blank');
  };

  const handleApproveChanges = async (companyId) => {
    try {
      const response = await axios.put(`${backendUrl}/api/admin/companies/${companyId}/approve-changes`, {}, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Profile updates approved successfully!");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error approving company changes:", error);
      toast.error("Failed to approve updates");
    }
  };

  const handleRejectChanges = async (companyId) => {
    try {
      const response = await axios.put(`${backendUrl}/api/admin/companies/${companyId}/reject-changes`, {}, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Profile updates rejected and cleared!");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error rejecting company changes:", error);
      toast.error("Failed to reject updates");
    }
  };

  const handleOpenCrmManage = async (companyId, companyName) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyName(companyName);
    setCrmDialogOpen(true);
    fetchCrmStaff(companyId);
  };

  const fetchCrmStaff = async (companyId) => {
    setStaffLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/crm/team?companyId=${companyId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCrmStaff(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching CRM staff:", error);
      toast.error("Failed to fetch CRM access records");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleAddCrmStaff = async (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail || !newStaffPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/crm/team?companyId=${selectedCompanyId}`, {
        name: newStaffName,
        email: newStaffEmail,
        password: newStaffPassword,
        role: newStaffRole,
        permissions: ["all"]
      }, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("CRM Credentials created successfully");
        setNewStaffName("");
        setNewStaffEmail("");
        setNewStaffPassword("");
        fetchCrmStaff(selectedCompanyId);
      }
    } catch (error) {
      console.error("Error creating CRM credentials:", error);
      toast.error(error.response?.data?.message || "Failed to create CRM credentials");
    }
  };

  const handleDeleteCrmStaff = async (staffId) => {
    if (!confirm("Are you sure you want to revoke CRM access for this user?")) return;
    try {
      const response = await axios.delete(`${backendUrl}/api/crm/team/${staffId}?companyId=${selectedCompanyId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("CRM Access revoked successfully");
        fetchCrmStaff(selectedCompanyId);
      }
    } catch (error) {
      console.error("Error revoking CRM access:", error);
      toast.error("Failed to revoke CRM access");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getCompanyInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const exportCompaniesCSV = () => {
    const rows = filteredCompanies.map((c) => ({
      Name: c.name || "",
      Email: c.email || "",
      Phone: c.phone || "",
      City: c.city || "",
      State: c.state || "",
      Website: c.website || "",
      Verified: c.isVerified ? "Yes" : "No",
      Premium: c.havePremiumAccess ? "Yes" : "No",
      Joined: formatDate(c.date || c.createdAt),
    }));
    exportToCSV({ data: rows, filename: "companies" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legpro-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Companies Management
          </CardTitle>
          <p className="text-gray-600">
            Manage all companies in the platform. Total: {companies.length} companies
          </p>
        </CardHeader>
        <CardContent>
          {/* Search + Export */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" onClick={exportCompaniesCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download CSV
              </Button>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCompanies.map((company) => (
              <Card key={company._id || company.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {/* Company Avatar */}
                    <div className="w-12 h-12 bg-legpro-primary text-white rounded-lg flex items-center justify-center font-semibold">
                      {company.image ? (
                        <img 
                          src={company.image} 
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        getCompanyInitials(company.name)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Badge variant={company.isVerified ? "default" : "secondary"}>
                          {company.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{company.email}</span>
                      </div>
                      
                      {company.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      
                      {(company.city || company.state) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {[company.city, company.state].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {company.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-legpro-primary hover:underline truncate"
                          >
                            {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {company.description && (
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-2">{company.description}</p>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(company.date || company.createdAt)}</span>
                      </div>
                      {company.havePremiumAccess && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">Premium</Badge>
                        </div>
                      )}
                    </div>

                    {/* Pending Changes */}
                    {(company.pendingNameChange || company.pendingEmailChange) && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-2 mt-2">
                        <span className="text-xs font-bold text-amber-800 block">Pending Profile Changes:</span>
                        {company.pendingNameChange && (
                          <div className="text-xs text-gray-700">
                            <span className="font-semibold">Name:</span> {company.pendingNameChange}
                          </div>
                        )}
                        {company.pendingEmailChange && (
                          <div className="text-xs text-gray-700">
                            <span className="font-semibold">Email:</span> {company.pendingEmailChange}
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <Button 
                            size="sm" 
                            className="h-7 text-[10px] bg-green-600 hover:bg-green-700 text-white font-semibold flex-1"
                            onClick={() => handleApproveChanges(company.id || company._id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-[10px] border-red-200 text-red-600 hover:bg-red-50 font-semibold flex-1"
                            onClick={() => handleRejectChanges(company.id || company._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleViewJobs(company._id || company.id)}
                      >
                        View Jobs
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                        onClick={() => handleOpenCrmManage(company._id || company.id, company.name)}
                      >
                        <Key className="h-3 w-3" /> CRM Access
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No companies found */}
          {filteredCompanies.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "No companies have been registered yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRM Credential Management Dialog */}
      <Dialog open={crmDialogOpen} onOpenChange={setCrmDialogOpen}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">
              Manage CRM Access — {selectedCompanyName}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 mt-1">
              Create and manage CRM login credentials for this employer. Users registered here will be able to access the Recruitment CRM inside the employer dashboard using their separate CRM credentials.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Create New credentials */}
            <div className="border-r border-gray-100 pr-0 md:pr-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-blue-600" /> Create CRM Account
              </h4>
              <form onSubmit={handleAddCrmStaff} className="space-y-3">
                <div>
                  <Label className="text-xs font-medium">Full Name *</Label>
                  <Input 
                    placeholder="E.g., Ritu Sharma" 
                    value={newStaffName} 
                    onChange={(e) => setNewStaffName(e.target.value)} 
                    className="h-9 text-xs mt-1" 
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">CRM Login ID (Email) *</Label>
                  <Input 
                    type="email" 
                    placeholder="ritu@company.com" 
                    value={newStaffEmail} 
                    onChange={(e) => setNewStaffEmail(e.target.value)} 
                    className="h-9 text-xs mt-1" 
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">CRM Password *</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter secure password" 
                    value={newStaffPassword} 
                    onChange={(e) => setNewStaffPassword(e.target.value)} 
                    className="h-9 text-xs mt-1" 
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">CRM Role</Label>
                  <Select value={newStaffRole} onValueChange={setNewStaffRole}>
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border">
                      <SelectItem value="manager" className="text-xs">Manager (Admin Access)</SelectItem>
                      <SelectItem value="hr" className="text-xs">HR Manager</SelectItem>
                      <SelectItem value="recruiter" className="text-xs">Recruiter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2"
                >
                  Create Credentials
                </Button>
              </form>
            </div>

            {/* List Active Credentials */}
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Active CRM Accounts</h4>
              {staffLoading ? (
                <div className="flex items-center justify-center py-12 flex-1">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                  <span className="text-xs text-gray-500">Loading access records...</span>
                </div>
              ) : crmStaff.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50 flex-1 flex flex-col justify-center items-center">
                  <Key className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500 font-medium">No CRM accounts active</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Use the form to create the first login credentials</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1 flex-1">
                  {crmStaff.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{staff.name}</span>
                          <Badge variant="outline" className="text-[9px] capitalize px-1 py-0 h-4">
                            {staff.role}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{staff.email}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-red-50 text-red-500" 
                        onClick={() => handleDeleteCrmStaff(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesManagement;

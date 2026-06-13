import { useState, useEffect } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/crm/components/ui/tabs";
import { Input } from "@/crm/components/ui/input";
import { Button } from "@/crm/components/ui/button";
import { Switch } from "@/crm/components/ui/switch";
import { Label } from "@/crm/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/crm/components/ui/dialog";
import { Badge } from "@/crm/components/ui/badge";
import { Settings as SettingsIcon, Users, Bell, UserPlus, Trash2, Shield, Loader2, Building2, Eye, EyeOff, KeyRound, Mail, Phone, LifeBuoy } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/crm/lib/api";
import { Checkbox } from "@/crm/components/ui/checkbox";
import { ScrollArea } from "@/crm/components/ui/scroll-area";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  access: string[];
  clientIds: string[];
  password?: string;
  plainPassword?: string;
  isActive: boolean;
}

const roleOptions = [
  { value: "super-admin", label: "Super Admin" },
  { value: "crm-admin", label: "CRM Admin" },
  { value: "manager", label: "Manager" },
  { value: "recruiter", label: "Recruiter" },
  { value: "hr-executive", label: "HR Executive" },
  { value: "team-lead", label: "Team Lead" },
  { value: "custom", label: "Custom Role" }
];

const roleLabels: Record<string, string> = {
  "super-admin": "Super Admin",
  "crm-admin": "CRM Admin",
  manager: "Manager",
  recruiter: "Recruiter",
  "hr-executive": "HR Executive",
  "team-lead": "Team Lead",
  custom: "Custom Role"
};

const crmPermissionsList = [
  { key: "client_view", label: "View Clients", category: "Client Management" },
  { key: "client_add", label: "Add Clients", category: "Client Management" },
  { key: "client_edit", label: "Edit Clients", category: "Client Management" },
  { key: "client_delete", label: "Delete Clients", category: "Client Management" },
  
  { key: "candidate_view", label: "View Candidates", category: "Candidate Management" },
  { key: "candidate_add", label: "Add Candidates", category: "Candidate Management" },
  { key: "candidate_edit", label: "Edit Candidates", category: "Candidate Management" },
  { key: "candidate_delete", label: "Delete Candidates", category: "Candidate Management" },
  
  { key: "job_view", label: "View Jobs", category: "Job Management" },
  { key: "job_add", label: "Add Jobs", category: "Job Management" },
  { key: "job_edit", label: "Edit Jobs", category: "Job Management" },
  { key: "job_delete", label: "Delete Jobs", category: "Job Management" },
  
  { key: "application_view", label: "View Applications", category: "Application Management" },
  { key: "application_status_update", label: "Update Status", category: "Application Management" },
  { key: "application_download", label: "Download Excel", category: "Application Management" },
  
  { key: "interview_schedule", label: "Schedule Interview", category: "Interview Management" },
  { key: "interview_status_update", label: "Update Interview Status", category: "Interview Management" },
  { key: "interview_view", label: "View Interview Data", category: "Interview Management" },
  
  { key: "reports_view", label: "View Reports", category: "Reports & Analytics" },
  { key: "reports_export", label: "Export Reports", category: "Reports & Analytics" },
  
  { key: "users_create", label: "Create Users", category: "User Management" },
  { key: "users_edit", label: "Edit Users", category: "User Management" },
  { key: "users_delete", label: "Delete Users", category: "User Management" },
  
  { key: "settings_view", label: "View Settings", category: "CRM Settings" },
  { key: "settings_manage", label: "Manage Settings", category: "CRM Settings" },
  
  { key: "dashboard_view", label: "Dashboard View", category: "Dashboard Access" },
  { key: "dashboard_analytics", label: "Dashboard Analytics", category: "Dashboard Access" }
];

const defaultPermissionsByRole: Record<string, string[]> = {
  "super-admin": crmPermissionsList.map(p => p.key),
  "crm-admin": crmPermissionsList.map(p => p.key).filter(k => k !== "settings_manage"),
  "manager": [
    "client_view", "client_add", "client_edit",
    "candidate_view", "candidate_add", "candidate_edit",
    "job_view", "job_add", "job_edit",
    "application_view", "application_status_update", "application_download",
    "interview_schedule", "interview_status_update", "interview_view",
    "reports_view", "reports_export",
    "dashboard_view", "dashboard_analytics"
  ],
  "recruiter": [
    "client_view",
    "candidate_view", "candidate_add", "candidate_edit",
    "job_view",
    "application_view", "application_status_update",
    "interview_schedule", "interview_status_update", "interview_view",
    "dashboard_view"
  ],
  "hr-executive": [
    "client_view",
    "candidate_view", "candidate_add", "candidate_edit",
    "job_view",
    "application_view", "application_status_update",
    "interview_schedule", "interview_status_update", "interview_view",
    "dashboard_view"
  ],
  "team-lead": [
    "client_view",
    "candidate_view", "candidate_add", "candidate_edit",
    "job_view", "job_add", "job_edit",
    "application_view", "application_status_update",
    "interview_schedule", "interview_status_update", "interview_view",
    "dashboard_view", "dashboard_analytics"
  ],
  "custom": []
};

const groupedPermissions = crmPermissionsList.reduce((acc, curr) => {
  if (!acc[curr.category]) {
    acc[curr.category] = [];
  }
  acc[curr.category].push(curr);
  return acc;
}, {} as Record<string, typeof crmPermissionsList>);


export default function SettingsPage() {
  const [company, setCompany] = useState(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem('jobmela_crm_user') || localStorage.getItem('admin_data') || '{}');
      return {
        name: user.name || "Jobmela Employer",
        website: user.website || "",
        email: user.email || "",
        phone: user.phone || "",
      };
    } catch {
      return {
        name: "Jobmela Employer",
        website: "",
        email: "",
        phone: "",
      };
    }
  });

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<{ id: string; company_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [editNewPassword, setEditNewPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showPasswordFor, setShowPasswordFor] = useState<string | null>(null);
  
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "recruiter",
    permissions: ["client_view", "candidate_view", "job_view", "application_view", "dashboard_view"],
    clientIds: [] as string[]
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/team");
      const data = res.data?.data || [];
      setMembers(data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone || "",
        role: m.role,
        access: Array.isArray(m.permissions) ? m.permissions : [],
        clientIds: Array.isArray(m.clientIds) ? m.clientIds : [],
        plainPassword: m.plainPassword,
        isActive: m.isActive !== false
      })));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchClients();
  }, []);

  const handleSaveCompany = () => {
    toast.success("Company information saved successfully!");
  };

  const handleRoleChangeForNewMember = (role: string) => {
    const defaultPerms = defaultPermissionsByRole[role] || [];
    setNewMember(prev => ({ ...prev, role, permissions: defaultPerms }));
  };

  const handleRoleChangeForEditMember = (role: string) => {
    if (!editMember) return;
    const defaultPerms = defaultPermissionsByRole[role] || [];
    setEditMember(prev => prev ? ({ ...prev, role, access: defaultPerms }) : null);
  };


  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email || !newMember.password) {
      toast.error("Name, email and password are required.");
      return;
    }
    try {
      const payload = {
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone || undefined,
        password: newMember.password,
        role: newMember.role,
        permissions: newMember.permissions,
        clientIds: newMember.clientIds
      };
      await api.post("/team", payload);
      toast.success(`${newMember.name} added to the team!`);
      setAddDialogOpen(false);
      setNewMember({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "recruiter",
        permissions: ["client_view", "candidate_view", "job_view", "application_view", "dashboard_view"],
        clientIds: []
      });
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add team member");
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      await api.delete(`/team/${id}`);
      toast.success("Team member removed.");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove team member");
    }
  };

  const handleUpdateMember = async () => {
    if (!editMember) return;
    try {
      const payload: any = {
        name: editMember.name,
        phone: editMember.phone || undefined,
        role: editMember.role,
        permissions: editMember.access,
        clientIds: editMember.clientIds,
        isActive: editMember.isActive
      };
      if (editNewPassword.trim()) {
        payload.newPassword = editNewPassword.trim();
      }
      const res = await api.put(`/team/${editMember.id}`, payload);
      // If admin changed password, update it in local state so it shows immediately
      if (res.data?.staff?.plainPassword) {
        setMembers(prev => prev.map(m =>
          m.id === editMember.id ? { ...m, plainPassword: res.data.staff.plainPassword } : m
        ));
      }
      toast.success(`Updated ${editMember.name}'s details`);
      setEditMember(null);
      setEditNewPassword("");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update team member");
    }
  };

  const handleUpdateAccess = (module: string) => {
    if (!editMember) return;
    const newAccess = editMember.access.includes(module)
      ? editMember.access.filter(a => a !== module)
      : [...editMember.access, module];
    setEditMember({ ...editMember, access: newAccess });
  };

  return (
    <AppLayout title="Settings" subtitle="Manage your workspace">
      <div className="animate-fade-in max-w-4xl">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-card border">
            <TabsTrigger value="general" className="text-xs gap-1.5">
              <SettingsIcon className="h-3.5 w-3.5" /> General
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs gap-1.5">
              <Users className="h-3.5 w-3.5" /> Team & Access
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Company Name</Label>
                    <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Website</Label>
                    <Input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className="h-8 text-xs mt-1" disabled />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className="h-8 text-xs mt-1" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="text-xs" onClick={handleSaveCompany}>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-4 space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Team Members</h3>
                <Button size="sm" className="text-xs gap-1.5" onClick={() => setAddDialogOpen(true)}>
                  <UserPlus className="h-3.5 w-3.5" /> Add User
                </Button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs ml-2">Loading team members...</span>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No team members added yet. Add HR managers or recruiters to your company.
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{m.name}</p>
                            <Badge variant="secondary" className="text-[10px] capitalize">
                              {roleLabels[m.role] || m.role}
                            </Badge>
                            <Badge variant={m.isActive ? "default" : "secondary"} className={`text-[9px] h-4 px-1.5 ${m.isActive ? "bg-green-500 hover:bg-green-600 text-white" : "bg-slate-200 text-slate-500 hover:bg-slate-200"}`}>
                              {m.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                            <span>{m.email} {m.phone ? `• ${m.phone}` : ""}</span>
                            {m.plainPassword && (
                              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                <KeyRound className="h-2.5 w-2.5 flex-shrink-0" />
                                {showPasswordFor === m.id ? (
                                  <>
                                    <span className="select-all">{m.plainPassword}</span>
                                    <button onClick={() => setShowPasswordFor(null)} className="ml-0.5 text-amber-600 hover:text-amber-900">
                                      <EyeOff className="h-2.5 w-2.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span>{'•'.repeat(Math.min(m.plainPassword.length, 10))}</span>
                                    <button onClick={() => setShowPasswordFor(m.id)} className="ml-0.5 text-amber-600 hover:text-amber-900">
                                      <Eye className="h-2.5 w-2.5" />
                                    </button>
                                  </>
                                )}
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.access.length === 0 ? (
                              <Badge variant="outline" className="text-[9px]">No access</Badge>
                            ) : (
                              m.access.map(a => (
                                <Badge key={a} variant="outline" className="text-[9px] capitalize">{a.replace("-", " ")}</Badge>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditMember(m)}>
                          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleRemoveMember(m.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-semibold mb-2">Notification Preferences</h3>
              {[
                { label: "New candidate applications", desc: "Get notified when new candidates apply" },
                { label: "Interview reminders", desc: "Reminders before scheduled interviews" },
                { label: "Status changes", desc: "When candidate status is updated" },
                { label: "Daily digest", desc: "Summary of daily recruitment activity" },
                { label: "Pipeline alerts", desc: "When candidates move between pipeline stages" },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Technical Support Dialog */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="max-w-md p-6 md:p-8 rounded-2xl bg-white border border-slate-200">
          <DialogHeader className="flex flex-col items-center border-b pb-4 mb-4">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-blue-700" /> Technical Support
            </DialogTitle>
            <DialogDescription className="text-sm text-center text-slate-600">
              Reach out for any CRM assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-slate-700" />
              <span className="text-sm">prashant@legpro.co.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-700" />
              <span className="text-sm">+91-7303086551</span>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 mt-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => setSupportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-4xl p-6 md:p-8 rounded-2xl bg-white border border-slate-200">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
            <DialogTitle className="text-base font-bold text-slate-850 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-700" />
              Create CRM Account
            </DialogTitle>
            <DialogDescription className="sr-only">
              Create a recruiter, hr, or manager account for your company.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Left Column: ACCOUNT DETAILS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
                Account Details
              </h3>
              
              <div>
                <Label className="text-xs font-bold text-slate-700">Full Name *</Label>
                <Input 
                  className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500" 
                  placeholder="Full Name"
                  value={newMember.name} 
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} 
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Email Address *</Label>
                <Input 
                  className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500" 
                  placeholder="email@jobmela.com"
                  type="email" 
                  value={newMember.email} 
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} 
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Password *</Label>
                <div className="relative">
                  <Input
                    className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500 pr-10"
                    placeholder="Password"
                    type={showAddPassword ? "text" : "password"}
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    onClick={() => setShowAddPassword(prev => !prev)}
                  >
                    {showAddPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Access Role</Label>
                <Select value={newMember.role} onValueChange={(v) => handleRoleChangeForNewMember(v)}>
                  <SelectTrigger className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(r => (
                      <SelectItem key={r.value} value={r.value} className="text-xs">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Building2 className="h-4 w-4 text-blue-700" />
                  Assign Clients (Access Control)
                </Label>
                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 max-h-[160px] overflow-y-auto space-y-2.5">
                  {clients.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No clients found. Please add clients first.</p>
                  ) : (
                    clients.map(c => {
                      const isChecked = newMember.clientIds.includes(c.id);
                      return (
                        <div key={c.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`new-client-${c.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newClientIds = checked
                                ? [...newMember.clientIds, c.id]
                                : newMember.clientIds.filter(id => id !== c.id);
                              setNewMember({ ...newMember, clientIds: newClientIds });
                            }}
                            className="h-4 w-4 rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`new-client-${c.id}`} className="text-xs font-bold text-slate-700 cursor-pointer select-none truncate">
                            {c.company_name}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-2">
                  * Recruiters, managers, and standard users will strictly see candidate records, jobs, and pipeline dashboards associated with these checked client accounts.
                </p>
              </div>
            </div>

            {/* Right Column: GRANULAR RBAC PERMISSIONS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-805 uppercase tracking-wider mb-3">
                Granular RBAC Permissions
              </h3>
              
              <div className="space-y-4 pr-1">
                {Object.entries(groupedPermissions).map(([category, perms]) => {
                  const displayCategory = category === "Application Management" ? "Application / Pipeline" : category;
                  return (
                    <div key={category} className="border border-slate-100 rounded-xl p-4 bg-slate-50/20">
                      <h4 className="text-[11px] font-black text-slate-800 mb-3 tracking-wider">{displayCategory}</h4>
                      <div className="grid grid-cols-2 gap-3 pl-1">
                        {perms.map(p => {
                          const isChecked = newMember.permissions.includes(p.key);
                          return (
                            <div key={p.key} className="flex items-center space-x-2">
                              <Checkbox
                                id={`new-perm-${p.key}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const newPerms = checked
                                    ? [...newMember.permissions, p.key]
                                    : newMember.permissions.filter(k => k !== p.key);
                                  setNewMember({ ...newMember, permissions: newPerms });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`new-perm-${p.key}`} className="text-xs font-semibold text-slate-600 cursor-pointer leading-tight select-none">
                                {p.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 mt-4 flex items-center justify-end gap-2.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs font-bold px-4 py-2 h-9 rounded-lg border-slate-200" 
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="text-xs font-bold px-5 py-2 h-9 rounded-lg bg-[#063951] hover:bg-[#002b40] text-white transition-colors" 
              onClick={handleAddMember}
            >
              Deploy CRM Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Access Dialog */}
      <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
        <DialogContent className="max-w-4xl p-6 md:p-8 rounded-2xl bg-white border border-slate-200">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
            <DialogTitle className="text-base font-bold text-slate-850 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-700" />
              Manage CRM Account — {editMember?.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Modify role and module permissions for this team member.
            </DialogDescription>
          </DialogHeader>
          
          {editMember && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Left Column: ACCOUNT DETAILS */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
                  Account Details
                </h3>
                
                <div>
                  <Label className="text-xs font-bold text-slate-700">Full Name *</Label>
                  <Input 
                    className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500" 
                    value={editMember.name} 
                    onChange={(e) => setEditMember({ ...editMember, name: e.target.value })} 
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Phone</Label>
                  <Input 
                    className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500" 
                    value={editMember.phone} 
                    onChange={(e) => setEditMember({ ...editMember, phone: e.target.value })} 
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Role</Label>
                  <Select
                    value={editMember.role}
                    onValueChange={(v) => handleRoleChangeForEditMember(v)}
                  >
                    <SelectTrigger className="h-10 text-xs mt-1.5 rounded-lg border-slate-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(r => (
                        <SelectItem key={r.value} value={r.value} className="text-xs">
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border-t pt-3 mt-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-700">Account Status</Label>
                    <p className="text-[9px] text-slate-400 font-semibold leading-tight">Deactivating this user will block their login access immediately.</p>
                  </div>
                  <Switch 
                    checked={editMember.isActive} 
                    onCheckedChange={(checked) => setEditMember({ ...editMember, isActive: checked })} 
                  />
                </div>

                {/* Change Password */}
                <div className="pt-2">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                    <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                    Change Password
                  </Label>
                  <div className="relative">
                    <Input
                      className="h-10 text-xs rounded-lg border-amber-200 focus:ring-amber-400 pr-10 bg-amber-50/30"
                      placeholder="Enter new password (leave blank to keep current)"
                      type={showEditPassword ? "text" : "password"}
                      value={editNewPassword}
                      onChange={(e) => setEditNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      onClick={() => setShowEditPassword(prev => !prev)}
                    >
                      {showEditPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {editMember.plainPassword && (
                    <p className="text-[10px] text-amber-700 mt-1 font-mono flex items-center gap-1">
                      <KeyRound className="h-2.5 w-2.5" /> Current stored password: <span className="font-bold select-all">{editMember.plainPassword}</span>
                    </p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                    <Building2 className="h-4 w-4 text-blue-700" />
                    Assign Clients (Access Control)
                  </Label>
                  <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 max-h-[160px] overflow-y-auto space-y-2.5">
                    {clients.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No clients found. Please add clients first.</p>
                    ) : (
                      clients.map(c => {
                        const isChecked = editMember.clientIds.includes(c.id);
                        return (
                          <div key={c.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`edit-client-${c.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newClientIds = checked
                                  ? [...editMember.clientIds, c.id]
                                  : editMember.clientIds.filter(id => id !== c.id);
                                setEditMember({ ...editMember, clientIds: newClientIds });
                              }}
                              className="h-4 w-4 rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`edit-client-${c.id}`} className="text-xs font-bold text-slate-700 cursor-pointer select-none truncate">
                              {c.company_name}
                            </label>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-2">
                    * Recruiters, managers, and standard users will strictly see candidate records, jobs, and pipeline dashboards associated with these checked client accounts.
                  </p>
                </div>
              </div>

              {/* Right Column: GRANULAR RBAC PERMISSIONS */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-805 uppercase tracking-wider mb-3">
                  Granular RBAC Permissions
                </h3>
                
                <div className="space-y-4 pr-1">
                  {Object.entries(groupedPermissions).map(([category, perms]) => {
                    const displayCategory = category === "Application Management" ? "Application / Pipeline" : category;
                    return (
                      <div key={category} className="border border-slate-100 rounded-xl p-4 bg-slate-50/20">
                        <h4 className="text-[11px] font-black text-slate-800 mb-3 tracking-wider">{displayCategory}</h4>
                        <div className="grid grid-cols-2 gap-3 pl-1">
                          {perms.map(p => {
                            const isChecked = editMember.access.includes(p.key);
                            return (
                              <div key={p.key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit-perm-${p.key}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const newPerms = checked
                                      ? [...editMember.access, p.key]
                                      : editMember.access.filter(k => k !== p.key);
                                    setEditMember({ ...editMember, access: newPerms });
                                  }}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`edit-perm-${p.key}`} className="text-xs font-semibold text-slate-600 cursor-pointer leading-tight select-none">
                                  {p.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="border-t pt-4 mt-4 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" className="text-xs font-bold px-4 py-2 h-9 rounded-lg border-slate-200" onClick={() => { setEditMember(null); setEditNewPassword(""); }}>Cancel</Button>
            <Button size="sm" className="text-xs font-bold px-5 py-2 h-9 rounded-lg bg-[#063951] hover:bg-[#002b40] text-white transition-colors" onClick={handleUpdateMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Support Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setSupportOpen(true)}
          aria-label="Technical Support"
        >
          <LifeBuoy className="h-6 w-6" />
        </Button>
      </div>
    </AppLayout>
  );
}

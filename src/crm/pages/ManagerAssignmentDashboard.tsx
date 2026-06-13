import React, { useState } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Badge } from "@/crm/components/ui/badge";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { StatCard } from "@/crm/components/StatCard";
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  RefreshCcw,
  ClipboardList,
  Filter,
  CheckCircle2,
  AlertCircle,
  Upload,
  UserCheck,
  PhoneCall,
  History,
  Trophy,
  Calendar,
  Layers,
  FileSpreadsheet,
  Search
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

// === Exact disposition values from CallingPortal.tsx ===
// Level 1 (Disposition Category / "Call Disp." filter)
const CALL_DISPOSITIONS = [
  "Interested",
  "Not Interested",
  "Connected",
  "Not Connected",
  "Wrong Number"
];

// Level 2 (App Status filter) - full list from CallingPortal.tsx
const APP_STATUSES = [
  "Shortlisted",
  "Interview Scheduled",
  "Interview Completed",
  "Selected",
  "Offered",
  "Joined",
  "Hold",
  "Future Opportunity",
  "Follow-up Required",
  "Need Some Time",
  "Discuss With Family",
  "Not Eligible",
  "Call Back Later",
  "Switched Off",
  "Call Not Received",
  "No Incomming",
  "Busy on Other Call",
  "Invalid Number",
  "Out of Coverage Area",
  "Low Salary",
  "Location Not Suitable",
  "Not Looking for Job",
  "Higher Education",
  "Shift Timing Issue",
  "Job Role Not Suitable",
  "Already Placed",
  "Personal Reasons",
  "Rejected"
];

export default function ManagerAssignmentDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"assign" | "performance" | "leaderboard" | "history" | "reports" | "excel">("assign");
  
  // States for Assign Tab
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [targetRecruiters, setTargetRecruiters] = useState<string[]>([]);
  const [assignClient, setAssignClient] = useState<string>("");
  const [assignJob, setAssignJob] = useState<string>("");
  const [selectionMode, setSelectionMode] = useState<"manual" | "job" | "client">("manual");
  const [sourceJobId, setSourceJobId] = useState("");
  const [sourceClientId, setSourceClientId] = useState("");

  // States for Performance Tab
  const [perfRecruiter, setPerfRecruiter] = useState<string>("");

  // States for Leaderboard Tab
  const [leaderboardFilter, setLeaderboardFilter] = useState<"daily" | "weekly" | "monthly">("daily");

  // States for Reports Tab
  const [repRecruiter, setRepRecruiter] = useState<string>("");
  const [repClient, setRepClient] = useState<string>("");
  const [repJob, setRepJob] = useState<string>("");
  const [repStartDate, setRepStartDate] = useState<string>("");
  const [repEndDate, setRepEndDate] = useState<string>("");
  const [repDisp, setRepDisp] = useState<string>("");
  const [repStatus, setRepStatus] = useState<string>("");

  // States for Audit Trail filters
  const [historySearch, setHistorySearch] = useState("");
  const [historyRecruiterFilter, setHistoryRecruiterFilter] = useState("");
  const [historyClientFilter, setHistoryClientFilter] = useState("");
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");

  // States for Excel Upload
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelRecruiter, setExcelRecruiter] = useState<string>("");
  const [excelClient, setExcelClient] = useState<string>("");
  const [excelJob, setExcelJob] = useState<string>("");

  // ═══════ QUERIES ═══════

  const { data: candidatesRaw, isLoading: isCandidatesLoading } = useQuery({
    queryKey: ["assignCandidatesList", selectionMode, sourceJobId, sourceClientId],
    queryFn: async () => {
      const params: any = {};
      if (selectionMode === "job" && sourceJobId) params.jobId = sourceJobId;
      else if (selectionMode === "client" && sourceClientId) params.client_id = sourceClientId;
      const res = await api.get("/candidates", { params });
      return res.data;
    },
  });

  const { data: recruitersRaw } = useQuery({
    queryKey: ["teamMembersList"],
    queryFn: async () => (await api.get("/team")).data,
  });

  const { data: clientsRaw } = useQuery({
    queryKey: ["clientsList"],
    queryFn: async () => (await api.get("/clients")).data,
  });

  const { data: jobsRaw } = useQuery({
    queryKey: ["jobsList"],
    queryFn: async () => (await api.get("/jobs")).data,
  });

  const { data: assignmentHistoryRaw } = useQuery({
    queryKey: ["assignmentHistory"],
    queryFn: async () => (await api.get("/assignment/history")).data,
  });

  const { data: recruiterPerformanceRaw, refetch: refetchPerf } = useQuery({
    queryKey: ["recruiterPerf", perfRecruiter],
    queryFn: async () => (await api.get(`/performance/dashboard${perfRecruiter ? `?recruiterId=${perfRecruiter}` : ""}`)).data,
    enabled: true, // Always load – empty means "all/current user"
  });

  const { data: leaderboardRaw } = useQuery({
    queryKey: ["leaderboard", leaderboardFilter],
    queryFn: async () => (await api.get(`/performance/leaderboard?filter=${leaderboardFilter}`)).data,
  });

  const { data: reportsRaw, refetch: refetchReports } = useQuery({
    queryKey: ["reportsDashboard", repRecruiter, repClient, repJob, repStartDate, repEndDate, repDisp, repStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (repRecruiter) params.append("recruiterId", repRecruiter);
      if (repClient)    params.append("clientId", repClient);
      if (repJob)       params.append("jobId", repJob);
      if (repStartDate) params.append("startDate", repStartDate);
      if (repEndDate)   params.append("endDate", repEndDate);
      if (repDisp)      params.append("disposition", repDisp);
      if (repStatus)    params.append("appStatus", repStatus);
      return (await api.get(`/reports/dashboard?${params.toString()}`)).data;
    },
  });

  // ═══════ MUTATIONS ═══════

  const assignMutation = useMutation({
    mutationFn: async (data: { candidateIds: string[]; recruiterIds: string[]; clientId?: string; jobId?: string }) =>
      (await api.post("/assignment/assign", data)).data,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        setSelectedCandidates([]);
        setTargetRecruiters([]);
        queryClient.invalidateQueries({ queryKey: ["assignCandidatesList"] });
        queryClient.invalidateQueries({ queryKey: ["assignmentHistory"] });
        queryClient.invalidateQueries({ queryKey: ["reportsDashboard"] });
      } else {
        toast.error(res.message || "Failed to assign candidates");
      }
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Error assigning candidates")
  });

  const excelUploadMutation = useMutation({
    mutationFn: async (payload: { file: File; recruiterId?: string; clientId?: string; jobId?: string }) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target?.result as string;
            const lines = text.split("\n");
            const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
            const list = [];
            for (let i = 1; i < lines.length; i++) {
              if (!lines[i].trim()) continue;
              const values = lines[i].split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
              const obj: any = {};
              headers.forEach((header, index) => { obj[header] = values[index]; });
              list.push(obj);
            }
            const res = await api.post(`/candidates/bulk-json?recruiterId=${payload.recruiterId || ""}&clientId=${payload.clientId || ""}&jobId=${payload.jobId || ""}`, list);
            resolve(res.data);
          } catch (err) { reject(err); }
        };
        reader.readAsText(payload.file);
      }),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(`Successfully uploaded and assigned ${res.count} candidates! (Skipped ${res.skipped})`);
        setExcelFile(null);
        queryClient.invalidateQueries({ queryKey: ["assignCandidatesList"] });
        queryClient.invalidateQueries({ queryKey: ["assignmentHistory"] });
      } else toast.error("Upload failed");
    },
    onError: (err: any) => toast.error(err.message || "Error uploading excel file")
  });

  const handleAssign = () => {
    if (selectedCandidates.length === 0) { toast.error("Please select at least one candidate"); return; }
    if (targetRecruiters.length === 0) { toast.error("Please select at least one recruiter"); return; }
    assignMutation.mutate({ candidateIds: selectedCandidates, recruiterIds: targetRecruiters, clientId: assignClient || undefined, jobId: assignJob || undefined });
  };

  const handleExcelUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) { toast.error("Please select a file first"); return; }
    excelUploadMutation.mutate({ file: excelFile, recruiterId: excelRecruiter || undefined, clientId: excelClient || undefined, jobId: excelJob || undefined });
  };

  // ═══════ SAFE DATA EXTRACTION (unwrap { success, data } responses) ═══════
  const recruiters: any[]    = recruitersRaw?.data || [];
  const clients: any[]       = clientsRaw?.data || [];
  const jobs: any[]          = jobsRaw?.data || [];
  const candidates: any[]    = candidatesRaw?.data || [];
  const allHistoryRecords: any[] = assignmentHistoryRaw?.data || [];
  const leaderboard: any[]   = leaderboardRaw?.data || [];
  const reportsData = reportsRaw?.data || { metrics: {}, clientWise: [], jobWise: [], recruiterWise: [] };
  const perfData = recruiterPerformanceRaw?.data || null;

  // ═══════ AUDIT TRAIL LOCAL FILTERS ═══════
  const filteredHistory = allHistoryRecords.filter((h: any) => {
    if (historySearch && !h.candidateName?.toLowerCase().includes(historySearch.toLowerCase()) && !h.recruiterName?.toLowerCase().includes(historySearch.toLowerCase())) return false;
    if (historyRecruiterFilter && h.assignedTo !== historyRecruiterFilter) return false;
    if (historyClientFilter && h.clientId !== historyClientFilter) return false;
    if (historyDateFrom && new Date(h.assignmentDate) < new Date(historyDateFrom)) return false;
    if (historyDateTo   && new Date(h.assignmentDate) > new Date(historyDateTo + "T23:59:59")) return false;
    return true;
  });

  return (
    <AppLayout
      title="Recruiter Management Dashboard"
      subtitle="Assign candidates, monitor recruiter performance, check leaderboards, and audit trails."
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { queryClient.invalidateQueries(); toast.success("Dashboard data refreshed"); }} className="text-[10px] h-8 gap-2 uppercase tracking-widest font-bold">
            <RefreshCcw className="h-3 w-3" /> Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-muted pb-4">
          <Button variant={activeTab === "assign"      ? "default" : "outline"} onClick={() => setActiveTab("assign")}      className="text-xs font-bold gap-2"><Layers       className="h-3.5 w-3.5" /> Candidate Assignment</Button>
          <Button variant={activeTab === "performance" ? "default" : "outline"} onClick={() => setActiveTab("performance")} className="text-xs font-bold gap-2"><TrendingUp   className="h-3.5 w-3.5" /> Recruiter Performance</Button>
          <Button variant={activeTab === "leaderboard" ? "default" : "outline"} onClick={() => setActiveTab("leaderboard")} className="text-xs font-bold gap-2"><Trophy       className="h-3.5 w-3.5" /> Leaderboard</Button>
          <Button variant={activeTab === "reports"     ? "default" : "outline"} onClick={() => setActiveTab("reports")}     className="text-xs font-bold gap-2"><ClipboardList className="h-3.5 w-3.5" /> Manager Reports</Button>
          <Button variant={activeTab === "history"     ? "default" : "outline"} onClick={() => setActiveTab("history")}     className="text-xs font-bold gap-2"><History      className="h-3.5 w-3.5" /> Audit Trail</Button>
          <Button variant={activeTab === "excel"       ? "default" : "outline"} onClick={() => setActiveTab("excel")}       className="text-xs font-bold gap-2"><FileSpreadsheet className="h-3.5 w-3.5" /> Excel Auto-Assign</Button>
        </div>

        {/* ─── Tab 1: Assignment Management ─── */}
        {activeTab === "assign" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Select Candidates Pool</h3>
                  <div className="flex bg-muted/40 p-1 rounded-xl">
                    {(["manual","job","client"] as const).map(mode => (
                      <Button key={mode} variant={selectionMode === mode ? "default" : "ghost"} size="sm"
                        onClick={() => { setSelectionMode(mode); setSelectedCandidates([]); }}
                        className="text-[10px] h-8 font-black uppercase capitalize">{mode === "manual" ? "Manually" : mode === "job" ? "Job Wise" : "Client Wise"}</Button>
                    ))}
                  </div>
                </div>

                {selectionMode === "job" && (
                  <div className="bg-primary/5 p-4 rounded-xl space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground block">Select Job for Sourcing:</label>
                    <select value={sourceJobId} onChange={(e) => { setSourceJobId(e.target.value); setSelectedCandidates([]); }} className="w-full text-xs p-2.5 bg-white border border-muted/50 rounded-xl">
                      <option value="">-- Choose Job --</option>
                      {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title} ({j.client?.company_name || "Client"})</option>)}
                    </select>
                  </div>
                )}
                {selectionMode === "client" && (
                  <div className="bg-primary/5 p-4 rounded-xl space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground block">Select Client for Sourcing:</label>
                    <select value={sourceClientId} onChange={(e) => { setSourceClientId(e.target.value); setSelectedCandidates([]); }} className="w-full text-xs p-2.5 bg-white border border-muted/50 rounded-xl">
                      <option value="">-- Choose Client --</option>
                      {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                    </select>
                  </div>
                )}

                <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-muted text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                        <th className="py-2.5 px-2">
                          <input type="checkbox" checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                            onChange={(e) => setSelectedCandidates(e.target.checked ? candidates.map((c: any) => c.id) : [])} />
                        </th>
                        <th className="py-2.5 px-2">Name</th>
                        <th className="py-2.5 px-2">Phone</th>
                        <th className="py-2.5 px-2">Status</th>
                        <th className="py-2.5 px-2">Recruiter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((c: any) => (
                        <tr key={c.id} className="border-b border-muted/30 text-xs hover:bg-muted/5">
                          <td className="py-2 px-2">
                            <input type="checkbox" checked={selectedCandidates.includes(c.id)}
                              onChange={(e) => setSelectedCandidates(e.target.checked ? [...selectedCandidates, c.id] : selectedCandidates.filter(id => id !== c.id))} />
                          </td>
                          <td className="py-2 px-2 font-bold">{c.name}</td>
                          <td className="py-2 px-2">{c.phone}</td>
                          <td className="py-2 px-2">
                            <Badge variant="outline" className="capitalize text-[10px]">{(c.status || "").replace("_", " ")}</Badge>
                          </td>
                          <td className="py-2 px-2 text-[10px]">
                            <span className="text-primary font-semibold">
                              {recruiters.find((r: any) => r.id === c.assigned_recruiter)?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {candidates.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-10 opacity-40 text-xs italic">
                          {isCandidatesLoading ? "Loading candidate data..." : "No candidates found for the selected filter"}
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2"><UserCheck className="h-4 w-4 text-primary" /> Assignment Configuration</h3>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1 block">Selected Candidates count</label>
                  <Badge className="text-xs bg-primary/10 text-primary border-none px-3 py-1 font-bold">{selectedCandidates.length} Selected</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Assign to a Particular Employee</label>
                  <select onChange={(e) => setTargetRecruiters(e.target.value ? [e.target.value] : [])} value={targetRecruiters.length === 1 ? targetRecruiters[0] : ""} className="w-full text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl">
                    <option value="">-- Choose Particular Employee --</option>
                    {recruiters.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Or Select Multiple Employees (Round-Robin Distribution)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto scrollbar-thin border border-muted p-2.5 rounded-xl">
                    {recruiters.map((r: any) => (
                      <label key={r.id} className="flex items-center gap-2 text-xs p-1.5 hover:bg-muted/10 rounded-lg cursor-pointer">
                        <input type="checkbox" checked={targetRecruiters.includes(r.id)}
                          onChange={(e) => setTargetRecruiters(e.target.checked ? [...targetRecruiters, r.id] : targetRecruiters.filter(id => id !== r.id))} />
                        <span className="truncate">{r.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1 block">Link Client Partner (Optional)</label>
                    <select value={assignClient} onChange={(e) => setAssignClient(e.target.value)} className="w-full text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl">
                      <option value="">-- Select Client --</option>
                      {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1 block">Link Target Job (Optional)</label>
                    <select value={assignJob} onChange={(e) => setAssignJob(e.target.value)} className="w-full text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl">
                      <option value="">-- Select Job --</option>
                      {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                  </div>
                </div>
                <Button onClick={handleAssign} className="w-full font-bold text-xs" disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? "Assigning..." : "Save Assignment"}
                </Button>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── Tab 2: Recruiter Performance ─── */}
        {activeTab === "performance" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold whitespace-nowrap">Select Recruiter to Monitor:</label>
              <select value={perfRecruiter} onChange={(e) => { setPerfRecruiter(e.target.value); setTimeout(() => refetchPerf(), 50); }}
                className="text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl max-w-sm w-full">
                <option value="">-- All / Current User --</option>
                {recruiters.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            {perfData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Daily */}
                  <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><Calendar className="h-4 w-4 text-primary" /> Daily Activity</h4>
                    <div className="space-y-2 text-xs">
                      {[
                        ["Assigned Records",      perfData.daily?.assigned],
                        ["Calls Processed",        perfData.daily?.calls],
                        ["Connected Calls",        perfData.daily?.connected,        "text-emerald-600"],
                        ["Not Connected",          perfData.daily?.notConnected,      "text-rose-500"],
                        ["Follow-Ups Scheduled",   perfData.daily?.followups],
                        ["Interested Candidates",  perfData.daily?.interested,        "text-primary"],
                        ["Shortlisted Candidates", perfData.daily?.shortlisted],
                        ["Interview Scheduled",    perfData.daily?.interviewScheduled],
                        ["Selected Candidates",    perfData.daily?.selected,          "text-emerald-600"],
                        ["Joined Candidates",      perfData.daily?.joined,            "text-emerald-700"],
                      ].map(([label, val, cls = ""]: any) => (
                        <div key={label} className="flex justify-between">
                          <span>{label}:</span>
                          <span className={`font-bold ${cls}`}>{val ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  {/* Weekly */}
                  <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><TrendingUp className="h-4 w-4 text-primary" /> Weekly Performance</h4>
                    <div className="space-y-2 text-xs">
                      {[
                        ["Weekly Assignments",  perfData.weekly?.assigned],
                        ["Weekly Calls",        perfData.weekly?.calls],
                        ["Weekly Follow-Ups",   perfData.weekly?.followups],
                        ["Weekly Shortlists",   perfData.weekly?.shortlisted],
                        ["Weekly Selections",   perfData.weekly?.selected, "text-emerald-600"],
                        ["Weekly Joinings",     perfData.weekly?.joined,   "text-emerald-700"],
                      ].map(([label, val, cls = ""]: any) => (
                        <div key={label} className="flex justify-between">
                          <span>{label}:</span>
                          <span className={`font-bold ${cls}`}>{val ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  {/* Monthly */}
                  <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><Trophy className="h-4 w-4 text-primary" /> Monthly Ratios & Targets</h4>
                    <div className="space-y-2.5 text-xs">
                      {[
                        ["Monthly Target Calls", perfData.monthly?.targetCalls],
                        ["Achievement Rate",     `${perfData.monthly?.achievementPercentage ?? 0}%`, "text-primary"],
                        ["Conversion Rate",      `${perfData.monthly?.conversionRate ?? 0}%`],
                        ["Selection Ratio",      `${perfData.monthly?.selectionRatio ?? 0}%`],
                        ["Joining Ratio",        `${perfData.monthly?.joiningRatio ?? 0}%`, "text-emerald-600"],
                      ].map(([label, val, cls = ""]: any) => (
                        <div key={label} className="flex justify-between">
                          <span>{label}:</span>
                          <span className={`font-bold ${cls}`}>{val ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed opacity-50 text-xs">
                No performance data available. Select a recruiter above or ensure call logs exist.
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Tab 3: Recruiter Leaderboard ─── */}
        {activeTab === "leaderboard" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Leaderboard Rankings</h3>
              <div className="flex gap-2">
                {(["daily","weekly","monthly"] as const).map(f => (
                  <Button key={f} variant={leaderboardFilter === f ? "default" : "outline"} onClick={() => setLeaderboardFilter(f)} size="sm" className="text-xs capitalize">{f}</Button>
                ))}
              </div>
            </div>
            <Card className="p-6 border-none shadow-xl bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-muted text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                      <th className="py-2.5 px-2">Rank</th>
                      <th className="py-2.5 px-2">Recruiter</th>
                      <th className="py-2.5 px-2">Calls Made</th>
                      <th className="py-2.5 px-2">Shortlists</th>
                      <th className="py-2.5 px-2">Selections</th>
                      <th className="py-2.5 px-2">Joinings</th>
                      <th className="py-2.5 px-2">Conversion / Selection Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((r: any, index: number) => (
                      <tr key={r.recruiterId} className="border-b border-muted/30 text-xs hover:bg-muted/5">
                        <td className="py-3 px-2 font-black">{index === 0 ? "🥇 1st" : index === 1 ? "🥈 2nd" : index === 2 ? "🥉 3rd" : `#${index + 1}`}</td>
                        <td className="py-3 px-2"><div className="flex flex-col"><span className="font-bold">{r.name}</span><span className="text-[10px] text-muted-foreground">{r.email}</span></div></td>
                        <td className="py-3 px-2 font-bold">{r.callsMade}</td>
                        <td className="py-3 px-2 text-primary">{r.shortlisted}</td>
                        <td className="py-3 px-2 text-emerald-600">{r.selected}</td>
                        <td className="py-3 px-2 text-emerald-700 font-black">{r.joined}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold">
                            <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-none">Selection: {r.selectionRate}%</Badge>
                            <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-none">Joining: {r.joiningRate}%</Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 opacity-40 text-xs italic">No recruiter logs found for this period</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── Tab 4: Manager Reports ─── */}
        {activeTab === "reports" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Filter Bar */}
            <Card className="p-6 border-none shadow-xl bg-card grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Recruiter</label>
                <select value={repRecruiter} onChange={(e) => setRepRecruiter(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg">
                  <option value="">All</option>
                  {recruiters.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Client</label>
                <select value={repClient} onChange={(e) => setRepClient(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg">
                  <option value="">All</option>
                  {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Job</label>
                <select value={repJob} onChange={(e) => setRepJob(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg">
                  <option value="">All</option>
                  {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Start Date</label>
                <Input type="date" value={repStartDate} onChange={(e) => setRepStartDate(e.target.value)} className="text-xs h-9" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">End Date</label>
                <Input type="date" value={repEndDate} onChange={(e) => setRepEndDate(e.target.value)} className="text-xs h-9" />
              </div>
              {/* ✅ Call Disp. — matches CallingPortal Level 1 dispositions */}
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Call Disp.</label>
                <select value={repDisp} onChange={(e) => setRepDisp(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg">
                  <option value="">All</option>
                  {CALL_DISPOSITIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {/* ✅ App Status — matches CallingPortal Level 2 dispositions */}
              <div>
                <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">App Status</label>
                <select value={repStatus} onChange={(e) => setRepStatus(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg">
                  <option value="">All</option>
                  {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </Card>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Assigned"     value={reportsData.metrics?.totalAssigned  || 0} change="Records allocated"           icon={Users}       />
              <StatCard title="Calls Processed"    value={reportsData.metrics?.totalCalls     || 0} change={`${reportsData.metrics?.connectedCalls || 0} Connected`} icon={PhoneCall}   />
              <StatCard title="Pending Calls"      value={reportsData.metrics?.pendingCalls   || 0} change="Unprocessed queue"           icon={AlertCircle} />
              <StatCard title="Joined Candidates"  value={reportsData.metrics?.joined         || 0} change="Hired successfully"          icon={CheckCircle2}/>
            </div>

            {/* Client / Job / Recruiter wise summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><Building2 className="h-4 w-4 text-primary" /> Client Wise Summary</h4>
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin text-xs space-y-3">
                  {(reportsData.clientWise || []).map((c: any) => (
                    <div key={c.clientId} className="flex justify-between border-b pb-2">
                      <div><span className="font-bold">{c.companyName}</span><p className="text-[10px] text-muted-foreground">Apps: {c.totalApplications} | Shortlisted: {c.totalShortlisted}</p></div>
                      <div className="text-right"><span className="font-bold text-emerald-600">Selected: {c.totalSelected}</span><p className="text-[10px] font-black text-emerald-700">Joined: {c.totalJoined}</p></div>
                    </div>
                  ))}
                  {!(reportsData.clientWise?.length) && <p className="text-center text-muted-foreground italic text-[10px] py-4">No data available</p>}
                </div>
              </Card>
              <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><Briefcase className="h-4 w-4 text-primary" /> Job Wise Summary</h4>
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin text-xs space-y-3">
                  {(reportsData.jobWise || []).map((j: any) => (
                    <div key={j.jobId} className="flex justify-between border-b pb-2">
                      <div><span className="font-bold">{j.title}</span><p className="text-[10px] text-muted-foreground">Apps: {j.totalApplications} | Shortlists: {j.totalShortlisted}</p></div>
                      <div className="text-right"><span className="font-bold text-emerald-600">Selected: {j.totalSelected}</span><p className="text-[10px] font-black text-emerald-700">Joined: {j.totalJoined}</p></div>
                    </div>
                  ))}
                  {!(reportsData.jobWise?.length) && <p className="text-center text-muted-foreground italic text-[10px] py-4">No data available</p>}
                </div>
              </Card>
              <Card className="p-6 border-none shadow-xl bg-card space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><Users className="h-4 w-4 text-primary" /> Recruiter Wise Summary</h4>
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin text-xs space-y-3">
                  {(reportsData.recruiterWise || []).map((r: any) => (
                    <div key={r.recruiterId} className="flex justify-between border-b pb-2">
                      <div><span className="font-bold">{r.name}</span><p className="text-[10px] text-muted-foreground">Calls: {r.callsCount} | Shortlists: {r.shortlisted}</p></div>
                      <div className="text-right"><span className="font-bold text-emerald-600">Selected: {r.selected}</span><p className="text-[10px] font-black text-emerald-700">Joined: {r.joined}</p></div>
                    </div>
                  ))}
                  {!(reportsData.recruiterWise?.length) && <p className="text-center text-muted-foreground italic text-[10px] py-4">No data available</p>}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── Tab 5: Audit Trail / Assignment History ─── */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* ✅ FILTER BAR — new addition */}
            <Card className="p-4 border-none shadow-lg bg-card">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[160px]">
                  <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Search Candidate / Recruiter</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input placeholder="Type name..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="pl-7 text-xs h-8" />
                  </div>
                </div>
                <div className="min-w-[160px]">
                  <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Filter by Recruiter</label>
                  <select value={historyRecruiterFilter} onChange={(e) => setHistoryRecruiterFilter(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg h-8">
                    <option value="">All Recruiters</option>
                    {recruiters.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="min-w-[160px]">
                  <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Filter by Client</label>
                  <select value={historyClientFilter} onChange={(e) => setHistoryClientFilter(e.target.value)} className="w-full text-xs p-2 bg-muted/20 border border-muted/50 rounded-lg h-8">
                    <option value="">All Clients</option>
                    {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                  </select>
                </div>
                <div className="min-w-[130px]">
                  <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">From Date</label>
                  <Input type="date" value={historyDateFrom} onChange={(e) => setHistoryDateFrom(e.target.value)} className="text-xs h-8" />
                </div>
                <div className="min-w-[130px]">
                  <label className="text-[9px] font-black uppercase text-muted-foreground block mb-1">To Date</label>
                  <Input type="date" value={historyDateTo} onChange={(e) => setHistoryDateTo(e.target.value)} className="text-xs h-8" />
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => { setHistorySearch(""); setHistoryRecruiterFilter(""); setHistoryClientFilter(""); setHistoryDateFrom(""); setHistoryDateTo(""); }}>
                  <Filter className="h-3 w-3 mr-1" /> Clear
                </Button>
                <Badge className="text-[10px] bg-primary/10 text-primary border-none px-2 py-1">{filteredHistory.length} records</Badge>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-xl bg-card">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><History className="h-4 w-4 text-primary" /> Audit Trail Log</h3>
              <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-muted text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                      <th className="py-2.5 px-2">Timestamp</th>
                      <th className="py-2.5 px-2">Assigned By</th>
                      <th className="py-2.5 px-2">Candidate</th>
                      <th className="py-2.5 px-2">Assigned To (Recruiter)</th>
                      <th className="py-2.5 px-2">Client / Job Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((h: any) => (
                      <tr key={h.id} className="border-b border-muted/30 text-xs hover:bg-muted/5">
                        <td className="py-3 px-2 font-mono text-[10px]">{new Date(h.assignmentDate).toLocaleString()}</td>
                        <td className="py-3 px-2 font-bold">{h.assignerName}</td>
                        <td className="py-3 px-2">
                          <div className="flex flex-col"><span className="font-bold">{h.candidateName}</span><span className="text-[10px] text-muted-foreground">{h.candidatePhone}</span></div>
                        </td>
                        <td className="py-3 px-2 text-primary font-bold">{h.recruiterName}</td>
                        <td className="py-3 px-2">
                          <div className="flex flex-col text-[10px]">
                            {h.clientName && <span>Client: <b>{h.clientName}</b></span>}
                            {h.jobTitle   && <span>Job: <b>{h.jobTitle}</b></span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-10 opacity-40 text-xs italic">
                        {allHistoryRecords.length === 0 ? "No assignment history logged yet" : "No records match your filters"}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── Tab 6: Excel Auto-Assign ─── */}
        {activeTab === "excel" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <Card className="p-6 border-none shadow-xl bg-card space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2"><Upload className="h-5 w-5 text-primary" /> Import Excel / CSV & Assign Records</h3>
              <form onSubmit={handleExcelUpload} className="space-y-4">
                <div className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors p-10 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Upload className="h-10 w-10 text-primary/40" />
                  <div className="text-center">
                    <p className="text-xs font-bold">Upload CSV / Excel file</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Requires: Name, Phone, Email, Education, Experience, Location, Resume Link</p>
                  </div>
                  <Input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setExcelFile(e.target.files?.[0] || null)} className="max-w-xs text-xs mt-2" />
                  {excelFile && <Badge className="text-xs">{excelFile.name}</Badge>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1">Select Recruiter</label>
                    <select value={excelRecruiter} onChange={(e) => setExcelRecruiter(e.target.value)} className="w-full text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl">
                      <option value="">-- No Recruiter --</option>
                      {recruiters.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1">Select Client</label>
                    <select value={excelClient} onChange={(e) => setExcelClient(e.target.value)} className="w-full text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl">
                      <option value="">-- No Client --</option>
                      {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1">Select Job</label>
                    <select value={excelJob} onChange={(e) => setExcelJob(e.target.value)} className="w-full text-xs p-2.5 bg-muted/20 border border-muted/50 rounded-xl">
                      <option value="">-- No Job --</option>
                      {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold text-xs" disabled={excelUploadMutation.isPending}>
                  {excelUploadMutation.isPending ? "Uploading and Assigning..." : "Process Upload & Auto-Assign"}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

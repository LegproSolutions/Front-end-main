import { useState, useMemo } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { Badge } from "@/crm/components/ui/badge";
import { Textarea } from "@/crm/components/ui/textarea";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Search,
  ChevronRight,
  Clock,
  User,
  Loader2,
  RefreshCw,
  Sparkles,
  MapPin,
  GraduationCap,
  Wrench,
  Globe,
  Save,
  Calendar,
  CheckCircle2,
  ListOrdered
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { useAuth } from "@/crm/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/crm/lib/utils";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

// Level 1 Dispositions
const level1Dispositions = [
  "Interested",
  "Not Interested",
  "Connected",
  "Not Connected",
  "Wrong Number"
];

// Level 2 Dispositions
const level2Dispositions = [
  "Shortlisted",
  "Rejected",
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
  "Personal Reasons"
];

// Mapping Category to Selection Details
const selectionDetailsMap: Record<string, string[]> = {
  "Interested": ["Shortlisted", "Interview Scheduled", "Interview Completed", "Selected", "Offered", "Joined", "Hold", "Future Opportunity"],
  "Not Interested": [
    "Low Salary",
    "Location Not Suitable",
    "Not Looking for Job",
    "Higher Education",
    "Shift Timing Issue",
    "Job Role Not Suitable",
    "Already Placed",
    "Personal Reasons"
  ],
  "Connected": [
    "Follow-up Required",
    "Need Some Time",
    "Discuss With Family",
    "Not Eligible",
    "Call Back Later"
  ],
  "Not Connected": [
    "Switched Off",
    "Call Not Received",
    "No Incomming",
    "Busy on Other Call",
    "Invalid Number",
    "Out of Coverage Area"
  ],
  "Wrong Number": []
};

export default function CallingPortal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(0);
  const [calling, setCalling] = useState(false);
  const [showDisposition, setShowDisposition] = useState(false);
  
  // Form States
  const [disp1, setDisp1] = useState("");
  const [disp2, setDisp2] = useState("");
  const [remarks, setRemarks] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [search, setSearch] = useState("");

  // Queries
  const { data: queue = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["calling-queue"],
    queryFn: async () => {
      const res = await api.get('/candidates');
      return res.data?.data || [];
    }
  });

  const { data: followupsRes } = useQuery({
    queryKey: ["followups-due-today"],
    queryFn: async () => {
      const res = await api.get('/calls/followups');
      return res.data?.data || [];
    }
  });

  const { data: performanceRes } = useQuery({
    queryKey: ["recruiterPerfWidgets", user?.id],
    queryFn: async () => {
      const res = await api.get('/performance/dashboard');
      return res.data?.data || null;
    },
    enabled: !!user?.id
  });

  // Log Call Activity Mutation
  const logMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post('/calls/log', payload);
    },
    onSuccess: () => {
      toast.success("Call logged and synced successfully");
      queryClient.invalidateQueries({ queryKey: ["calling-queue"] });
      queryClient.invalidateQueries({ queryKey: ["followups-due-today"] });
      queryClient.invalidateQueries({ queryKey: ["recruiterPerfWidgets"] });
      
      setDisp1("");
      setDisp2("");
      setRemarks("");
      setFollowUpDate("");
      setFollowUpTime("");
      setShowDisposition(false);
      
      if (activeIndex >= (queue.length - 1)) {
        setActiveIndex(0);
      } else {
        setActiveIndex(prev => prev + 1);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to log call");
    }
  });

  const activeCandidate = queue[activeIndex];
  const filteredQueue = queue.filter((c: any) => 
    !search || 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const followupsToday = followupsRes || [];
  const performance = performanceRes?.daily || {
    assigned: 0,
    calls: 0,
    connected: 0,
    notConnected: 0,
    followups: 0,
    interested: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    selected: 0,
    joined: 0
  };

  const handleCall = () => {
    if (!activeCandidate) return;
    setCalling(true);
    toast.info(`Opening mobile dialer for ${activeCandidate.name}...`);
    
    // Format phone with +91 prefix if it doesn't have it
    let dialNum = activeCandidate.phone;
    if (!dialNum.startsWith("+")) {
      const cleanNum = dialNum.replace(/[^0-9]/g, "");
      dialNum = cleanNum.length === 10 ? `+91${cleanNum}` : `+${cleanNum}`;
    }

    // Trigger Native / Browser tel Dialing
    window.location.href = `tel:${dialNum}`;

    // Auto-transition to disposition form
    setTimeout(() => {
      setCalling(false);
      setShowDisposition(true);
    }, 1000);
  };

  const handleSaveDisposition = () => {
    if (!disp1 || !activeCandidate) return;
    
    const hasFollowUp = (
      disp2 === "Follow-up Required" || 
      disp2 === "Call Back Later" || 
      disp2 === "Need Some Time" || 
      disp2 === "Discuss With Family" || 
      disp2 === "Interview Scheduled" || 
      disp2 === "Hold" || 
      disp2 === "Future Opportunity"
    );

    logMutation.mutate({
      candidateId: activeCandidate.id,
      disposition1: disp1,
      disposition2: disp2 || undefined,
      remarks,
      followUpDate: hasFollowUp ? (followUpDate || undefined) : undefined,
      followUpTime: hasFollowUp ? (followUpTime || undefined) : undefined
    });
  };

  if (isLoading) {
    return (
      <AppLayout title="Calling Portal">
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-primary" />
          </motion.div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Building your queue...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Calling Portal"
      subtitle="Dial candidates, log dispositions, schedule follow-ups, and monitor stats."
      actions={
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-2 h-9 text-[10px] font-bold uppercase tracking-widest rounded-full">
          <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} /> Sync Queue
        </Button>
      }
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Recruiter Dashboard Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-card p-3.5 rounded-xl border border-muted/50 text-center space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Assigned Today</span>
            <p className="text-xl font-black text-primary">{performance.assigned}</p>
          </div>
          <div className="bg-card p-3.5 rounded-xl border border-muted/50 text-center space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Pending Calls</span>
            <p className="text-xl font-black text-amber-500">{Math.max(0, performance.assigned - performance.calls)}</p>
          </div>
          <div className="bg-card p-3.5 rounded-xl border border-muted/50 text-center space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Follow-Ups Today</span>
            <p className="text-xl font-black text-indigo-500">{followupsToday.length}</p>
          </div>
          <div className="bg-card p-3.5 rounded-xl border border-muted/50 text-center space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Shortlisted</span>
            <p className="text-xl font-black text-emerald-500">{performance.shortlisted}</p>
          </div>
          <div className="bg-card p-3.5 rounded-xl border border-muted/50 text-center space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Selected / Joined</span>
            <p className="text-xl font-black text-emerald-700">{performance.selected} / {performance.joined}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Queue & Followups */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="flex flex-col h-[400px] border-none shadow-2xl overflow-hidden bg-card/80 backdrop-blur-sm">
              <div className="p-4 border-b border-primary/5 bg-primary/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                  <Input 
                    placeholder="Quick Search..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="h-10 pl-10 text-xs bg-muted/50 border-none rounded-xl shadow-inner focus-visible:ring-primary/20" 
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredQueue.map((c: any, i: number) => {
                    const realIdx = queue.indexOf(c);
                    const isActive = realIdx === activeIndex;
                    return (
                      <motion.div 
                        key={c.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={() => { setActiveIndex(realIdx); setShowDisposition(false); setCalling(false); }}
                        className={cn(
                          "p-4 border-b border-primary/5 cursor-pointer transition-all flex items-center gap-3 group relative overflow-hidden",
                          isActive ? "bg-primary/5" : "hover:bg-primary/[0.02]"
                        )}
                      >
                        {isActive && <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all shadow-inner",
                          isActive ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          {c.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-black truncate transition-colors", isActive ? "text-primary" : "text-card-foreground")}>{c.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate font-medium mt-0.5">{c.trades || 'N/A'} • {c.phone}</p>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 transition-all opacity-20 group-hover:opacity-100", isActive && "text-primary opacity-100 translate-x-1")} />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {filteredQueue.length === 0 && (
                  <div className="p-12 text-center flex flex-col items-center gap-4">
                    <div className="p-4 bg-muted/20 rounded-2xl">
                      <User className="h-8 w-8 text-primary/20" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Queue Empty</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-primary/5 bg-primary/5 flex items-center justify-between">
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                  {queue.length > 0 ? `${activeIndex + 1} OF ${queue.length}` : '0 OF 0'}
                </p>
                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-2 h-5">QUEUE</Badge>
              </div>
            </Card>

            {/* Followups panel */}
            <Card className="p-4 border-none shadow-xl bg-card space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-indigo-500" /> Follow-ups Due Today
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin text-xs">
                {followupsToday.map((f: any) => (
                  <div key={f.id} className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{f.name}</p>
                      <p className="text-[9px] text-muted-foreground">{f.phone}</p>
                    </div>
                    <Badge className="text-[9px] bg-indigo-100 text-indigo-700 border-none font-bold">
                      {f.followUpTime || "Today"}
                    </Badge>
                  </div>
                ))}
                {followupsToday.length === 0 && (
                  <p className="text-center py-4 opacity-50 italic text-[11px]">No followups due today</p>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Active Dialer Details */}
          <div className="lg:col-span-3 space-y-6">
            {activeCandidate ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCandidate.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-8 border-none shadow-2xl relative overflow-hidden bg-gradient-to-br from-card to-muted/30">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl font-black text-primary shadow-2xl border border-primary/10">
                          {activeCandidate.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-black text-card-foreground tracking-tight">{activeCandidate.name}</h3>
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black px-3 rounded-full uppercase">
                              {activeCandidate.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground font-bold">
                            <span className="flex items-center gap-1.5"><Phone size={14} className="text-primary" /> {activeCandidate.phone}</span>
                            {activeCandidate.email && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span>{activeCandidate.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: "Location", val: `${activeCandidate.district || ""}, ${activeCandidate.state || ""}`, icon: MapPin },
                        { label: "Education", val: activeCandidate.education || 'N/A', icon: GraduationCap },
                        { label: "Trades / Skills", val: activeCandidate.trades || 'General', icon: Wrench },
                        { label: "Client Partner", val: activeCandidate.client?.company_name || "Unassigned", icon: Globe },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/50 dark:bg-black/20 rounded-2xl p-4 shadow-sm border border-primary/5">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                              <stat.icon size={12} className="text-primary" />
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</span>
                          </div>
                          <p className="text-xs font-black truncate">{stat.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      {!calling && !showDisposition && (
                        <Button onClick={handleCall} className="gap-3 flex-1 h-14 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                          <PhoneCall className="h-5 w-5" /> Click-to-Call Dialer
                        </Button>
                      )}
                      {calling && (
                        <Button variant="destructive" className="gap-3 flex-1 h-14 text-sm font-black uppercase tracking-widest rounded-2xl animate-pulse">
                          <PhoneOff className="h-5 w-5" /> DIALING MOBILE NUMBER...
                        </Button>
                      )}
                    </div>
                  </Card>

                  {/* Disposition selection form */}
                  {showDisposition && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="p-8 border-none shadow-2xl bg-card space-y-6">
                        <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
                          <Sparkles className="text-primary h-24 w-24 -rotate-12" />
                        </div>

                        {/* DISPOSITION CATEGORY Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-1 bg-primary rounded-full" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-card-foreground">Disposition Category</h4>
                          </div>
                          
                          <div className="flex flex-wrap gap-2.5">
                            {level1Dispositions.map(d => (
                              <Button
                                key={d}
                                type="button"
                                variant={disp1 === d ? "default" : "outline"}
                                onClick={() => {
                                  setDisp1(d);
                                  setDisp2(""); // Reset Selection Details on category change
                                }}
                                className={cn(
                                  "text-[10px] h-10 px-5 font-black uppercase tracking-wider rounded-xl transition-all shadow-sm border border-muted/50",
                                  disp1 === d 
                                    ? "bg-[#0f3d59] hover:bg-[#0c3149] text-white border-transparent scale-105" 
                                    : "bg-white hover:bg-muted/10 text-card-foreground"
                                )}
                              >
                                {d.toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* SELECTION DETAILS Section (Dynamic) */}
                        {disp1 && selectionDetailsMap[disp1] && selectionDetailsMap[disp1].length > 0 && (
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-1 bg-primary rounded-full" />
                              <h4 className="text-xs font-black uppercase tracking-wider text-card-foreground">Selection Details</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {selectionDetailsMap[disp1].map(d => (
                                <Button
                                  key={d}
                                  type="button"
                                  variant="outline"
                                  onClick={() => setDisp2(d)}
                                  className={cn(
                                    "text-xs h-12 justify-start px-4 rounded-xl border border-muted/50 font-semibold transition-all shadow-sm",
                                    disp2 === d 
                                      ? "bg-white border-primary shadow-sm font-bold" 
                                      : "bg-white hover:bg-muted/10"
                                  )}
                                >
                                  <div className={cn("h-1.5 w-1.5 rounded-full mr-2", disp2 === d ? "bg-[#0f3d59]" : "bg-muted-foreground/30")} />
                                  {d}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* FOLLOW-UP DATE & TIME Section (Only showing on valid selections) */}
                        {(disp2 === "Follow-up Required" || 
                          disp2 === "Call Back Later" || 
                          disp2 === "Need Some Time" || 
                          disp2 === "Discuss With Family" || 
                          disp2 === "Interview Scheduled" || 
                          disp2 === "Hold" || 
                          disp2 === "Future Opportunity") && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Follow-Up Date</label>
                              <Input
                                type="date"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                                className="text-xs h-12 rounded-xl bg-white border border-muted/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Follow-Up Time</label>
                              <Input
                                type="time"
                                value={followUpTime}
                                onChange={(e) => setFollowUpTime(e.target.value)}
                                className="text-xs h-12 rounded-xl bg-white border border-muted/50"
                              />
                            </div>
                          </div>
                        )}

                        {/* INTERNAL SUMMARY NOTES Section */}
                        <div className="space-y-2 border-t pt-4">
                          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Internal Summary Notes</label>
                          <Textarea
                            placeholder="Document the key takeaways from this conversation..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="text-xs h-28 resize-none bg-white border border-muted/50 rounded-2xl focus-visible:ring-primary/20 p-4"
                          />
                        </div>

                        <Button
                          onClick={handleSaveDisposition}
                          disabled={!disp1 || logMutation.isPending}
                          className="w-full text-xs h-14 font-black uppercase tracking-widest bg-[#0f3d59] hover:bg-[#0c3149] text-white shadow-2xl rounded-2xl transition-all active:scale-[0.99]"
                        >
                          {logMutation.isPending ? "Syncing..." : "Save Call Activity & Sync"}
                        </Button>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <Card className="h-[300px] flex flex-col items-center justify-center p-16 text-center border-none shadow-2xl bg-card">
                <Phone className="h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-sm font-black uppercase text-muted-foreground mb-1">No Candidate Active</h3>
                <p className="text-xs text-muted-foreground max-w-xs font-medium">Please select a candidate from the recruitment work queue to start making calls.</p>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

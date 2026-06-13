import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { Badge } from "@/crm/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/crm/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/crm/components/ui/table";
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, Users, Briefcase,
  GripVertical, Search, MoreHorizontal, Clock, CheckCircle2, UserPlus, Star
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { Skeleton } from "@/crm/components/ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/crm/components/ui/dropdown-menu";

const statusLabels: Record<string, string> = {
  new_lead: "New Lead",
  screened: "Screened",
  interested: "Interested",
  interview_scheduled: "Interview Scheduled",
  selected: "Selected",
  joined: "Joined",
  not_joined: "Not Joined",
  left: "Left",
  rejected: "Rejected",
};
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/crm/components/ui/dialog";
import { pipelineLockedStatuses } from "@/crm/lib/sample-data";
import { formatExcelDate, calculateAge } from "@/crm/lib/date-utils";
import { isCandidateEligible } from "@/crm/lib/candidate-utils";

const statusColors: Record<string, string> = {
  new_lead: "bg-blue-100 text-blue-700",
  screened: "bg-amber-100 text-amber-700",
  interested: "bg-purple-100 text-purple-700",
  interview_scheduled: "bg-primary/10 text-primary",
  selected: "bg-emerald-100 text-emerald-700",
  joined: "bg-emerald-100 text-emerald-700",
  not_joined: "bg-orange-100 text-orange-700",
  left: "bg-slate-100 text-slate-700",
  rejected: "bg-rose-100 text-rose-700",
};

const pipelineStages = ["new_lead", "screened", "interested", "interview_scheduled", "selected", "joined", "not_joined", "left"];

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [matchingDialogOpen, setMatchingDialogOpen] = useState(false);
  const [matchingCandidates, setMatchingCandidates] = useState<any[]>([]);

  // Fetch Client Details
  const { data: client, isLoading: clientLoading, error: clientError } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const res = await api.get(`/clients/${id}`);
      // Backend returns { success: true, client: {...} }
      return res.data?.client || res.data || null;
    },
    enabled: !!id
  });

  // Fetch Pipeline for this client
  const { data: pipeline = [], isLoading: pipelineLoading } = useQuery({
    queryKey: ["pipeline", id],
    queryFn: async () => {
      const res = await api.get(`/pipeline/client/${id}`);
      // Backend returns { success: true, data: [...] }
      const rawData = res.data?.data || res.data || [];
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!id
  });

  // Fetch all candidates
  const { data: allCandidates = [] } = useQuery({
    queryKey: ["candidates", "client-detail"],
    queryFn: async () => {
      const res = await api.get('/candidates');
      const data = res?.data?.data || res?.data || [];
      return data.map((c: any) => {
        const formattedDob = formatExcelDate(c?.dob);
        return {
          ...c,
          age: calculateAge(formattedDob),
          dob: formattedDob,
        };
      });
    },
  });

  // Fetch jobs for this client
  const { data: clientJobs = [] } = useQuery({
    queryKey: ["client-jobs", id],
    queryFn: async () => {
      const res = await api.get(`/jobs?client_id=${id}`);
      // Backend returns an array or wrapped response
      const raw = res.data?.data || res.data || [];
      return Array.isArray(raw) ? raw : [];
    },
    enabled: !!id
  });

  // Update Candidate Stage Mutation
  const updateStageMutation = useMutation({
    mutationFn: async ({ candidateId, stageName }: { candidateId: string, stageName: string }) => {
      await api.put(`/pipeline/candidate/${candidateId}/stage`, {
        client_id: id,
        stage_name: stageName
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline", id] });
      toast.success("Candidate moved successfully");
    }
  });

  const handleDragStart = (candidateId: string) => {
    setDraggedCandidateId(candidateId);
  };

  const handleDrop = (targetStage: string) => {
    if (!draggedCandidateId) return;
    updateStageMutation.mutate({ candidateId: draggedCandidateId, stageName: targetStage });
    setDraggedCandidateId(null);
  };

  const findMatchingCandidates = () => {
    if (clientJobs.length === 0) {
      toast.error("No active jobs found for this client to match against.");
      return;
    }

    const matches = allCandidates.filter((c: any) => {
      // Check against any open job of the client
      return clientJobs.some((job: any) => {
        if (job.status !== 'open') return false;
        return isCandidateEligible(job, c);
      });
    });

    setMatchingCandidates(matches);
    setMatchingDialogOpen(true);
  };

  const candidatesByStage = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    pipelineStages.forEach(s => grouped[s] = []);
    if (!Array.isArray(pipeline)) return grouped;
    pipeline.forEach((p: any) => {
      const stageName = p.stage?.stage_name?.toLowerCase() || "";
      let mappedStage = stageName;
      if (stageName === "applied" || stageName === "new" || stageName === "new_lead") {
        mappedStage = "new_lead";
      } else if (stageName === "shortlisted" || stageName === "screened") {
        mappedStage = "screened";
      } else if (stageName === "interview scheduled" || stageName === "interview_scheduled") {
        mappedStage = "interview_scheduled";
      } else if (stageName === "joined") {
        mappedStage = "joined";
      } else if (stageName === "not joined" || stageName === "not_joined") {
        mappedStage = "not_joined";
      } else if (stageName === "left") {
        mappedStage = "left";
      }
      if (mappedStage && grouped[mappedStage]) {
        grouped[mappedStage].push(p);
      }
    });
    return grouped;
  }, [pipeline, pipelineStages]);

  if (clientLoading) return (
    <AppLayout title="Loading Client...">
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </AppLayout>
  );

  if (clientError || !client) {
    return (
      <AppLayout title="Client Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <Building2 className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist or was removed.</p>
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clients
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={client.company_name}
      subtitle={client.industry}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <Button size="sm" className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Eligible Candidates
          </Button>
        </div>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Total In Pipeline</p>
              <p className="text-xl font-bold">{pipeline.length}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Placements</p>
              <p className="text-xl font-bold">{pipeline.filter((p:any) => p.stage?.stage_name?.toLowerCase() === 'joined').length}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Active Jobs</p>
              <p className="text-xl font-bold">{clientJobs.filter((job: any) => job.status === 'open').length}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Last Activity</p>
              <p className="text-xs font-semibold">Today</p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs">Recruitment Pipeline</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Client Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
               <Card className="lg:col-span-2 p-5">
                 <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                   <Users className="h-4 w-4 text-primary" /> Active Pipeline Summary
                 </h3>
                 <div className="space-y-3">
                   {pipelineStages.map(stage => {
                     const count = candidatesByStage[stage]?.length || 0;
                     if (count === 0) return null;
                     return (
                       <div key={stage} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                         <div className="flex items-center gap-3">
                           <div className={`h-2 w-2 rounded-full ${statusColors[stage] || 'bg-muted'}`} />
                           <span className="text-xs font-medium">{statusLabels[stage]}</span>
                         </div>
                         <span className="text-xs font-bold">{count} Candidates</span>
                       </div>
                     );
                   })}
                   {pipeline.length === 0 && (
                     <div className="text-center py-10">
                       <p className="text-sm text-muted-foreground">No candidates currently in the pipeline for this client.</p>
                       <Button variant="link" className="text-primary text-xs" onClick={() => navigate('/candidates')}>
                         Browse candidates to add
                       </Button>
                     </div>
                   )}
                 </div>
               </Card>
               
               <Card className="p-5">
                 <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                   <Building2 className="h-4 w-4 text-primary" /> Contact Info
                 </h3>
                 <div className="space-y-4">
                   <div className="flex items-start gap-3">
                     <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Primary Contact</p>
                       <p className="text-xs font-medium">{client.contact_person || 'Not specified'}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</p>
                       <p className="text-xs font-medium">{client.email || 'N/A'}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number</p>
                       <p className="text-xs font-medium">{client.phone || 'N/A'}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                     <div>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Office Location</p>
                       <p className="text-xs font-medium">{client.location || 'Unknown'}</p>
                     </div>
                   </div>
                 </div>
               </Card>
             </div>
          </TabsContent>

          <TabsContent value="pipeline">
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin min-h-[500px]">
              {pipelineStages.map((stage) => {
                const stageCandidates = candidatesByStage[stage] || [];
                return (
                  <div key={stage} className="flex-shrink-0 w-72"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(stage)}
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {statusLabels[stage]}
                        </h3>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] justify-center bg-muted">
                          {stageCandidates.length}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 p-1">
                      {stageCandidates.map((p: any) => (
                        <Card key={p.id} 
                          draggable
                          onDragStart={() => handleDragStart(p.candidate.id)}
                          className={`p-3 border-l-4 hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing ${draggedCandidateId === p.candidate.id ? "opacity-50 ring-2 ring-primary" : ""}`} 
                          style={{ borderLeftColor: statusColors[stage]?.split(' ')[0] || 'var(--primary)' }}
                        >
                          <div className="absolute top-2 right-1 group-hover:block hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <GripVertical className="h-3 w-3 text-muted-foreground/40" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <p className="text-[10px] font-bold px-2 py-1.5 uppercase text-muted-foreground">Move to:</p>
                                {pipelineStages.filter(s => s !== stage).map(s => (
                                  <DropdownMenuItem key={s} onClick={() => updateStageMutation.mutate({ candidateId: p.candidate.id, stageName: s })} className="text-xs">
                                    {statusLabels[s]}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem onClick={() => updateStageMutation.mutate({ candidateId: p.candidate.id, stageName: 'rejected' })} className="text-xs text-destructive">
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-start justify-between mb-2 pr-6">
                            <div className="flex items-center gap-2" onClick={() => navigate(`/candidates`)}>
                              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                {(p.candidate?.name || "U").split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold group-hover:text-primary transition-colors">{p.candidate?.name || "Unknown"}</h4>
                                <p className="text-[10px] text-muted-foreground">{p.candidate?.email || ""}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-2 pt-2 border-t border-dashed">
                             <span>ID: {p.candidate?.id?.slice(0, 8)}</span>
                             <span className="flex items-center gap-1"><Phone size={10} /> {p.candidate?.phone}</span>
                          </div>
                        </Card>
                      ))}
                      {stageCandidates.length === 0 && (
                        <div className="h-24 flex flex-col items-center justify-center border border-dashed rounded-xl bg-muted/10">
                          <p className="text-[10px] text-muted-foreground/30 italic">No candidates</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card className="p-6">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold mb-4">General Information</h4>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-[10px] text-muted-foreground uppercase font-bold">Company Name</dt>
                        <dd className="text-sm font-medium">{client.company_name}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] text-muted-foreground uppercase font-bold">Industry</dt>
                        <dd className="text-sm font-medium">{client.industry}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] text-muted-foreground uppercase font-bold">Created At</dt>
                        <dd className="text-sm font-medium">{new Date(client.createdAt).toLocaleDateString()}</dd>
                      </div>
                    </dl>
                  </div>
                   <div>
                    <h4 className="text-sm font-bold mb-4">Operations</h4>
                    <div className="space-y-3">
                       <Button onClick={findMatchingCandidates} className="w-full justify-start text-xs h-9 bg-primary/10 text-primary border-none hover:bg-primary/20" variant="outline">
                         <Search className="h-3.5 w-3.5 mr-2" /> Find Matching Candidates
                       </Button>
                       <Button onClick={() => navigate('/candidates')} className="w-full justify-start text-xs h-9 bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100" variant="outline">
                         <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> View Eligible Talent Pool
                       </Button>
                       <Button onClick={() => toast.info("Assigning to field assistant... Coming soon")} className="w-full justify-start text-xs h-9 bg-blue-50 text-blue-600 border-none hover:bg-blue-100" variant="outline">
                         <UserPlus className="h-3.5 w-3.5 mr-2" /> Assign to Field Assistant
                       </Button>
                    </div>
                  </div>
               </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MatchingCandidatesDialog 
        open={matchingDialogOpen} 
        onOpenChange={setMatchingDialogOpen} 
        candidates={matchingCandidates} 
      />
    </AppLayout>
  );
}

function MatchingCandidatesDialog({ open, onOpenChange, candidates }: { open: boolean, onOpenChange: (open: boolean) => void, candidates: any[] }) {
  const navigate = useNavigate();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Matching Candidates ({candidates.length})</DialogTitle>
          <DialogDescription className="sr-only">
            List of candidates whose profiles match the open jobs for this client.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Education</TableHead>
                <TableHead className="text-xs text-center">Age</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No matching candidates found.</TableCell>
                </TableRow>
              ) : candidates.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs font-medium">{c.name}</TableCell>
                  <TableCell className="text-xs">{c.education}</TableCell>
                  <TableCell className="text-xs text-center">{c.age}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => navigate('/candidates')}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

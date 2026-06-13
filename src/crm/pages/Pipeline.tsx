import { useState, useMemo } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Badge } from "@/crm/components/ui/badge";
import { Button } from "@/crm/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/crm/components/ui/tabs";
import {
  GripVertical,
  MoreHorizontal,
  Phone,
  Mail,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Building2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/crm/components/ui/dialog";
import { Textarea } from "@/crm/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { Skeleton } from "@/crm/components/ui/skeleton";

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

const statusColors: Record<string, string> = {
  new_lead: "bg-blue-100 text-blue-700 border-blue-200",
  screened: "bg-amber-100 text-amber-700 border-amber-200",
  interested: "bg-purple-100 text-purple-700 border-purple-200",
  interview_scheduled: "bg-primary/10 text-primary border-primary/20",
  selected: "bg-emerald-100 text-emerald-700 border-emerald-200",
  joined: "bg-emerald-100 text-emerald-700 border-emerald-200",
  not_joined: "bg-orange-100 text-orange-700 border-orange-200",
  left: "bg-slate-100 text-slate-700 border-slate-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const pipelineStages = [
  "new_lead",
  "screened",
  "interested",
  "interview_scheduled",
  "selected",
  "joined",
  "not_joined",
  "left"
];

export default function Pipeline() {
  const queryClient = useQueryClient();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Fetch Clients
  const { data: clients = [], isLoading: clientsLoading, isError: clientsError, refetch: refetchClients } = useQuery({
    queryKey: ["clients-minimal"],
    queryFn: async () => {
      const res = await api.get('/clients');
      const rawData = res?.data?.data || [];
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  // Fetch Pipeline for selected client
  const { data: pipeline = [], isLoading: pipelineLoading, isError: pipelineError, refetch: refetchPipeline } = useQuery({
    queryKey: ["pipeline", selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      const res = await api.get(`/pipeline/client/${selectedClientId}`);
      const rawData = res?.data?.data || res?.data || [];
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!selectedClientId,
    staleTime: 0,
  });

  // Update Candidate Stage Mutation
  const updateStageMutation = useMutation({
    mutationFn: async ({ candidateId, stageName }: { candidateId: string, stageName: string }) => {
      await api.put(`/pipeline/candidate/${candidateId}/stage`, {
        client_id: selectedClientId,
        stage_name: stageName
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline", selectedClientId] });
      toast.success("Stage updated successfully");
    },
    onError: () => {
      toast.error("Failed to update stage");
    }
  });

  const handleDragStart = (id: string) => setDraggedCandidateId(id);

  const handleDrop = (targetStage: string) => {
    if (!draggedCandidateId) return;
    updateStageMutation.mutate({ candidateId: draggedCandidateId, stageName: targetStage });
    setDraggedCandidateId(null);
  };

  // Group candidates by stage
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

  return (
    <AppLayout title="Pipeline Management" subtitle="Manage candidates across recruitment stages">
      <div className="space-y-4 animate-fade-in">
        {/* Toolbar */}
        <Card className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Client:</span>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-4 w-px bg-border hidden md:block" />
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                placeholder="Search in pipeline..."
                className="h-8 pl-8 pr-3 text-xs bg-muted/50 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-48"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Filter className="h-3 w-3" /> Filter
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5">
              <BarChart3 className="h-3 w-3" /> Reports
            </Button>
          </div>
        </Card>

        {/* Pipeline Board */}
        {!selectedClientId ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/20">
            <Building2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground font-medium">Please select a client to view their recruitment pipeline</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin min-h-[600px]">
            {pipelineStages.map((stage) => {
              const stageCandidates = candidatesByStage[stage] || [];
              return (
                <div
                  key={stage}
                  className="flex-shrink-0 w-72"
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
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-3 p-1">
                    {pipelineLoading ? (
                      [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
                    ) : stageCandidates.length > 0 ? (
                      stageCandidates.map((p: any) => (
                        <Card
                          key={p.id}
                          draggable
                          onDragStart={() => handleDragStart(p.candidate.id)}
                          className={`p-3 cursor-grab active:cursor-grabbing border-l-4 hover:shadow-md transition-all group ${draggedCandidateId === p.candidate.id ? "opacity-50 ring-2 ring-primary" : ""
                            }`}
                          style={{ borderLeftColor: 'var(--primary)' }}
                          onClick={() => setSelectedCandidate(p.candidate)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                {(p.candidate?.name || "U").split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold group-hover:text-primary transition-colors">{p.candidate?.name || "Unknown"}</h4>
                                <p className="text-[10px] text-muted-foreground">{p.candidate?.email || ""}</p>
                              </div>
                            </div>
                            <GripVertical className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-2 pt-2 border-t border-dashed">
                            <span className="flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5" /> {p.candidate?.phone || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-2.5 w-2.5" /> {p.candidate?.status === 'joined' ? 'Hired' : 'Active'}
                            </span>
                          </div>

                          <div className="flex gap-1.5 mt-3">
                            <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary transition-colors">
                              <Phone className="h-2.5 w-2.5 text-muted-foreground" />
                            </button>
                            <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary transition-colors">
                              <Mail className="h-2.5 w-2.5 text-muted-foreground" />
                            </button>
                            <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary transition-colors ml-auto">
                              <FileText className="h-2.5 w-2.5 text-muted-foreground" />
                            </button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center border border-dashed rounded-xl bg-muted/10">
                        <p className="text-[10px] text-muted-foreground/50">Drop here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Details Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Candidate: {selectedCandidate?.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detailed information and recruitment notes for the selected candidate.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Email</p>
                  <p className="text-xs font-medium">{selectedCandidate.email}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <p className="text-xs font-medium">{selectedCandidate.phone}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</p>
                  <Badge className={`text-[10px] ${statusColors[selectedCandidate.status] || ""}`}>
                    {statusLabels[selectedCandidate.status] || selectedCandidate.status || "Unknown"}
                  </Badge>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Source</p>
                  <p className="text-xs font-medium">Direct Application</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" /> Notes
                </h4>
                <Textarea
                  className="text-xs h-20 bg-muted/20"
                  placeholder="Add a recruitment note..."
                />
                <Button size="sm" className="h-8 text-xs mt-2 w-full">Save Note</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

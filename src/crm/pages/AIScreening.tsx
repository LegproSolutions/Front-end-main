import { useState } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Button } from "@/crm/components/ui/button";
import { Badge } from "@/crm/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/crm/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/crm/components/ui/dialog";
import { Bot, Phone, PlayCircle, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle, Zap, Settings2, ArrowRight, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { aiScreeningLogs, candidates, type AIScreeningLog, type AIDecision } from "@/crm/lib/sample-data";

const decisionBadge: Record<AIDecision, { class: string; label: string }> = {
  passed: { class: "bg-success/10 text-success", label: "Qualified" },
  failed: { class: "bg-destructive/10 text-destructive", label: "Not Interested" },
  pending: { class: "bg-warning/10 text-warning", label: "In Call" },
  no_response: { class: "bg-muted text-muted-foreground", label: "No Answer" },
};

const decisionIcon: Record<AIDecision, React.ReactNode> = {
  passed: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
  failed: <XCircle className="h-3.5 w-3.5 text-destructive" />,
  pending: <Zap className="h-3.5 w-3.5 text-warning animate-pulse" />,
  no_response: <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />,
};

function StatCard({ title, value, icon: Icon, change, changeType }: { 
  title: string; 
  value: number | string; 
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative";
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold">{value}</h4>
            {change && (
              <span className={`text-[10px] font-medium ${changeType === "positive" ? "text-success" : "text-muted-foreground"}`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AIScreening() {
  const [selectedLog, setSelectedLog] = useState<AIScreeningLog | null>(null);
  const [logs, setLogs] = useState(aiScreeningLogs);

  // Group by candidate for table view
  const candidateMap = new Map<string, { candidate: typeof candidates[0]; r1?: AIScreeningLog; r2?: AIScreeningLog }>();
  logs.forEach(log => {
    const c = candidates.find(x => x.id === log.candidateId);
    if (!c) return;
    if (!candidateMap.has(log.candidateId)) candidateMap.set(log.candidateId, { candidate: c });
    const entry = candidateMap.get(log.candidateId)!;
    if (log.round === 1) entry.r1 = log;
    if (log.round === 2) entry.r2 = log;
  });
  const grouped = Array.from(candidateMap.values());

  const totalScreened = grouped.length;
  const r1Pass = grouped.filter(g => g.r1?.status === "passed").length;
  const r2Pass = grouped.filter(g => g.r2?.status === "passed").length;
  const noResponse = grouped.filter(g => g.r1?.status === "no_response" || g.r2?.status === "no_response").length;

  const handleTriggerCall = (candidateId: string, round: 1 | 2) => {
    toast.info(`AI Voice Agent is dialing Round ${round}...`);
    setTimeout(() => toast.success("AI Call connected. Transcription starting..."), 1500);
  };

  return (
    <AppLayout 
      title="AI Voice Screening" 
      subtitle="Automated candidate engagement & interest check"
      actions={
        <Link to="/ai-voice-agent">
          <Button size="sm" className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            <Settings2 className="h-4 w-4" /> Configure AI Persona
          </Button>
        </Link>
      }
    >
      <div className="space-y-4 animate-fade-in">
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Multi-Round AI Screening
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                Our AI Voice Agent automatically calls eligible candidates, checks their interest for the role, and moves them to the <strong>Interested</strong> stage in your pipeline.
              </p>
            </div>
            <Link to="/ai-voice-agent">
              <Button variant="outline" size="sm" className="gap-2 group">
                Manage Agent <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="Total Screened" value={totalScreened} icon={Bot} />
          <StatCard title="Interest Expressed" value={r1Pass} icon={CheckCircle2} change={`${Math.round(r1Pass / totalScreened * 100)}% rate`} changeType="positive" />
          <StatCard title="Round 2 Success" value={r2Pass} icon={Zap} />
          <StatCard title="Declined/No Ans" value={noResponse} icon={AlertCircle} />
        </div>

        {/* Table */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Screening Live Status</h3>
            <Badge variant="outline" className="text-[10px] gap-1 bg-white"><Bot className="h-3 w-3" /> JobMela Vani v2.0</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px]">Candidate</TableHead>
                <TableHead className="text-[10px]">Job</TableHead>
                <TableHead className="text-[10px] text-center">Round 1</TableHead>
                <TableHead className="text-[10px] text-center">Round 2</TableHead>
                <TableHead className="text-[10px]">AI Decision</TableHead>
                <TableHead className="text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grouped.map(({ candidate, r1, r2 }) => {
                const finalDecision = r2?.decision || r1?.decision || "Pending";
                return (
                  <TableRow key={candidate.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLog(r2 || r1 || null)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-medium text-accent-foreground">
                          {candidate.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{candidate.name}</p>
                          <p className="text-[10px] text-muted-foreground">{candidate.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{candidate.jobTitle}</TableCell>
                    <TableCell className="text-center">
                      {r1 ? <Badge className={`text-[10px] ${decisionBadge[r1.status].class}`}>{decisionBadge[r1.status].label}</Badge> : <span className="text-[10px] text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {r2 ? <Badge className={`text-[10px] ${decisionBadge[r2.status].class}`}>{decisionBadge[r2.status].label}</Badge> : <span className="text-[10px] text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{finalDecision}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
                        {(!r1 || r1.status === "no_response") && (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => handleTriggerCall(candidate.id, 1)}>
                            <Phone className="h-3 w-3" /> R1
                          </Button>
                        )}
                        {r1?.status === "passed" && (!r2 || r2.status === "no_response" || r2.status === "pending") && (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => handleTriggerCall(candidate.id, 2)}>
                            <Phone className="h-3 w-3" /> R2
                          </Button>
                        )}
                        {(r1?.status === "no_response" || r2?.status === "no_response") && (
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1" onClick={() => handleTriggerCall(candidate.id, r1?.status === "no_response" ? 1 : 2)}>
                            <RefreshCw className="h-3 w-3" /> Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">Screening Details — {selectedLog?.candidateName}</DialogTitle>
            <DialogDescription className="sr-only">
              Detailed breakdown of the AI voice call, including transcript and decision logic.
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-[10px] text-muted-foreground">Round</p>
                  <p className="text-xs font-medium">Round {selectedLog.round}</p>
                </div>
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-[10px] text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1 mt-0.5">{decisionIcon[selectedLog.status]}<span className="text-xs font-medium">{decisionBadge[selectedLog.status].label}</span></div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground mb-1">AI Decision</p>
                <p className="text-xs bg-muted/50 rounded p-2">{selectedLog.decision}</p>
              </div>

              {selectedLog.recordingUrl && (
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Call Recording</p>
                  <div className="flex items-center gap-2 bg-muted/50 rounded p-3">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <div className="flex-1 h-1.5 bg-muted rounded-full"><div className="h-full w-1/3 bg-primary rounded-full" /></div>
                    <span className="text-[10px] text-muted-foreground">2:34</span>
                  </div>
                </div>
              )}

              {selectedLog.transcript && (
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Transcript</p>
                  <p className="text-xs bg-muted/50 rounded p-3 max-h-[120px] overflow-y-auto text-muted-foreground leading-relaxed">{selectedLog.transcript}</p>
                </div>
              )}

              {selectedLog.timestamp && (
                <p className="text-[10px] text-muted-foreground">Screened at: {selectedLog.timestamp}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

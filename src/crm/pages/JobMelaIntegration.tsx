import { useState } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { Badge } from "@/crm/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/crm/components/ui/table";
import { Switch } from "@/crm/components/ui/switch";
import { Globe, RefreshCw, CheckCircle2, AlertTriangle, Clock, Download, Settings } from "lucide-react";
import { toast } from "sonner";
import { candidates, statusLabels, statusColors } from "@/crm/lib/sample-data";

const jobMelaCandidates = candidates.filter(c => c.source === "JobMela");

export default function JobMelaIntegration() {
  const [apiKey, setApiKey] = useState("jm_sk_***************");
  const [syncInterval, setSyncInterval] = useState("5");
  const [connected, setConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleTestConnection = () => {
    toast.info("Testing connection...");
    setTimeout(() => toast.success("Connection successful!"), 1500);
  };

  const handleSync = () => {
    setSyncing(true);
    toast.info("Syncing candidates from JobMela...");
    setTimeout(() => {
      setSyncing(false);
      toast.success("Sync complete! 2 new candidates imported.");
    }, 2000);
  };

  return (
    <AppLayout title="JobMela Integration" subtitle="jobmela.co.in — Candidate sync">
      <div className="space-y-4 animate-fade-in">
        {/* Config Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-card-foreground">API Configuration</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">API Key</label>
                <Input value={apiKey} onChange={e => setApiKey(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Sync Interval (minutes)</label>
                <Select value={syncInterval} onValueChange={setSyncInterval}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" className="text-xs">1 min</SelectItem>
                    <SelectItem value="5" className="text-xs">5 min</SelectItem>
                    <SelectItem value="15" className="text-xs">15 min</SelectItem>
                    <SelectItem value="30" className="text-xs">30 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                <span className="text-xs text-muted-foreground">Auto-sync enabled</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={handleTestConnection}>Test Connection</Button>
                <Button size="sm" className="text-xs gap-1.5" onClick={handleSync} disabled={syncing}>
                  <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} /> Sync Now
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4 text-card-foreground">Sync Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {connected ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                <span className="text-xs font-medium">{connected ? "Connected" : "Disconnected"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Last sync: 2 minutes ago
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-muted/50 rounded p-2.5 text-center">
                  <p className="text-lg font-bold text-primary">{jobMelaCandidates.length}</p>
                  <p className="text-[10px] text-muted-foreground">Imported</p>
                </div>
                <div className="bg-muted/50 rounded p-2.5 text-center">
                  <p className="text-lg font-bold text-warning">0</p>
                  <p className="text-[10px] text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Imports */}
        <Card>
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="text-xs font-semibold text-card-foreground">Recent Imports from JobMela</h3>
            <Badge variant="outline" className="text-[10px] gap-1"><Globe className="h-3 w-3" /> jobmela.co.in</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px]">Name</TableHead>
                <TableHead className="text-[10px]">Phone</TableHead>
                <TableHead className="text-[10px]">Email</TableHead>
                <TableHead className="text-[10px]">Applied For</TableHead>
                <TableHead className="text-[10px]">Source</TableHead>
                <TableHead className="text-[10px]">Status</TableHead>
                <TableHead className="text-[10px]">Date</TableHead>
                <TableHead className="text-[10px]">Dedup</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobMelaCandidates.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs font-medium">{c.name}</TableCell>
                  <TableCell className="text-xs">{c.phone}</TableCell>
                  <TableCell className="text-xs">{c.email}</TableCell>
                  <TableCell className="text-xs">{c.jobTitle}</TableCell>
                  <TableCell><Badge className="text-[10px] bg-info/10 text-info">JobMela</Badge></TableCell>
                  <TableCell><Badge className={`text-[10px] ${statusColors[c.status]}`}>{statusLabels[c.status]}</Badge></TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{c.appliedDate}</TableCell>
                  <TableCell><CheckCircle2 className="h-3.5 w-3.5 text-success" /></TableCell>
                </TableRow>
              ))}
              {jobMelaCandidates.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-8">No imports yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}

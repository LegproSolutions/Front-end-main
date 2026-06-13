import { useState, useEffect } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { StatCard } from "@/crm/components/StatCard";
import { UserCheck, Clock, TrendingUp, Target, Download, Loader2, BarChart3, Users2, PieChart } from "lucide-react";
import { Button } from "@/crm/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell
} from "recharts";
import { api } from "@/crm/lib/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";
import { useAuth } from "@/crm/contexts/AuthContext";

// Static fallback data for dashboard visualization when DB is empty
const defaultRecruiterPerformance = [
  { name: "Ritu S.", submissions: 45, hires: 12 },
  { name: "Karan M.", submissions: 38, hires: 9 },
  { name: "Neha P.", submissions: 52, hires: 15 },
  { name: "Ajay K.", submissions: 30, hires: 7 },
  { name: "Divya R.", submissions: 41, hires: 11 },
];

const defaultConversionData = [
  { month: "Oct", applied: 120, screened: 85, interviewed: 40, hired: 18 },
  { month: "Nov", applied: 145, screened: 98, interviewed: 52, hired: 22 },
  { month: "Dec", applied: 110, screened: 72, interviewed: 35, hired: 15 },
  { month: "Jan", applied: 160, screened: 110, interviewed: 58, hired: 28 },
  { month: "Feb", applied: 180, screened: 125, interviewed: 65, hired: 32 },
  { month: "Mar", applied: 200, screened: 140, interviewed: 72, hired: 35 },
];

const COLORS = ["hsl(199, 89%, 48%)", "hsl(173, 58%, 39%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)", "hsl(340, 75%, 55%)"];

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setClients(res.data.data);
        
        const isAdmin = user?.role === "admin" || user?.role === "super-admin";
        if (isAdmin) {
          setSelectedClientId("all");
          fetchReports("all");
        } else if (res.data.data.length > 0) {
          const firstClientId = res.data.data[0].id;
          setSelectedClientId(firstClientId);
          fetchReports(firstClientId);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setLoading(false);
    }
  };

  const fetchReports = async (clientId?: string) => {
    try {
      setLoading(true);
      const url = clientId ? `/reports/summary?clientId=${clientId}` : "/reports/summary";
      const res = await api.get(url);
      setReportsData(res.data?.reports || null);
    } catch (err: any) {
      console.error("Failed to fetch reports:", err);
      toast.error(err.response?.data?.message || "Failed to load reports summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const handleExportCSV = async () => {
    const toastId = toast.loading("Generating CSV report...");
    try {
      const url = selectedClientId ? `/reports/export-csv?clientId=${selectedClientId}` : "/reports/export-csv";
      const response = await api.get(url, { responseType: "blob" });
      const urlObj = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlObj;
      link.setAttribute("download", `recruitment_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV report downloaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error("CSV Export error:", err);
      toast.error("Failed to export report CSV", { id: toastId });
    }
  };

  // Process data from backend
  const stats = reportsData?.statistics || {};
  const totalApps = stats.totalApplications ?? 120;
  const totalHired = stats.joined ?? 35;
  const conversionRate = stats.joiningRatio !== undefined ? `${stats.joiningRatio}%` : "17.5%";
  const dropoutRate = stats.dropoutRatio !== undefined ? `${stats.dropoutRatio}%` : "11.2%";

  // Leaders
  const recruiterData = reportsData?.recruiterPerformance?.length > 0
    ? reportsData.recruiterPerformance.map((r: any) => ({
        name: r.name,
        submissions: r.screened,
        hires: r.joined
      }))
    : defaultRecruiterPerformance;

  // Source distribution
  const sourceData = reportsData?.sourcePerformance?.length > 0
    ? reportsData.sourcePerformance.map((s: any) => ({
        name: s.source,
        value: s.count
      }))
    : [
        { name: "Direct Link", value: 45 },
        { name: "Jobmela Job Board", value: 30 },
        { name: "Referrals", value: 15 },
        { name: "Social Media", value: 10 }
      ];

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  return (
    <AppLayout 
      title="Reports & Analytics" 
      subtitle="Track recruitment performance and staff metrics"
      actions={
        <div className="flex items-center gap-2">
          {(clients.length > 0 || isAdmin) && (
            <Select value={selectedClientId} onValueChange={(val) => {
              setSelectedClientId(val);
              fetchReports(val);
            }}>
              <SelectTrigger className="h-8 w-[200px] text-xs">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {isAdmin && (
                  <SelectItem value="all">All Clients</SelectItem>
                )}
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Loading recruitment analytics...</p>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Applications" value={totalApps} change="Accumulated candidate profiles" changeType="neutral" icon={Users2} />
            <StatCard title="Total Hired" value={totalHired} change="Successfully joined duty" changeType="positive" icon={UserCheck} />
            <StatCard title="Conversion Rate" value={conversionRate} change="Applications to join ratio" changeType="positive" icon={TrendingUp} />
            <StatCard title="Dropout Rate" value={dropoutRate} change="Selected but did not join" changeType="negative" icon={Target} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Funnel Graph */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Hiring Funnel (All Time)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={defaultConversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 95%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="applied" stackId="1" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.15} name="Applied" />
                  <Area type="monotone" dataKey="screened" stackId="2" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.15} name="Screened" />
                  <Area type="monotone" dataKey="interviewed" stackId="3" stroke="hsl(173, 58%, 39%)" fill="hsl(173, 58%, 39%)" fillOpacity={0.15} name="Interviewed" />
                  <Area type="monotone" dataKey="hired" stackId="4" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%)" fillOpacity={0.15} name="Hired" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Candidate Sources Pie */}
            <Card className="p-4 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Candidate Acquisition Sources</h3>
              <div className="flex flex-col md:flex-row items-center justify-around gap-4 h-[260px]">
                <ResponsiveContainer width="50%" height="100%">
                  <RePieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 w-full md:w-1/2 px-2">
                  {sourceData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-muted-foreground truncate max-w-[120px]">{entry.name}</span>
                      </div>
                      <span className="font-semibold">{entry.value} profiles</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Recruiter Leaderboard */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Recruiter Lead & Hires Conversion</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={recruiterData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 95%)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="submissions" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} name="Assigned Profiles" />
                <Bar dataKey="hires" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} name="Successful Hires" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}

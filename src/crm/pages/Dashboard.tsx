import { useState } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { StatCard } from "@/crm/components/StatCard";
import { Card } from "@/crm/components/ui/card";
import { Badge } from "@/crm/components/ui/badge";
import { Button } from "@/crm/components/ui/button";
import { Users, Briefcase, Building2, TrendingUp, GraduationCap, UserCheck, Activity, Clock, RefreshCcw } from "lucide-react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { transformJobData } from "@/crm/lib/job-utils";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "Mon", applications: 12, hires: 2 },
  { day: "Tue", applications: 18, hires: 3 },
  { day: "Wed", applications: 15, hires: 1 },
  { day: "Thu", applications: 22, hires: 4 },
  { day: "Fri", applications: 28, hires: 5 },
  { day: "Sat", applications: 8, hires: 1 },
  { day: "Sun", applications: 5, hires: 0 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function formatRelativeTime(dateString: string) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const getActivityIcon = (action: string, details?: string) => {
  const act = `${action || ""} ${details || ""}`.toLowerCase();
  if (act.includes("candidate") || act.includes("lead") || act.includes("apply") || act.includes("applied")) {
    return Users;
  }
  if (act.includes("job") || act.includes("opening") || act.includes("vacancy")) {
    return Briefcase;
  }
  if (act.includes("client") || act.includes("company")) {
    return Building2;
  }
  return Activity;
};

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => (await api.get("/stats")).data,
  });

  const { data: dbJobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await api.get('/jobs');
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      return data.map(transformJobData);
    },
  });

  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ["clients-dashboard-data"],
    queryFn: async () => (await api.get("/clients")).data,
  });

  const { data: candidatesRes } = useQuery({
    queryKey: ["recentCandidates"],
    queryFn: async () => (await api.get("/candidates", { params: { limit: 5 } })).data,
  });

  const candidates = candidatesRes?.data || [];

  const [trendInterval, setTrendInterval] = useState<"today" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom">("weekly");
  
  const todayStr = new Date().toISOString().split("T")[0];
  const lastWeekStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(lastWeekStr);
  const [endDate, setEndDate] = useState(todayStr);

  const { data: registrationTrendRes, isLoading: isTrendLoading } = useQuery({
    queryKey: ["candidateRegistrationTrend", trendInterval, startDate, endDate],
    queryFn: async () => (await api.get("/stats/registration-trend", { 
      params: { 
        view: trendInterval,
        startDate: trendInterval === "custom" ? startDate : undefined,
        endDate: trendInterval === "custom" ? endDate : undefined
      } 
    })).data,
  });

  const registrationTrendData = registrationTrendRes?.data || [];

  if (isStatsLoading || isClientsLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <RefreshCcw className="h-10 w-10 text-primary/40" />
          </motion.div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing recruitment data...</p>
        </div>
      </AppLayout>
    );
  }

  const statsData = stats?.data || {};
  const totalCandidates = statsData?.totalCandidates || 0;
  const activeClients = statsData?.totalClients || 0;
  const joinedCandidates = statsData?.joinedCandidates || 0;
  const conversionRate = statsData?.conversionRate || 0;
  const openJobs = dbJobs.filter((j: any) => j.status === "open").length;
  const totalPositions = dbJobs.filter((j: any) => j.status === "open").reduce((acc: number, j: any) => acc + (j.openPositions || 0), 0);

  const weeklyChartData = statsData?.weeklyTrend?.length > 0
    ? statsData.weeklyTrend
    : [
        { day: "Mon", applications: 0, hires: 0 },
        { day: "Tue", applications: 0, hires: 0 },
        { day: "Wed", applications: 0, hires: 0 },
        { day: "Thu", applications: 0, hires: 0 },
        { day: "Fri", applications: 0, hires: 0 },
        { day: "Sat", applications: 0, hires: 0 },
        { day: "Sun", applications: 0, hires: 0 },
      ];

  const educationCounts = statsData?.education || [];
  const pipelineStats = statsData?.pipelineStats || [];

  const clientsList = clients?.data || [];
  const clientEligible = clientsList.map((client: any) => {
    const clientJobs = dbJobs.filter((j: any) => j.client_id === client.id && j.status === "open");
    const totalEligible = clientJobs.reduce((acc: number, j: any) => acc + (j.eligibleCount || 0), 0);
    return {
      client: client.company_name,
      eligible: totalEligible,
      activeJobs: clientJobs.length
    };
  }).filter((c: any) => c.activeJobs > 0).sort((a, b) => b.eligible - a.eligible).slice(0, 6);

  const recentActivities = statsData?.recentActivities || [];

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Overview of your recruitment pipeline"
      actions={
        <Button variant="ghost" size="sm" onClick={() => refetchStats()} className="text-[10px] h-8 gap-2 uppercase tracking-widest font-bold">
          <RefreshCcw className="h-3 w-3" /> Refresh
        </Button>
      }
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Candidates" value={totalCandidates.toLocaleString()} change="Across all sources" icon={Users} />
          <StatCard title="Open Openings" value={openJobs} change={`${totalPositions} positions`} icon={Briefcase} />
          <StatCard title="Active Clients" value={activeClients} change={`${clientsList.length} total`} icon={Building2} />
          <StatCard title="Conversion" value={`${conversionRate}%`} change={`${joinedCandidates} joined`} changeType="positive" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Application Trends
                </h3>
                <Badge variant="outline" className="text-[10px]">Weekly View</Badge>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="applications" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="hires" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Pipeline Summary */}
          <motion.div variants={item}>
            <Card className="p-6 border-none shadow-xl h-full bg-card">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Recruitment Funnel
              </h3>
              <div className="space-y-5">
                {pipelineStats.length > 0 ? pipelineStats.map((s: any) => (
                  <div key={s.stage} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="capitalize text-muted-foreground">{s.stage.replace('_', ' ')}</span>
                      <span>{s.count}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / (totalCandidates || 1)) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-xs">No pipeline data available</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Candidate Registration Trends */}
        <motion.div variants={item}>
          <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Candidate Registration Trends
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Visualize new candidate onboarding velocity</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {trendInterval === "custom" && (
                  <div className="flex items-center gap-2 bg-muted/20 p-1 rounded-xl border border-muted/30">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent text-[10px] font-bold text-foreground focus:outline-none px-2 py-1"
                    />
                    <span className="text-[10px] text-muted-foreground font-bold">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent text-[10px] font-bold text-foreground focus:outline-none px-2 py-1"
                    />
                  </div>
                )}
                
                <select
                  value={trendInterval}
                  onChange={(e) => setTrendInterval(e.target.value as any)}
                  className="bg-muted/40 hover:bg-muted/60 text-xs font-bold text-foreground px-3 py-1.5 rounded-xl border border-muted/50 focus:outline-none cursor-pointer capitalize"
                >
                  <option value="today" className="bg-background text-foreground">Today</option>
                  <option value="weekly" className="bg-background text-foreground">Weekly</option>
                  <option value="monthly" className="bg-background text-foreground">Monthly</option>
                  <option value="quarterly" className="bg-background text-foreground">Quarterly</option>
                  <option value="yearly" className="bg-background text-foreground">Yearly</option>
                  <option value="custom" className="bg-background text-foreground">Custom Range</option>
                </select>
              </div>
            </div>
            
            <div className="h-[260px] w-full relative">
              {isTrendLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCcw className="h-6 w-6 text-primary/30 animate-spin" />
                </div>
              ) : registrationTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationTrendData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="count" name="Registrations" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground opacity-50 italic">
                  No registration data for this range
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Education Breakdown */}
          <motion.div variants={item}>
            <Card className="p-5 border-none shadow-xl h-full">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Education Split
              </h3>
              <div className="space-y-3">
                {educationCounts.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="text-sm font-black text-primary">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Client Eligible */}
          <motion.div variants={item}>
            <Card className="p-5 border-none shadow-xl h-full">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" /> Top Client Pools
              </h3>
              <div className="space-y-3">
                {clientEligible.length > 0 ? clientEligible.map((item: any) => (
                  <div key={item.client} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                    <div>
                      <p className="text-xs font-semibold">{item.client}</p>
                      <p className="text-[10px] text-muted-foreground">{item.activeJobs} jobs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{item.eligible}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">eligible</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-50 italic text-xs">No active clients</div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item}>
            <Card className="p-5 border-none shadow-xl h-full">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((a: any, i: number) => {
                    const Icon = getActivityIcon(a.action, a.details);
                    return (
                      <div key={a.id || i} className="flex items-start gap-3 group">
                        <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-4 w-4 text-primary/60" />
                        </div>
                        <div className="flex-1 min-w-0 border-b border-muted pb-3 group-last:border-0 group-last:pb-0">
                          <p className="text-xs font-semibold leading-normal mb-1">
                            {a.action}
                            {a.details && (
                              <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">{a.details}</span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> {formatRelativeTime(a.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 opacity-50 italic text-xs">
                    No recent activity logged
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Candidates Table-style view */}
        <motion.div variants={item}>
          <Card className="p-6 border-none shadow-xl overflow-hidden bg-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Recently Added Candidates
              </h3>
              <Badge className="bg-primary/10 text-primary border-none text-[10px] px-2 py-0.5">Real-time Feed</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {candidates.length > 0 ? candidates.map((c: any) => (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -5 }}
                  className="p-4 bg-muted/10 rounded-2xl border border-muted/30 hover:border-primary/30 transition-all text-center space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                      {(c.fullName || "U").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-sm">{c.fullName || c.name}</p>
                      <p className="text-[10px] font-medium text-muted-foreground">{c.email || 'HIDDEN@SYSTEM.IO'}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] h-5 capitalize px-1.5 bg-white border-muted">
                    {(c.status || 'new').toString().replace('_', ' ')}
                  </Badge>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center opacity-30 italic text-sm">Waiting for new candidates...</div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}

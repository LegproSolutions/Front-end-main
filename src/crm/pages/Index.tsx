import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { 
  Users, 
  Building2, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  History,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { api } from "@/crm/lib/api";
import { Skeleton } from "@/crm/components/ui/skeleton";

const chartData = [
  { name: "Mon", candidates: 12, placements: 2 },
  { name: "Tue", candidates: 18, placements: 4 },
  { name: "Wed", candidates: 15, placements: 3 },
  { name: "Thu", candidates: 25, placements: 7 },
  { name: "Fri", candidates: 32, placements: 8 },
  { name: "Sat", candidates: 10, placements: 1 },
  { name: "Sun", candidates: 5, placements: 0 },
];

const sourceData = [
  { name: "Referral", value: 45, color: "#8B5CF6" },
  { name: "Direct", value: 30, color: "#3B82F6" },
  { name: "LinkedIn", value: 15, color: "#10B981" },
  { name: "JobMela", value: 10, color: "#F59E0B" },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    }
  });

  return (
    <AppLayout title="Dashboard" subtitle="Overview of your staffing operations">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Candidates" 
            value={stats?.totalCandidates} 
            loading={statsLoading}
            icon={<Users className="h-5 w-5 text-blue-500" />}
            trend="+12% from last month"
            trendType="up"
            gradient="from-blue-500/10 to-transparent"
          />
          <StatCard 
            title="Active Clients" 
            value={stats?.activeClients} 
            loading={statsLoading}
            icon={<Building2 className="h-5 w-5 text-purple-500" />}
            trend="+2 new this week"
            trendType="up"
            gradient="from-purple-500/10 to-transparent"
          />
          <StatCard 
            title="Total Placements" 
            value={stats?.joinedCandidates} 
            loading={statsLoading}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            trend="+5% from last month"
            trendType="up"
            gradient="from-emerald-500/10 to-transparent"
          />
          <StatCard 
            title="Conversion Rate" 
            value={`${stats?.conversionRate}%`} 
            loading={statsLoading}
            icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
            trend="-2% from last week"
            trendType="down"
            gradient="from-amber-500/10 to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Activity Overview
                </h3>
                <p className="text-xs text-muted-foreground">Weekly candidate flow and success metrics</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] text-muted-foreground">Candidates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">Placements</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPlac" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '11px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="candidates" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCand)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="placements" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPlac)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                Candidate Sources
              </h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      width={70}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {sourceData.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] text-muted-foreground">{s.name} ({s.value}%)</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <History className="h-4 w-4 text-blue-500" />
                Recent Activity
              </h3>
              <RecentActivity />
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButton icon={<Users className="h-3.5 w-3.5" />} label="Add Candidate" />
                <QuickActionButton icon={<Building2 className="h-3.5 w-3.5" />} label="Add Client" />
                <QuickActionButton icon={<Briefcase className="h-3.5 w-3.5" />} label="Post Job" />
                <QuickActionButton icon={<TrendingUp className="h-3.5 w-3.5" />} label="Reports" />
              </div>
            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const res = await api.get('/activity/recent');
      return res.data;
    }
  });

  if (isLoading) return <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;

  return (
    <div className="space-y-4">
      {activities.length > 0 ? activities.map((a: any) => (
        <div key={a.id} className="flex gap-3 relative pb-4 last:pb-0">
          <div className="absolute left-[11px] top-6 bottom-0 w-px bg-muted last:hidden" />
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative z-10">
            <Activity className="h-3 w-3 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-medium leading-tight">{a.action.replace(/_/g, ' ')}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {a.user?.name || 'System'} • {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )) : (
        <p className="text-[10px] text-muted-foreground text-center py-4">No recent activity</p>
      )}
    </div>
  );
}

function StatCard({ title, value, loading, icon, trend, trendType, gradient }: any) {
  return (
    <Card className="p-4 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <div className="relative z-10 flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg bg-white/80 shadow-sm">
          {icon}
        </div>
        {loading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <div className={`flex items-center gap-0.5 text-[10px] font-medium ${trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trendType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-16 mt-1" />
        ) : (
          <h2 className="text-2xl font-bold tracking-tight mt-1">{value}</h2>
        )}
      </div>
    </Card>
  );
}

function QuickActionButton({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20 gap-2">
      <div className="p-1.5 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

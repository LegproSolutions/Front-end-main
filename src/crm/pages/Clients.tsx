import { useState } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { Label } from "@/crm/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/crm/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/crm/components/ui/table";
import { Plus, Search, Building2, Pencil, MoreVertical, MapPin, Mail, Phone, Briefcase, RefreshCw, Sparkles, User, ExternalLink } from "lucide-react";
import { Badge } from "@/crm/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/crm/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/crm/lib/utils";

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  activeJobs: number;
  totalHires: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const emptyClient = (): Partial<Client> => ({
  name: "", industry: "", contactPerson: "", email: "", phone: "", location: "", activeJobs: 0, totalHires: 0,
});

export default function Clients() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Client>>(emptyClient());
  const navigate = useNavigate();

  const { data: clientList = [], isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get('/clients');
      const rawData = res?.data?.data || res?.data || [];
      const dataArray = Array.isArray(rawData) ? rawData : [];
      
      return dataArray.map((c: any) => ({
        id: c.id,
        name: c.company_name || "Unknown Company",
        industry: c.industry || "General",
        contactPerson: c.contact_person || "N/A",
        email: c.email || '',
        phone: c.phone || '',
        location: c.location || '',
        activeJobs: c._count?.pipelines || 0,
        totalHires: c._count?.candidates || 0,
      }));
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const filtered = clientList.filter((c: Client) =>
    (c.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (c.industry?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const openAdd = () => {
    setDraft(emptyClient());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!draft.name || !draft.industry) {
      toast.error("Company name and industry are required.");
      return;
    }
    try {
      if (draft.id) {
        await api.put(`/clients/${draft.id}`, {
          company_name: draft.name,
          industry: draft.industry,
          contact_person: draft.contactPerson || "",
          email: draft.email || "",
          phone: draft.phone || "",
          location: draft.location || "",
        });
        toast.success("Client updated!");
      } else {
        await api.post('/clients', {
          company_name: draft.name,
          industry: draft.industry,
          contact_person: draft.contactPerson || "",
          email: draft.email || "",
          phone: draft.phone || "",
          location: draft.location || "",
        });
        toast.success("Client added!");
      }
      setDialogOpen(false);
      refetch();
    } catch (e) {
      toast.error(draft.id ? "Failed to update client." : "Failed to add client.");
    }
  };

  const openEdit = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation();
    setDraft({ ...client });
    setDialogOpen(true);
  };

  return (
    <AppLayout
      title="Key Clients"
      subtitle="Strategic Enterprise Partners"
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest h-9 rounded-full px-4" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isRefetching ? 'animate-spin' : ''}`} /> Sync
          </Button>
          <Button size="sm" className="text-[10px] font-black uppercase tracking-widest h-9 rounded-full px-5 shadow-lg shadow-primary/20" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Partner
          </Button>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border-none shadow-xl p-4 bg-gradient-to-r from-card to-primary/5"
        >
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
            <Input
              placeholder="Search enterprise database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-11 text-xs border-none bg-muted/50 rounded-xl shadow-inner focus-visible:ring-primary/20"
            />
          </div>
        </motion.div>

        <Card className="border-none shadow-2xl overflow-hidden bg-card/80 backdrop-blur-sm rounded-2xl">
          <div className="p-4 border-b border-primary/5 flex items-center justify-between bg-primary/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Partner Directory
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Enterprise Partner</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 hidden md:table-cell">Industrial Vertical</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 hidden lg:table-cell">Key Contact</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 hidden lg:table-cell text-center">Location</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-center">Pipeline</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-center">Engagement</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {isLoading && !isRefetching ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="h-8 w-8 animate-spin text-primary/20" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Authenticating Access...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Building2 className="h-10 w-10 text-muted-foreground/20" />
                          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">No Partners Found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c: Client) => (
                      <TableRow 
                        key={c.id} 
                        className="cursor-pointer hover:bg-primary/[0.02] border-primary/5 transition-all group" 
                        onClick={() => navigate(`/dashboard/crm/clients/${c.id}`)}
                      >
                        <TableCell className="py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5">
                              <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-black group-hover:text-primary transition-colors">{c.name}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium mt-0.5">
                                <Mail size={10} /> {c.email || 'partner-sync@system.io'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 hidden md:table-cell">
                          <Badge variant="ghost" className="text-[10px] font-black uppercase tracking-widest bg-muted/50 rounded-lg px-2">
                            {c.industry}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-5 hidden lg:table-cell">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-card-foreground flex items-center gap-1.5"><User size={12} className="text-primary/60" /> {c.contactPerson}</p>
                            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5"><Phone size={10} /> {c.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 hidden lg:table-cell text-center">
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            <MapPin size={12} className="text-primary" /> {c.location || 'Global'}
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-sm font-black tracking-tight",
                              c.activeJobs > 0 ? "text-primary" : "text-muted-foreground/40"
                            )}>
                              {c.activeJobs}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Jobs</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-sm font-black tracking-tight",
                              c.totalHires > 0 ? "text-primary" : "text-muted-foreground/40"
                            )}>
                              {c.totalHires}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Hires</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl">
                              <DropdownMenuItem onClick={(e) => openEdit(e, c)} className="text-xs font-bold gap-2 py-2.5">
                                <Pencil className="h-3.5 w-3.5 text-primary" /> Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/crm/clients/${c.id}`)} className="text-xs font-bold gap-2 py-2.5">
                                <ExternalLink className="h-3.5 w-3.5 text-success" /> Engagement View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-0 border-none shadow-2xl rounded-3xl overflow-hidden">
          <DialogHeader className="p-8 bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5">
            <DialogTitle className="text-xl font-black flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                {draft.id ? <Pencil className="h-5 w-5" /> : <Plus className="h-6 w-6" />}
              </div>
              {draft.id ? "Optimize Partner Profile" : "Strategic Partner Inbound"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form to add or edit client partner profiles including entity name, industry, and contact details.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity Name *</Label>
                <Input className="h-11 text-xs border-none bg-muted/50 rounded-xl" value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Global Enterprise Inc." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vertical / Industry *</Label>
                <Input className="h-11 text-xs border-none bg-muted/50 rounded-xl" value={draft.industry || ""} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} placeholder="Aerospace & Defense" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Liaison</Label>
                <Input className="h-11 text-xs border-none bg-muted/50 rounded-xl" value={draft.contactPerson || ""} onChange={(e) => setDraft({ ...draft, contactPerson: e.target.value })} placeholder="Executive Name" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secure Channel</Label>
                <Input className="h-11 text-xs border-none bg-muted/50 rounded-xl" value={draft.phone || ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Endpoint</Label>
                <Input type="email" className="h-11 text-xs border-none bg-muted/50 rounded-xl" value={draft.email || ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="liaison@enterprise.com" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Geographic Hub</Label>
                <Input className="h-11 text-xs border-none bg-muted/50 rounded-xl" value={draft.location || ""} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="City, Country" />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t border-primary/5 gap-3">
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest rounded-xl px-8 h-12" onClick={() => setDialogOpen(false)}>Abort</Button>
            <Button className="text-xs font-black uppercase tracking-widest rounded-xl px-12 h-12 shadow-xl shadow-primary/20" onClick={handleSave}>
              {draft.id ? "Synchronize" : "Register Partner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

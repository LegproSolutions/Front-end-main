import { useState, useMemo, useRef, useEffect } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import CandidateFilters from "@/crm/components/candidates/CandidateFilters";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/crm/components/ui/table";
import { Badge } from "@/crm/components/ui/badge";
import { Button } from "@/crm/components/ui/button";
import {
  Download, Upload, FileDown, SearchX, MapPin, RefreshCcw, Globe, Phone, Briefcase, AlertCircle, GraduationCap, Calendar,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet, Sparkles, Wrench, User, Activity, Clipboard
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { formatExcelDate, calculateAge } from "@/crm/lib/date-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/crm/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/crm/components/ui/tabs";
import { Input } from "@/crm/components/ui/input";
import { Label } from "@/crm/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";
import { Pencil, Loader2, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/crm/components/ui/alert";
import { educationOptions, sourceOptions, stateDistricts, tradesList } from "@/crm/lib/sample-data";
import { transformCandidateData } from "@/crm/lib/candidate-utils";
import { Card } from "@/crm/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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

export interface Candidate {
  id: string;
  fullName: string;
  education: string;
  email: string | null;
  phone: string;
  alternatePhone?: string | null;
  state: string;
  district: string;
  age: number;
  dob: string;
  trades: string;
  experience: string;
  source: string;
  gender: string;
  isDeleted: boolean;
}

export default function Candidates() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [filters, setFilters] = useState<any>({});
  const [isBulkExportOpen, setIsBulkExportOpen] = useState(false);
  const [exportRange, setExportRange] = useState({ start: 1, end: 1 });

  const { data: responseData, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["candidates", currentPage, pageSize, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...Object.fromEntries(
          Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
        )
      });
      const res = await api.get(`/candidates?${params.toString()}`);
      return res.data;
    },
    staleTime: 5000,
    refetchOnMount: true,
  });

  const dbCandidates = useMemo(() => {
    const rawData = responseData?.data || [];
    return Array.isArray(rawData) ? rawData.map(transformCandidateData) : [];
  }, [responseData]);

  const totalCandidates = responseData?.total || 0;
  const totalPages = responseData?.totalPages || 0;
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation({
    mutationFn: async (updated: Candidate) => {
      const payload = {
        name: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        alternatePhone: updated.alternatePhone,
        education: updated.education,
        trades: updated.trades,
        state: updated.state,
        district: updated.district,
        source: updated.source,
        dob: updated.dob,
        gender: updated.gender,
        experience: updated.experience,
        city: (updated as any).city,
        currentIndustry: (updated as any).currentIndustry,
        preferredLocation: (updated as any).preferredLocation,
        interestStatus: (updated as any).interestStatus,
        joiningAvailability: (updated as any).joiningAvailability,
        salaryExpectation: (updated as any).salaryExpectation,
        followUpNotes: (updated as any).followUpNotes,
        status: (updated as any).status
      };
      return await api.put(`/candidates/${updated.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast.success("Candidate updated successfully");
      setIsEditDialogOpen(false);
      setEditingCandidate(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update candidate");
    }
  });

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate({ ...candidate });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingCandidate) {
      updateMutation.mutate(editingCandidate);
    }
  };

  const filteredCandidates = dbCandidates;

  const handleBulkExport = async () => {
    try {
      toast.info(`Exporting pages ${exportRange.start} to ${exportRange.end}...`);
      setIsBulkExportOpen(false);

      let allExportData: any[] = [];

      for (let p = exportRange.start; p <= exportRange.end; p++) {
        const params = new URLSearchParams({
          page: p.toString(),
          limit: pageSize.toString(),
          ...Object.fromEntries(
            Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
          )
        });
        const res = await api.get(`/candidates?${params.toString()}`);
        const pageData = res.data?.data || [];

        const transformed = pageData.map(transformCandidateData).map((c: any) => ({
          Fullname: c.fullName,
          Email: c.email,
          Phone: c.phone,
          Education: c.education,
          Trade: c.trades,
          State: c.state,
          District: c.district,
          Source: c.source,
          Gender: c.gender,
          Dob: c.dob
        }));

        allExportData = [...allExportData, ...transformed];
      }

      if (allExportData.length === 0) {
        toast.error("No data found in selected range.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(allExportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      XLSX.writeFile(workbook, `Candidates_Export_P${exportRange.start}-${exportRange.end}.xlsx`);
      toast.success(`Exported ${allExportData.length} records!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export data.");
    }
  };

  const downloadSample = () => {
    const sampleData = [{
      Fullname: "Rahul Kumar",
      Email: "rahul@example.com",
      Phone: "9876543210",
      Education: "ITI",
      Trade: "Electrician",
      State: "Rajasthan",
      District: "Ajmer",
      Source: "Campus",
      Gender: "Male",
      Dob: "15-06-1993"
    }];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample_Format");
    XLSX.writeFile(workbook, "Candidate_Sample_Format.xlsx");
    toast.success("Sample format downloaded!");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        toast.info("Processing file...");
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!Array.isArray(json) || json.length === 0) {
          toast.error("No data found in file.");
          return;
        }

        const res = await api.post('/candidates/bulk-json', json);
        refetch();
        toast.success(`Imported ${res.data.count} candidates! ${res.data.skipped} skipped (duplicates).`);
      } catch (error: any) {
        console.error("Bulk upload error:", error);
        toast.error("Failed to process file. Ensure format is correct.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <AppLayout
      title="Candidate Hub"
      subtitle={`${totalCandidates.toLocaleString()} qualified profiles in database`}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
          <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-bold uppercase tracking-widest h-9" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCcw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-[10px] font-bold uppercase tracking-widest h-9 border-none bg-muted/50" onClick={downloadSample}>
            <FileDown className="h-3.5 w-3.5" /> Sample
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-[10px] font-bold uppercase tracking-widest h-9 border-none bg-muted/50" onClick={() => setIsBulkExportOpen(true)}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" className="gap-2 text-[10px] font-bold uppercase tracking-widest h-9 shadow-lg shadow-primary/20" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" /> Import Data
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <CandidateFilters activeFilters={filters} onFilterChange={setFilters} />

        {isError && (
          <Alert variant="destructive" className="border-none shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              We couldn't reach the database. {(error as any)?.message || "Please check your network."}
              <Button variant="link" className="h-auto p-0 ml-2 text-destructive underline" onClick={() => refetch()}>Try again</Button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <div className="p-4 border-b border-primary/5 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
            <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter">
              <Sparkles className="h-4 w-4 text-primary" />
              Talent Pool
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-none">
                {totalCandidates} records
              </Badge>
            </h3>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Candidate</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Contact Info</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Gender</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Education & Trades</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Location</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Channel</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {isLoading && !isRefetching ? (
                    <TableRow key="loading">
                      <TableCell colSpan={7} className="h-[400px] text-center">
                        <div className="flex flex-col items-center gap-4">
                          <motion.div
                             animate={{ rotate: 360 }}
                             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <RefreshCcw className="h-10 w-10 text-primary/20" />
                          </motion.div>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Syncing with server...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : dbCandidates.length > 0 ? (
                    dbCandidates.map((c: Candidate & { alternatePhone?: string, location: string }, index: number) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: Math.min(index * 0.02, 0.5) }}
                        className="hover:bg-primary/[0.02] transition-all border-b border-primary/[0.02] group"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center text-xs font-black shadow-inner border border-primary/10 shrink-0">
                              {c.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black group-hover:text-primary transition-colors leading-tight truncate">{c.fullName}</p>
                              <p className="text-[10px] text-muted-foreground font-medium truncate">{c.email || 'no-email@system.com'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-primary whitespace-nowrap">
                              <Phone size={12} className="shrink-0" />
                              {c.phone}
                            </div>
                            {c.alternatePhone && (
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                                <Phone size={10} className="shrink-0 text-muted-foreground/70" />
                                Alt: {c.alternatePhone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-semibold whitespace-nowrap">
                          {c.gender}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-foreground leading-tight">{c.education}</div>
                            <div className="text-[10px] text-muted-foreground leading-tight">{c.trades}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground whitespace-nowrap">
                            <MapPin size={12} className="text-primary shrink-0" />
                            {c.location}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-none bg-accent text-accent-foreground px-2 py-1 rounded-lg whitespace-nowrap">
                            {c.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={() => handleEditClick(c)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow key="no-results">
                      <TableCell colSpan={7} className="h-[400px] text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="p-6 bg-muted/20 rounded-3xl border border-dashed border-primary/20">
                            <SearchX size={48} className="text-primary/20" />
                          </div>
                          <div className="max-w-[300px]">
                            <h3 className="text-lg font-black uppercase tracking-tighter">No Talent Found</h3>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                              We couldn't find any candidates matching your criteria. Try adjusting your filters or importing new data.
                            </p>
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold uppercase tracking-widest" onClick={() => setFilters({})}>Reset Filters</Button>
                            <Button size="sm" className="rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => fileInputRef.current?.click()}>
                              Import CSV
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-3 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[100, 500, 1000].map(size => (
                  <SelectItem key={size} value={size.toString()} className="text-xs">{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-2">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCandidates)} of {totalCandidates}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </Button>

            <div className="flex items-center px-3 h-8 bg-muted/50 rounded-md text-xs font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Export Dialog */}
      <Dialog open={isBulkExportOpen} onOpenChange={setIsBulkExportOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-success" />
              Bulk Export Data
            </DialogTitle>
            <DialogDescription className="sr-only">
              Export candidate data to Excel in batches.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
              You are exporting data in batches of <strong>{pageSize}</strong> records. Select the range of pages you want to download.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Start Page</Label>
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={exportRange.start}
                  onChange={(e) => setExportRange({ ...exportRange, start: Math.max(1, Number(e.target.value)) })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">End Page</Label>
                <Input
                  type="number"
                  min={exportRange.start}
                  max={totalPages}
                  value={exportRange.end}
                  onChange={(e) => setExportRange({ ...exportRange, end: Math.min(totalPages, Math.max(exportRange.start, Number(e.target.value))) })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground px-1">
              Total records to be exported: <strong>{Math.max(0, (exportRange.end - exportRange.start + 1) * pageSize)}</strong>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsBulkExportOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleBulkExport} className="gap-2">
              <Download className="h-4 w-4" /> Start Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Edit Candidate Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Update the information for the selected candidate.
            </DialogDescription>
          </DialogHeader>

          {editingCandidate && (
            <Tabs defaultValue="personal" className="w-full mt-2">
              <TabsList className="grid grid-cols-4 mb-6 bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="personal" className="text-xs gap-1.5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                  <User className="h-3.5 w-3.5 text-primary" /> Personal
                </TabsTrigger>
                <TabsTrigger value="education" className="text-xs gap-1.5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" /> Edu & Exp
                </TabsTrigger>
                <TabsTrigger value="location" className="text-xs gap-1.5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Location & Source
                </TabsTrigger>
                <TabsTrigger value="recruitment" className="text-xs gap-1.5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                  <Clipboard className="h-3.5 w-3.5 text-primary" /> Recruitment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Full Name</Label>
                    <Input className="h-9 text-xs" value={editingCandidate.fullName} onChange={(e) => setEditingCandidate({ ...editingCandidate, fullName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Primary Phone Number</Label>
                    <Input className="h-9 text-xs" value={editingCandidate.phone} onChange={(e) => setEditingCandidate({ ...editingCandidate, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Alternate Phone Number</Label>
                    <Input className="h-9 text-xs" value={editingCandidate.alternatePhone || ''} onChange={(e) => setEditingCandidate({ ...editingCandidate, alternatePhone: e.target.value })} placeholder="Enter alternate contact number" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Email Address</Label>
                    <Input className="h-9 text-xs" value={editingCandidate.email || ''} onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Gender</Label>
                    <Select value={editingCandidate.gender} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, gender: v })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Male", "Female", "Other", "Not Specified"].map(g => <SelectItem key={g} value={g} className="text-xs">{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Date of Birth (DD-MM-YYYY)</Label>
                    <Input className="h-9 text-xs" value={editingCandidate.dob} onChange={(e) => setEditingCandidate({ ...editingCandidate, dob: e.target.value })} placeholder="15-06-1993" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Education / Qualification</Label>
                    <Select value={editingCandidate.education} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, education: v })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Education" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationOptions.map(edu => <SelectItem key={edu} value={edu} className="text-xs">{edu}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Experience Type</Label>
                    <Select 
                      value={editingCandidate.experience === "0" || editingCandidate.experience?.toLowerCase() === "fresher" ? "fresher" : "experienced"} 
                      onValueChange={(v) => {
                        setEditingCandidate({ 
                          ...editingCandidate, 
                          experience: v === "fresher" ? "0" : "1" 
                        });
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Experience Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher" className="text-xs">Fresher</SelectItem>
                        <SelectItem value="experienced" className="text-xs">Experienced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {editingCandidate.experience !== "0" && editingCandidate.experience?.toLowerCase() !== "fresher" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Total Experience (Years)</Label>
                      <Input className="h-9 text-xs" type="number" min={1} value={editingCandidate.experience} onChange={(e) => setEditingCandidate({ ...editingCandidate, experience: e.target.value })} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Current Industry</Label>
                    <Input className="h-9 text-xs" value={(editingCandidate as any).currentIndustry || ''} onChange={(e) => setEditingCandidate({ ...editingCandidate, currentIndustry: e.target.value } as any)} placeholder="e.g. Manufacturing, IT" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-semibold">Trade / Skills / Specialization</Label>
                    <Select value={editingCandidate.trades} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, trades: v })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Trade / Skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradesList.map(trade => <SelectItem key={trade} value={trade} className="text-xs">{trade}</SelectItem>)}
                        {!tradesList.includes(editingCandidate.trades) && editingCandidate.trades && (
                          <SelectItem value={editingCandidate.trades} className="text-xs italic">{editingCandidate.trades}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">State</Label>
                    <Select value={editingCandidate.state} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, state: v, district: '' })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(stateDistricts).map(state => <SelectItem key={state} value={state} className="text-xs">{state}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">District</Label>
                    <Select value={editingCandidate.district} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, district: v })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {(stateDistricts[editingCandidate.state] || []).map(dist => <SelectItem key={dist} value={dist} className="text-xs">{dist}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Current City</Label>
                    <Input className="h-9 text-xs" value={(editingCandidate as any).city || ''} onChange={(e) => setEditingCandidate({ ...editingCandidate, city: e.target.value } as any)} placeholder="e.g. Noida, Pune" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Source / Channel</Label>
                    <Select value={editingCandidate.source} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, source: v })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map(src => <SelectItem key={src} value={src} className="text-xs">{src}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recruitment" className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Candidate Status</Label>
                    <Select value={editingCandidate.status} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, status: v })}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([val, label]) => (
                          <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Interest Status</Label>
                    <Select value={(editingCandidate as any).interestStatus || ''} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, interestStatus: v } as any)}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interested" className="text-xs">Interested</SelectItem>
                        <SelectItem value="Not Interested" className="text-xs">Not Interested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Available for Joining</Label>
                    <Select value={(editingCandidate as any).joiningAvailability || ''} onValueChange={(v) => setEditingCandidate({ ...editingCandidate, joiningAvailability: v } as any)}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate" className="text-xs">Immediate</SelectItem>
                        <SelectItem value="15 Days" className="text-xs">15 Days</SelectItem>
                        <SelectItem value="30 Days" className="text-xs">30 Days</SelectItem>
                        <SelectItem value="60 Days" className="text-xs">60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Expected Salary</Label>
                    <Input className="h-9 text-xs" value={(editingCandidate as any).salaryExpectation || ''} onChange={(e) => setEditingCandidate({ ...editingCandidate, salaryExpectation: e.target.value } as any)} placeholder="e.g. 2.5 LPA" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-semibold">Preferred Location</Label>
                    <Input className="h-9 text-xs" value={(editingCandidate as any).preferredLocation || ''} onChange={(e) => setEditingCandidate({ ...editingCandidate, preferredLocation: e.target.value } as any)} placeholder="e.g. Delhi NCR, Bangalore" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-semibold">Remarks / Notes</Label>
                    <textarea 
                      className="w-full text-xs p-2.5 bg-background border border-input rounded-md h-20 focus:outline-none focus:ring-1 focus:ring-primary" 
                      value={(editingCandidate as any).followUpNotes || ''} 
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, followUpNotes: e.target.value } as any)} 
                      placeholder="Add recruiter remarks..." 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="text-xs gap-1.5" onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

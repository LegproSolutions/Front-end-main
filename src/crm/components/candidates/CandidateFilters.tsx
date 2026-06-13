import React from 'react';
import {
  Filter,
  GraduationCap,
  MapPin,
  Wrench,
  X,
  ChevronDown,
  Globe,
  User,
  Sparkles,
  Activity
} from 'lucide-react';
// import { Input } from "@/crm/components/ui/input";
import { Label } from "@/crm/components/ui/label";
import { Slider } from "@/crm/components/ui/slider";
import { Badge } from "@/crm/components/ui/badge";
import { Button } from "@/crm/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/crm/components/ui/popover";
import { Checkbox } from "@/crm/components/ui/checkbox";
import { stateDistricts, tradesList, educationOptions, sourceOptions, genderOptions, clientPipelineStages } from '@/crm/lib/sample-data';
import { cn } from '@/crm/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CandidateFiltersProps {
  activeFilters: any;
  onFilterChange: (filters: any) => void;
}

const CandidateFilters = ({ activeFilters, onFilterChange }: CandidateFiltersProps) => {
  const [localFilters, setLocalFilters] = React.useState(activeFilters);

  // Sync local filters when activeFilters change (e.g. from external reset)
  React.useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const selectedStates = localFilters.states || [];
  const selectedDistricts = localFilters.districts || [];
  const selectedTrades = localFilters.trades || [];
  const selectedEducation = localFilters.education || [];
  const selectedSources = localFilters.sources || [];
  const selectedGenders = localFilters.genders || [];
  const selectedStatuses = localFilters.statuses || [];

  const availableDistricts = React.useMemo(() => {
    return selectedStates.flatMap((state: string) => stateDistricts[state] || []);
  }, [selectedStates]);

  const toggleState = (state: string) => {
    const newStates = selectedStates.includes(state)
      ? selectedStates.filter((s: string) => s !== state)
      : [...selectedStates, state];
    const newDistricts = selectedDistricts.filter((d: string) =>
      newStates.some((s: string) => stateDistricts[s]?.includes(d))
    );
    setLocalFilters({ ...localFilters, states: newStates, districts: newDistricts });
  };

  const toggleDistrict = (district: string) => {
    const newDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d: string) => d !== district)
      : [...selectedDistricts, district];
    setLocalFilters({ ...localFilters, districts: newDistricts });
  };

  const toggleTrade = (trade: string) => {
    const newTrades = selectedTrades.includes(trade)
      ? selectedTrades.filter((t: string) => t !== trade)
      : [...selectedTrades, trade];
    setLocalFilters({ ...localFilters, trades: newTrades });
  };

  const toggleEducation = (edu: string) => {
    const newEducation = selectedEducation.includes(edu)
      ? selectedEducation.filter((e: string) => e !== edu)
      : [...selectedEducation, edu];
    setLocalFilters({ ...localFilters, education: newEducation });
  };

  const toggleSource = (source: string) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter((s: string) => s !== source)
      : [...selectedSources, source];
    setLocalFilters({ ...localFilters, sources: newSources });
  };

  const toggleGender = (gender: string) => {
    const newGenders = selectedGenders.includes(gender)
      ? selectedGenders.filter((g: string) => g !== gender)
      : [...selectedGenders, gender];
    setLocalFilters({ ...localFilters, genders: newGenders });
  };

  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s: string) => s !== status)
      : [...selectedStatuses, status];
    setLocalFilters({ ...localFilters, statuses: newStatuses });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const isAgeFiltered = localFilters.ageRange && (localFilters.ageRange[0] !== 18 || localFilters.ageRange[1] !== 60);
  const hasActiveFilters = selectedStates.length > 0 || selectedDistricts.length > 0 || selectedTrades.length > 0 || selectedEducation.length > 0 || selectedSources.length > 0 || selectedGenders.length > 0 || selectedStatuses.length > 0 || localFilters.search || isAgeFiltered;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border-none shadow-xl p-5 bg-gradient-to-br from-card to-muted/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg shadow-inner">
            <Filter size={14} className="text-primary" />
          </div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Smart Filtering</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[10px] h-7 px-2 text-primary font-bold hover:bg-primary/10 rounded-full"
            >
              <X size={12} className="mr-1" />
              RESET
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleApply}
            className="text-[10px] h-8 px-4 bg-primary font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Sparkles size={12} className="mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Horizontal Filter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3 items-start">
        {/* Districts */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Districts</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner"
                disabled={selectedStates.length === 0}
              >
                <span className="truncate flex items-center gap-1.5">
                  <MapPin size={11} className="text-primary/60" />
                  {selectedDistricts.length > 0 ? `${selectedDistricts.length}` : (selectedStates.length === 0 ? "Select State" : "All Districts")}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                {availableDistricts.length > 0 ? (
                  availableDistricts.map((district: string) => (
                    <div
                      key={district}
                      className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedDistricts.includes(district) && "bg-primary/5")}
                      onClick={() => toggleDistrict(district)}
                    >
                      <Checkbox checked={selectedDistricts.includes(district)} className="rounded-sm border-primary/20" />
                      <span className="text-xs font-medium">{district}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                    Select a state to view districts
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* States */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">States</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner">
                <span className="truncate flex items-center gap-1.5">
                  <MapPin size={11} className="text-primary/60" />
                  {selectedStates.length > 0 ? `${selectedStates.length}` : "Everywhere"}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                {Object.keys(stateDistricts).map((state) => (
                  <div
                    key={state}
                    className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedStates.includes(state) && "bg-primary/5")}
                    onClick={() => toggleState(state)}
                  >
                    <Checkbox checked={selectedStates.includes(state)} className="rounded-sm border-primary/20" />
                    <span className="text-xs font-medium">{state}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Statuses */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Status</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner">
                <span className="truncate flex items-center gap-1.5">
                  <Activity size={11} className="text-primary/60" />
                  {selectedStatuses.length > 0 ? `${selectedStatuses.length}` : "All"}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                {clientPipelineStages.map((status) => (
                  <div
                    key={status}
                    className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedStatuses.includes(status) && "bg-primary/5")}
                    onClick={() => toggleStatus(status)}
                  >
                    <Checkbox checked={selectedStatuses.includes(status)} className="rounded-sm border-primary/20" />
                    <span className="text-xs font-medium capitalize">{status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Education */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Education</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner">
                <span className="truncate flex items-center gap-1.5">
                  <GraduationCap size={11} className="text-primary/60" />
                  {selectedEducation.length > 0 ? `${selectedEducation.length}` : "All"}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                {educationOptions.map((edu) => (
                  <div
                    key={edu}
                    className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedEducation.includes(edu) && "bg-primary/5")}
                    onClick={() => toggleEducation(edu)}
                  >
                    <Checkbox checked={selectedEducation.includes(edu)} className="rounded-sm border-primary/20" />
                    <span className="text-xs font-medium">{edu}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Trades */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Trades</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner">
                <span className="truncate flex items-center gap-1.5">
                  <Wrench size={11} className="text-primary/60" />
                  {selectedTrades.length > 0 ? `${selectedTrades.length}` : "All"}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                {tradesList.map((trade) => (
                  <div
                    key={trade}
                    className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedTrades.includes(trade) && "bg-primary/5")}
                    onClick={() => toggleTrade(trade)}
                  >
                    <Checkbox checked={selectedTrades.includes(trade)} className="rounded-sm border-primary/20" />
                    <span className="text-xs font-medium">{trade}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Source */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Source</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner">
                <span className="truncate flex items-center gap-1.5">
                  <Globe size={11} className="text-primary/60" />
                  {selectedSources.length > 0 ? `${selectedSources.length}` : "All"}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                {sourceOptions.map((source) => (
                  <div
                    key={source}
                    className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedSources.includes(source) && "bg-primary/5")}
                    onClick={() => toggleSource(source)}
                  >
                    <Checkbox checked={selectedSources.includes(source)} className="rounded-sm border-primary/20" />
                    <span className="text-xs font-medium">{source}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Gender</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-between text-xs font-medium px-3 rounded-xl border-none bg-muted/50 hover:bg-muted/80 shadow-inner">
                <span className="truncate flex items-center gap-1.5">
                  <User size={11} className="text-primary/60" />
                  {selectedGenders.length > 0 ? `${selectedGenders.length}` : "All"}
                </span>
                <ChevronDown size={11} className="opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-1 rounded-xl shadow-2xl border-none" align="start">
              <div className="space-y-0.5 p-1">
                {genderOptions.map((gender) => (
                  <div
                    key={gender}
                    className={cn("flex items-center space-x-2 p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors", selectedGenders.includes(gender) && "bg-primary/5")}
                    onClick={() => toggleGender(gender)}
                  >
                    <Checkbox checked={selectedGenders.includes(gender)} className="rounded-sm border-primary/20" />
                    <span className="text-xs font-medium">{gender}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Age */}
        <div className="space-y-1.5 lg:pt-1">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Age</Label>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 rounded-full">
              {activeFilters.ageRange ? `${activeFilters.ageRange[0]}-${activeFilters.ageRange[1]}` : '18-60'}
            </span>
          </div>
          <Slider
            defaultValue={[18, 60]}
            max={60}
            min={18}
            step={1}
            value={localFilters.ageRange || [18, 60]}
            onValueChange={(val) => setLocalFilters({ ...localFilters, ageRange: val })}
            className="py-1"
          />
        </div>
      </div>

      {/* Active filter badges */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/5"
          >
            {selectedStates.map((s: string) => (
              <Badge key={s} variant="secondary" className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full bg-primary/5 text-primary border-none font-bold">
                <MapPin size={10} /> {s} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleState(s)} />
              </Badge>
            ))}
            {selectedDistricts.map((d: string) => (
              <Badge key={d} variant="outline" className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full border-primary/20 text-primary/80 font-bold">
                <MapPin size={10} /> {d} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleDistrict(d)} />
              </Badge>
            ))}
            {selectedStatuses.map((s: string) => (
              <Badge key={s} className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full bg-success/10 text-success border-none font-bold uppercase tracking-tighter">
                <Activity size={10} /> {s.replace('_', ' ')} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleStatus(s)} />
              </Badge>
            ))}
            {selectedEducation.map((e: string) => (
              <Badge key={e} variant="outline" className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full border-muted-foreground/20 text-muted-foreground font-bold">
                <GraduationCap size={10} /> {e} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleEducation(e)} />
              </Badge>
            ))}
            {selectedTrades.map((t: string) => (
              <Badge key={t} className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full bg-accent text-accent-foreground border-none font-bold shadow-sm">
                <Wrench size={10} /> {t} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleTrade(t)} />
              </Badge>
            ))}
            {selectedSources.map((s: string) => (
              <Badge key={s} className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full bg-muted text-muted-foreground border-none font-bold">
                <Globe size={10} /> {s} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleSource(s)} />
              </Badge>
            ))}
            {selectedGenders.map((g: string) => (
              <Badge key={g} className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full bg-amber-100 text-amber-700 border-none font-bold">
                <User size={10} /> {g} <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => toggleGender(g)} />
              </Badge>
            ))}
            {isAgeFiltered && (
              <Badge className="text-[10px] h-6 px-2.5 gap-1.5 rounded-full bg-primary text-primary-foreground border-none font-bold shadow-md">
                <Sparkles size={10} /> {localFilters.ageRange[0]}-{localFilters.ageRange[1]} yrs <X size={10} className="cursor-pointer" onClick={() => setLocalFilters({ ...localFilters, ageRange: [18, 60] })} />
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CandidateFilters;

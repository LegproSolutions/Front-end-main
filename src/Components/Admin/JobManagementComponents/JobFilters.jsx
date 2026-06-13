import React from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Download } from "lucide-react";

const JobFilters = ({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterLocation,
  setFilterLocation,
  exportJobsCSV,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Filter by category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full md:w-40"
        />
        <Input
          placeholder="Filter by location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="w-full md:w-40"
        />
      </div>
      <div className="md:ml-auto">
        <Button variant="outline" onClick={exportJobsCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;



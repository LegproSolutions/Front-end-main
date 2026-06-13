import React from "react";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { MapPin, IndianRupee, Clock, Users, Building2, Calendar, Eye, Edit, Trash2 } from "lucide-react";

const JobCard = ({ job, onViewApplications, onViewEligible, showEligibleView, onEdit, onDelete, onVerify, getStatusBadge, formatSalary, formatDate, readOnly = false }) => {
  return (
    <Card key={job._id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {job.title} <span className="text-sm font-normal text-gray-500">#{String(job.jobId || "0").padStart(4, "0")}</span>
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{job.companyId?.name || "Unknown Company"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">{getStatusBadge(job)}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> <span>{job.location}</span></div>
          <div className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" /> <span>{formatSalary(job.salary)}/month</span></div>
          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> <span>{job.experience}+ years</span></div>
          <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> <span>{job.openings} openings</span></div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline">{job.category}</Badge>
          <Badge variant="outline" className="capitalize">{job.employmentType}</Badge>
        </div>
        <div className="text-sm text-gray-500 pt-1 space-y-1">
          {job.deadline && (
            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>Deadline: {formatDate(job.deadline)}</span></div>
          )}
          <div>Posted: {formatDate(job.date || job.createdAt)}</div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t mt-3">
          {!readOnly && job.status === "Pending Admin Verification" && (
            <>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onVerify(job._id, "Approved")}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => onVerify(job._id, "Rejected")}>Reject</Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={() => onViewApplications(job)} className="flex items-center gap-1"><Eye className="h-4 w-4"/> Applications</Button>
          {!readOnly && (
            <>
              <Button size="sm" variant="outline" onClick={() => onEdit(job)} className="flex items-center gap-1"><Edit className="h-4 w-4"/> Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(job._id)} className="flex items-center gap-1"><Trash2 className="h-4 w-4"/> Delete</Button>
            </>
          )}
          {job.eligibleCount !== undefined && (
            <div 
              onClick={showEligibleView ? () => onViewEligible(job) : undefined}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-md text-blue-700 transition-colors ${showEligibleView ? 'cursor-pointer hover:bg-blue-100' : ''}`}
              title={showEligibleView ? "View matching CRM candidates" : undefined}
            >
              <Users className="h-4 w-4" />
              <span className="text-xs font-bold whitespace-nowrap">
                {job.eligibleCount} Eligible
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;



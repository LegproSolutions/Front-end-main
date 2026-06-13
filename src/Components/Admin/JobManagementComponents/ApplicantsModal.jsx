import React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Users, User, Phone, Mail, Download, X } from "lucide-react";

const ApplicantsModal = ({ applicantsModal, loadingApplicants, closeApplicantsModal, exportApplicantsCSV, handleViewUserProfile, getApplicationStatusBadge }) => {
  if (!applicantsModal.open) return null;

  return (
    <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] p-6 m-4 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Job Applications</h3>
            <p className="text-gray-600 mt-1">{applicantsModal.job?.title} at {applicantsModal.job?.companyId?.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={closeApplicantsModal}><X className="h-4 w-4"/></Button>
        </div>

        {!loadingApplicants && applicantsModal.applicants?.length > 0 && (
          <div className="mb-4">
            <Button variant="outline" size="sm" onClick={exportApplicantsCSV} className="flex items-center gap-2"><Download className="h-4 w-4"/> Export CSV</Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loadingApplicants ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div></div>
          ) : applicantsModal.applicants.length === 0 ? (
            <div className="text-center py-16"><Users className="h-16 w-16 text-gray-400 mx-auto mb-4"/><h4 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h4><p className="text-gray-500">No one has applied for this position yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applicantsModal.applicants.map((application, index) => {
                const applicant = application.userId || application;
                return (
                  <Card key={application._id || index} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewUserProfile(applicant._id || applicant.userId, application)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-legpro-primary rounded-full flex items-center justify-center"><User className="w-6 h-6 text-white"/></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900">{applicant.name || 'N/A'}</h4>
                          <p className="text-sm text-gray-600">{applicant.email || 'No email provided'}</p>
                          <p className="text-sm text-gray-600">{applicant.phone || 'No phone provided'}</p>
                          <p className="text-xs text-legpro-primary mt-1">Click to view full profile</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge variant="outline" className="text-xs">Applied {new Date(application.appliedAt || application.createdAt || Date.now()).toLocaleDateString()}</Badge>
                          {getApplicationStatusBadge(application.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm text-gray-600">
                        {applicant.phone && (<div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400"/><span>{applicant.phone}</span></div>)}
                        {applicant.gender && (<div className="flex items-center gap-2 mt-1"><User className="h-4 w-4 text-gray-400"/><span className="capitalize">{applicant.gender}</span></div>)}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.open(`mailto:${applicant.email}`, "_blank"); }} className="flex items-center gap-1"><Mail className="h-4 w-4"/> Email</Button>
                        {applicant.resume && (<Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.open(applicant.resume, "_blank"); }} className="flex items-center gap-1"><Download className="h-4 w-4"/> Resume</Button>)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-600">{applicantsModal.applicants.length} applicant{applicantsModal.applicants.length !== 1 ? "s" : ""} found</p>
          <Button variant="outline" onClick={closeApplicantsModal}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;



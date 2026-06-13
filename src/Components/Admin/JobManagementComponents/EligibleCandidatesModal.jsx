import React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Users, User, Phone, Mail, X, MapPin, Briefcase } from "lucide-react";

const EligibleCandidatesModal = ({ 
  modal, 
  loading, 
  onClose, 
  onViewProfile 
}) => {
  if (!modal.open) return null;

  return (
    <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] p-6 m-4 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Eligible CRM Candidates</h3>
            <p className="text-gray-600 mt-1">Matching candidates for: {modal.job?.title}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}><X className="h-4 w-4"/></Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div>
            </div>
          ) : modal.candidates.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Matching Candidates</h4>
              <p className="text-gray-500">Try adjusting the job requirements or location to find more matches.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modal.candidates.map((candidate, index) => (
                <Card 
                  key={candidate.id || index} 
                  className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onViewProfile(candidate)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600"/>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{candidate.name || 'N/A'}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            {candidate.status?.replace('_', ' ') || 'New Lead'}
                          </Badge>
                          {candidate.source && (
                            <Badge variant="outline" className="text-xs">{candidate.source}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-500">Joined {new Date(candidate.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400"/>
                        <span>{candidate.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400"/>
                        <span className="truncate">{candidate.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400"/>
                        <span>{candidate.district}, {candidate.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400"/>
                        <span>{candidate.experience || 'Fresher'}</span>
                      </div>
                    </div>
                    
                    {candidate.trades && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Trades / Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.trades.split(',').map((trade, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] py-0">{trade.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.open(`tel:${candidate.phone}`); }} className="flex-1 flex items-center gap-1"><Phone className="h-4 w-4"/> Call</Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.open(`mailto:${candidate.email}`); }} className="flex-1 flex items-center gap-1"><Mail className="h-4 w-4"/> Email</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-600">{modal.candidates.length} candidate{modal.candidates.length !== 1 ? "s" : ""} eligible</p>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default EligibleCandidatesModal;

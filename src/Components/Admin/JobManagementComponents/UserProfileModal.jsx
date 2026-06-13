import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Loader, User, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

const UserProfileModal = ({ userProfileModal, loadingUserProfile, closeUserProfileModal, handleUpdateStatus, selectedStatus, setSelectedStatus, updateStatusLoading, getApplicationStatusBadge }) => {
  if (!userProfileModal.open) return null;

  return (
    <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] p-6 m-4 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">User Profile</h3>
            <p className="text-gray-600 mt-1">Complete profile details</p>
          </div>
          <Button variant="outline" size="sm" onClick={closeUserProfileModal}><X className="h-4 w-4"/></Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingUserProfile ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div></div>
          ) : !userProfileModal.user ? (
            <div className="text-center py-16"><User className="h-16 w-16 text-gray-400 mx-auto mb-4"/><h4 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h4><p className="text-gray-500">Could not load user profile information.</p></div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5"/> Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfileModal.user.firstName && (<div><label className="text-sm font-medium text-gray-600">First Name</label><p className="text-gray-900">{userProfileModal.user.firstName}</p></div>)}
                  {userProfileModal.user.lastName && (<div><label className="text-sm font-medium text-gray-600">Last Name</label><p className="text-gray-900">{userProfileModal.user.lastName}</p></div>)}
                  {userProfileModal.user.email && (<div><label className="text-sm font-medium text-gray-600">Email</label><p className="text-gray-900">{userProfileModal.user.email}</p></div>)}
                  {userProfileModal.user.phone && (<div><label className="text-sm font-medium text-gray-600">Phone</label><p className="text-gray-900">{userProfileModal.user.phone}</p></div>)}
                </CardContent>
              </Card>

              {/* Other sections omitted for brevity; parent retains full data rendering if needed */}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          {userProfileModal.application && (
            <div className="flex gap-3 mb-4">
              <Select defaultValue={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Change Application Status"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlist">Shortlist</SelectItem>
                  <SelectItem value="selecte">Selecte</SelectItem>
                  <SelectItem value="joined">Joined</SelectItem>
                  <SelectItem value="accepted">Accept Application</SelectItem>
                  <SelectItem value="rejected">Reject Application</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="onboarded">Onboarded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleUpdateStatus(userProfileModal.application._id, userProfileModal.user.firstName, selectedStatus.toLowerCase())}>{updateStatusLoading ? <Loader className="animate-spin"/> : 'Update Status'}</Button>
            </div>
          )}

          <div className="flex justify-end"><Button variant="outline" onClick={closeUserProfileModal}>Close</Button></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;



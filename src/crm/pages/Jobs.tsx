import { AppLayout } from "@/crm/components/AppLayout";
import JobManagement from "@/Components/Admin/JobManagement";

export default function CRMJobs() {
  return (
    <AppLayout 
      title="Job Management" 
      subtitle="Manage all portal job listings from the CRM"
    >
      <div className="-m-6">
        <JobManagement showEligibleView={true} readOnly={true} />
      </div>
    </AppLayout>
  );
}

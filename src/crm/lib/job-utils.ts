
export const transformJobData = (j: any) => ({
  ...j,
  client: j.client?.company_name || "Unknown",
  requirements: typeof j.requirements === 'string' ? j.requirements.split(',').filter(Boolean) : (j.requirements || []),
  education: typeof j.education === 'string'
    ? j.education.split(',').map((s: string) => s.trim()).filter(Boolean)
    : (Array.isArray(j.education) ? j.education : []),
  specialization: j.specialization || "",
  postedDate: j.postedDate ? new Date(j.postedDate).toISOString().split('T')[0] : ""
});

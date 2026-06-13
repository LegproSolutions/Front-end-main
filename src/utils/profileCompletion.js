// compute profile completion percentage in one place so all components agree
export default function computeProfileCompletion(u = {}) {
  const isFilled = (val) => val !== null && val !== undefined && val.toString().trim() !== "";

  // 1. Personal Information (5 fields)
  const fullName = u.personalInfo?.fullName || u.fullName || u.name || [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ") || "";
  const phone = u.personalInfo?.phone || u.phone || "";
  const email = u.personalInfo?.email || u.email || "";
  const gender = u.personalInfo?.gender || u.gender || "";
  const dateOfBirth = u.personalInfo?.dateOfBirth || u.dateOfBirth || u.dob || "";

  // 2. Address Information (2 fields required: State, District/City. Street is optional/hidden in the wizard)
  const state = u.address?.current?.state || u.address?.state || u.state || "";
  const district = u.address?.current?.city || u.address?.city || u.district || "";

  // 3. Education (2 fields)
  let hasQualification = false;
  let hasSpecialization = false;

  const edu = u.education || [];
  if (Array.isArray(edu)) {
    const activeEdu = edu.filter(e => e && e.type && e.type.trim() !== "");
    if (activeEdu.length > 0) {
      hasQualification = activeEdu.some(e => e.isSaved || e.institution || e.year);
      
      // Specialization is only required for ITI, Diploma, Graduate, or Post Graduate levels
      const needsSpecialization = activeEdu.some(e => ["ITI", "Diploma", "Graduate", "Post Graduate"].includes(e.type));
      if (needsSpecialization) {
        hasSpecialization = activeEdu.some(e => ["ITI", "Diploma", "Graduate", "Post Graduate"].includes(e.type) && (isFilled(e.field) || isFilled(e.trade) || isFilled(e.degree)));
      } else {
        hasSpecialization = true; // 10th, 12th, or Below 10 do not require specialization
      }
    }
  } else if (typeof edu === 'object') {
    const entries = Object.values(edu);
    if (entries.length > 0) {
      hasQualification = entries.some(e => isFilled(e?.instituteType));
      
      const needsSpecialization = entries.some(e => ["ITI", "Diploma", "Graduate", "Post Graduate"].includes(e?.instituteType));
      if (needsSpecialization) {
        hasSpecialization = entries.some(e => ["ITI", "Diploma", "Graduate", "Post Graduate"].includes(e?.instituteType) && (isFilled(e?.instituteFields?.specialization) || isFilled(e?.instituteFields?.trade) || isFilled(e?.instituteFields?.courseName)));
      } else {
        hasSpecialization = true;
      }
    }
  }

  // 4. Employment (1 field)
  // Since candidate profile form does not edit experience, any user is implicitly a Fresher by default if no experience is added.
  const hasEmployment = true;

  // 5. Documents (1 field)
  const resume = u.resume || u.documents?.resume || "";
  const aadhar = u.aadharNumber || u.aadhar || u.personalInfo?.aadharNumber || "";
  const hasDoc = isFilled(resume) || isFilled(aadhar);

  // Calculate completed count out of 11 fields
  let completedCount = 0;
  if (isFilled(fullName)) completedCount++;
  if (isFilled(phone)) completedCount++;
  if (isFilled(email)) completedCount++;
  if (isFilled(gender)) completedCount++;
  if (isFilled(dateOfBirth)) completedCount++;

  if (isFilled(state)) completedCount++;
  if (isFilled(district)) completedCount++;

  if (hasQualification) completedCount++;
  if (hasSpecialization) completedCount++;

  if (hasEmployment) completedCount++;
  if (hasDoc) completedCount++;

  const totalMandatory = 11;
  return Math.min(100, Math.round((completedCount / totalMandatory) * 100));
}


import { pipelineLockedStatuses } from "./sample-data";
import { formatExcelDate, calculateAge } from "./date-utils";

export const transformCandidateData = (c: any) => {
  const formattedDob = formatExcelDate(c?.dob);
  
  // 1. Gender Selection
  let gender = c?.gender || c?.user?.profile?.gender || "";
  if (gender === "N/A") gender = "";
  if (gender) {
    const gLower = gender.toLowerCase();
    if (gLower === "male") gender = "Male";
    else if (gLower === "female") gender = "Female";
    else if (gLower === "other") gender = "Other";
    else gender = gender.charAt(0).toUpperCase() + gender.slice(1);
  } else {
    gender = "Not Specified";
  }

  // 2. Alternate Phone
  const alternatePhone = c?.user?.profile?.alternatePhone || "";

  // 3. Education & Trades Parsing (Highest Qualification Priority)
  let highestQualification = "";
  let correspondingTrade = "";

  let eduList: any[] = [];
  if (c?.user?.profile?.education) {
    try {
      const parsed = typeof c.user.profile.education === 'string'
        ? JSON.parse(c.user.profile.education)
        : c.user.profile.education;
      if (Array.isArray(parsed)) {
        eduList = parsed;
      } else if (parsed && typeof parsed === 'object') {
        eduList = [parsed];
      }
    } catch (e) {
      console.error("Failed to parse education JSON:", e);
    }
  }

  const getRank = (qual: string) => {
    const q = (qual || "").toLowerCase().trim();
    if (!q) return 0;
    if (q.includes("m.tech") || q.includes("mba") || q.includes("m.sc") || q.includes("m.com") || q.includes("ma") || q.includes("master") || q.includes("post graduate") || q.includes("post graduation") || q.includes("pg")) return 5;
    if (q.includes("b.tech") || q.includes("be") || q.includes("b.sc") || q.includes("b.com") || q.includes("ba") || q.includes("bca") || q.includes("bba") || q.includes("graduate") || q.includes("graduation")) return 4;
    if (q.includes("diploma") || q.includes("iti") || q.includes("polytechnic")) return 3;
    if (q.includes("12th") || q.includes("intermediate") || q.includes("inter") || q.includes("hsc") || q.includes("xii")) return 2;
    if (q.includes("10th") || q.includes("matriculation") || q.includes("matric") || q.includes("ssc") || q.includes("high school") || q.includes("x")) return 1;
    return 0;
  };

  if (eduList.length > 0) {
    const sortedEdu = [...eduList].sort((a, b) => {
      const rankA = getRank(a.qualification);
      const rankB = getRank(b.qualification);
      if (rankA !== rankB) return rankB - rankA;
      const yearA = parseInt(a.passingYear || a.year || 0);
      const yearB = parseInt(b.passingYear || b.year || 0);
      return yearB - yearA;
    });
    const highest = sortedEdu[0];
    highestQualification = highest?.qualification || "";
    correspondingTrade = highest?.specialization || highest?.trade || highest?.stream || "";
  }

  if (highestQualification.toLowerCase().includes("polytechnic")) {
    highestQualification = "Diploma";
  }

  if (!highestQualification && c?.education && c?.education !== "N/A") {
    highestQualification = c.education;
    if (highestQualification.toLowerCase().includes("polytechnic")) {
      highestQualification = "Diploma";
    }
  }

  if (!correspondingTrade && c?.trades && c?.trades !== "N/A") {
    correspondingTrade = c.trades;
  }

  if (!highestQualification) highestQualification = "N/A";
  if (!correspondingTrade) correspondingTrade = "General";

  // 4. Location Parsing
  let address = typeof c?.user?.profile?.address === 'object' ? c?.user?.profile?.address : {};
  if (typeof c?.user?.profile?.address === 'string') {
    try {
      address = JSON.parse(c.user.profile.address);
    } catch (e) {}
  }
  let district = c?.district || address?.district || address?.current?.city || address?.city || "";
  let state = c?.state || address?.state || address?.current?.state || "";

  if (district === "N/A") district = "";
  if (state === "N/A") state = "";

  const stateMap: Record<string, string> = {
    "uttar pradesh": "UP",
    "madhya pradesh": "MP",
    "andhra pradesh": "AP",
    "arunachal pradesh": "AP",
    "himachal pradesh": "HP",
    "tamil nadu": "TN",
    "west bengal": "WB",
    "rajasthan": "RJ",
    "gujarat": "GJ",
    "maharashtra": "MH",
    "karnataka": "KA",
    "haryana": "HR",
    "punjab": "PB",
    "bihar": "BR",
    "jharkhand": "JH",
    "chhattisgarh": "CG",
    "odisha": "OD",
    "orissa": "OD",
    "uttarakhand": "UK",
    "delhi": "DL",
    "telangana": "TS",
    "kerala": "KL",
    "assam": "AS",
    "jammu and kashmir": "JK"
  };

  let locationString = "Location Not Available";
  if (district && state) {
    const cleanState = state.trim().toLowerCase();
    const stateAbbr = stateMap[cleanState] || state;
    locationString = `${stateAbbr} - ${district}`;
  } else if (state) {
    const cleanState = state.trim().toLowerCase();
    const stateAbbr = stateMap[cleanState] || state;
    locationString = stateAbbr;
  } else if (district) {
    locationString = district;
  }

  return {
    ...c,
    id: c?.id || Math.random().toString(),
    fullName: c?.name || "Unknown",
    age: calculateAge(formattedDob),
    dob: formattedDob,
    education: highestQualification,
    trades: correspondingTrade,
    phone: c?.phone || "N/A",
    alternatePhone: alternatePhone || null,
    email: c?.email || null,
    location: locationString,
    state: state,
    district: district,
    experience: c?.experience || "N/A",
    source: c?.source || "Direct",
    gender: gender,
    isDeleted: !!c?.isDeleted,
  };
};

/**
 * Checks if a candidate is eligible for a specific job based on:
 * 1. Pipeline Status (not already in an active process)
 * 2. Age Range
 * 3. Education Match
 * 4. Specialization / Trade Match
 */
export const isCandidateEligible = (job: any, candidate: any) => {
  // 1. Exclusion (Locked - in active pipeline)
  // A candidate is locked only if they are currently associated with a pipeline
  // and their status is within the locked range (New Lead to Joined).
  // If they have no pipelines or are in 'Not Joined' / 'Left' / 'Rejected', they are eligible.
  const hasPipeline = candidate.pipelines && candidate.pipelines.length > 0;
  if (hasPipeline && candidate.status && pipelineLockedStatuses.includes(candidate.status)) {
    return false;
  }

  // 2. Age Eligibility
  const minAge = job.minAge || 18;
  const maxAge = job.maxAge || 45;
  const cAge = candidate.age;
  
  if (cAge > 0) {
    if (cAge < minAge || cAge > maxAge) return false;
  } else {
    // If age is missing or 0, we treat them as ineligible if the job has age requirements
    return false;
  }

  // 3. Education Eligibility (Smart Match)
  const jobEdu = Array.isArray(job.education) ? job.education : 
                 (typeof job.education === 'string' ? job.education.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
                 
  if (jobEdu.length > 0) {
    const cEdu = (candidate.education || "").toLowerCase().trim();
    const hasEduMatch = jobEdu.some((jEdu: string) => {
      const j = jEdu.toLowerCase().trim();
      if (!j) return false;

      // Textual match (e.g. "ITI" in "ITI Fitter")
      if (cEdu.includes(j) || j.includes(cEdu)) return true;
      
      // Numeric match (e.g. "12" in "12th")
      const jNum = j.match(/\d+/)?.[0];
      const cNum = cEdu.match(/\d+/)?.[0];
      if (jNum && cNum && jNum === cNum) return true;
      
      // Common aliases
      if (j.includes("12") && (cEdu.includes("inter") || cEdu.includes("hsc"))) return true;
      if (j.includes("10") && (cEdu.includes("ssc") || cEdu.includes("high school"))) return true;
      
      return false;
    });
    if (!hasEduMatch) return false;
  }

  // 4. Specialization / Trade Eligibility
  const jobSpec = (job.specialization || "").toLowerCase().trim();
  if (jobSpec) {
    const cTrades = (candidate.trades || "").toLowerCase().trim();
    // Match if job specialization is found in candidate trades or vice versa
    const specMatch = jobSpec.split(',').some((s: string) => {
      const trimmedSpec = s.trim().toLowerCase();
      if (!trimmedSpec) return false;
      return cTrades.includes(trimmedSpec) || trimmedSpec.includes(cTrades);
    });
    if (!specMatch) return false;
  }

  return true;
};

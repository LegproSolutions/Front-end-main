export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  status: CandidateStatus;
  source: string;
  appliedDate: string;
  jobTitle: string;
  avatar?: string;
  clientId?: string;
  jobId?: string;
  recruiter?: string;
  lastActivity?: string;
}

export type CandidateStatus =
  | "new_lead"
  | "screened"
  | "interested"
  | "interview_scheduled"
  | "selected"
  | "joined"
  | "not_joined"
  | "left"
  | "rejected";

export const statusLabels: Record<CandidateStatus, string> = {
  new_lead: "New Lead",
  screened: "Screened",
  interested: "Interested to Join",
  interview_scheduled: "Interview Scheduled",
  selected: "Selected",
  joined: "Joined",
  not_joined: "Not Joined",
  left: "Left",
  rejected: "Rejected",
};

export const statusColors: Record<CandidateStatus, string> = {
  new_lead: "bg-info/10 text-info",
  screened: "bg-warning/10 text-warning",
  interested: "bg-primary/10 text-primary",
  interview_scheduled: "bg-primary/10 text-primary",
  selected: "bg-success/10 text-success",
  joined: "bg-success/15 text-success",
  not_joined: "bg-destructive/10 text-destructive",
  left: "bg-slate-100 text-slate-700",
  rejected: "bg-destructive/10 text-destructive",
};

export const candidates: Candidate[] = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", location: "Mumbai", skills: ["Python", "React", "SQL"], experience: "3 years", status: "interview_scheduled", source: "Naukri", appliedDate: "2026-03-28", jobTitle: "Frontend Developer", clientId: "1", jobId: "1", recruiter: "Neha Gupta", lastActivity: "2026-03-31 14:30" },
  { id: "2", name: "Rahul Verma", email: "rahul@email.com", phone: "+91 87654 32109", location: "Bangalore", skills: ["Java", "Spring Boot"], experience: "5 years", status: "new_lead", source: "LinkedIn", appliedDate: "2026-03-30", jobTitle: "Backend Developer", clientId: "2", jobId: "2", recruiter: "Amit Desai", lastActivity: "2026-03-30 10:00" },
  { id: "3", name: "Anjali Patel", email: "anjali@email.com", phone: "+91 76543 21098", location: "Delhi", skills: ["BPO", "Customer Service"], experience: "2 years", status: "screened", source: "Referral", appliedDate: "2026-03-25", jobTitle: "Customer Support", clientId: "3", jobId: "3", recruiter: "Neha Gupta", lastActivity: "2026-03-29 16:45" },
  { id: "4", name: "Vikram Singh", email: "vikram@email.com", phone: "+91 65432 10987", location: "Pune", skills: ["DevOps", "AWS", "Docker"], experience: "4 years", status: "selected", source: "Naukri", appliedDate: "2026-03-20", jobTitle: "DevOps Engineer", clientId: "4", jobId: "4", recruiter: "Amit Desai", lastActivity: "2026-03-28 11:20" },
  { id: "5", name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 54321 09876", location: "Hyderabad", skills: ["HR", "Recruitment"], experience: "6 years", status: "joined", source: "Field", appliedDate: "2026-03-15", jobTitle: "HR Manager", clientId: "5", jobId: "5", recruiter: "Neha Gupta", lastActivity: "2026-03-27 09:00" },
  { id: "6", name: "Amit Kumar", email: "amit@email.com", phone: "+91 43210 98765", location: "Chennai", skills: ["Sales", "CRM"], experience: "1 year", status: "rejected", source: "Walk-in", appliedDate: "2026-03-22", jobTitle: "Sales Executive", clientId: "1", jobId: "1", recruiter: "Amit Desai", lastActivity: "2026-03-26 15:10" },
  { id: "7", name: "Kavya Nair", email: "kavya@email.com", phone: "+91 32109 87654", location: "Kochi", skills: ["React", "TypeScript"], experience: "2 years", status: "new_lead", source: "LinkedIn", appliedDate: "2026-03-31", jobTitle: "Frontend Developer", clientId: "1", jobId: "1", recruiter: "Neha Gupta", lastActivity: "2026-03-31 08:30" },
  { id: "8", name: "Deepak Joshi", email: "deepak@email.com", phone: "+91 21098 76543", location: "Jaipur", skills: ["Driving", "Logistics"], experience: "8 years", status: "interested", source: "Field", appliedDate: "2026-03-27", jobTitle: "Driver", clientId: "6", jobId: "6", recruiter: "Suresh Yadav", lastActivity: "2026-03-30 12:00" },
  { id: "9", name: "Meera Iyer", email: "meera@email.com", phone: "+91 10987 65432", location: "Bangalore", skills: ["Data Analysis", "Excel", "Python"], experience: "3 years", status: "interested", source: "Naukri", appliedDate: "2026-03-26", jobTitle: "Data Analyst", clientId: "2", jobId: "2", recruiter: "Amit Desai", lastActivity: "2026-03-29 14:00" },
  { id: "10", name: "Ravi Shankar", email: "ravi@email.com", phone: "+91 09876 54321", location: "Mumbai", skills: ["Node.js", "MongoDB"], experience: "4 years", status: "new_lead", source: "Referral", appliedDate: "2026-04-01", jobTitle: "Full Stack Developer", clientId: "1", jobId: "1", recruiter: "Neha Gupta", lastActivity: "2026-04-01 09:15" },
  { id: "11", name: "Pooja Mehta", email: "pooja@email.com", phone: "+91 99001 12233", location: "Delhi", skills: ["Customer Service", "Hindi", "English"], experience: "1 year", status: "interested", source: "JobMela", appliedDate: "2026-03-29", jobTitle: "Customer Support", clientId: "3", jobId: "3", recruiter: "Neha Gupta", lastActivity: "2026-03-30 11:00" },
  { id: "12", name: "Arjun Das", email: "arjun@email.com", phone: "+91 88112 23344", location: "Pune", skills: ["AWS", "Terraform"], experience: "3 years", status: "interview_scheduled", source: "JobMela", appliedDate: "2026-03-28", jobTitle: "DevOps Engineer", clientId: "4", jobId: "4", recruiter: "Amit Desai", lastActivity: "2026-03-31 16:00" },
  { id: "13", name: "Rohit Pandey", email: "rohit@email.com", phone: "+91 77665 44332", location: "Lucknow", skills: ["React", "Node.js"], experience: "2 years", status: "not_joined", source: "Campus", appliedDate: "2026-03-10", jobTitle: "Frontend Developer", clientId: "1", jobId: "1", recruiter: "Neha Gupta", lastActivity: "2026-04-02 10:00" },
];

export interface Job {
  id: string;
  title: string;
  client: string;
  clientId?: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  minAge: number;
  maxAge: number;
  openPositions: number;
  filledPositions: number;
  status: "open" | "closed" | "on_hold" | "inactive";
  postedDate: string;
  requirements: string[];
  education?: string[];
  specialization?: string;
  minExperience?: string;
}

export const jobs: Job[] = [];

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  activeJobs: number;
  totalHires: number;
}

export const clients: Client[] = [
  { id: "1", name: "TechCorp Solutions", industry: "IT Services", contactPerson: "Rajesh Mehta", email: "rajesh@techcorp.com", phone: "+91 99887 76655", location: "Mumbai", activeJobs: 3, totalHires: 45 },
  { id: "2", name: "InnovateTech", industry: "Software Development", contactPerson: "Sunita Agarwal", email: "sunita@innovatetech.com", phone: "+91 88776 65544", location: "Bangalore", activeJobs: 2, totalHires: 28 },
  { id: "3", name: "GlobalServe BPO", industry: "BPO", contactPerson: "Mohammad Ali", email: "ali@globalserve.com", phone: "+91 77665 54433", location: "Delhi", activeJobs: 1, totalHires: 120 },
  { id: "4", name: "CloudFirst Inc", industry: "Cloud Computing", contactPerson: "Divya Krishnan", email: "divya@cloudfirst.com", phone: "+91 66554 43322", location: "Pune", activeJobs: 1, totalHires: 15 },
  { id: "5", name: "PeopleFirst HR", industry: "Human Resources", contactPerson: "Arun Nair", email: "arun@peoplefirst.com", phone: "+91 55443 32211", location: "Hyderabad", activeJobs: 0, totalHires: 8 },
  { id: "6", name: "LogiTrans Pvt Ltd", industry: "Logistics", contactPerson: "Suresh Yadav", email: "suresh@logitrans.com", phone: "+91 44332 21100", location: "Jaipur", activeJobs: 1, totalHires: 35 },
];

// Disposition system
export type Disposition = "interested" | "not_interested" | "not_connected" | "connected";

export const dispositionLabels: Record<Disposition, string> = {
  interested: "Interested",
  not_interested: "Not Interested",
  not_connected: "Not Connected",
  connected: "Connected",
};

export const subDispositions: Record<Disposition, string[]> = {
  interested: ["Ready to Join", "Need Time", "Salary Issue"],
  not_interested: ["Already Working", "Salary Low", "Location Issue"],
  not_connected: ["Switch Off", "Busy", "No Answer"],
  connected: ["Call Back Later", "Wrong Number"],
};

export interface CallLog {
  id: string;
  candidateId: string;
  candidateName: string;
  recruiterName: string;
  disposition: Disposition;
  subDisposition: string;
  timestamp: string;
  notes: string;
}

export const callLogs: CallLog[] = [
  { id: "cl1", candidateId: "8", candidateName: "Deepak Joshi", recruiterName: "Suresh Yadav", disposition: "interested", subDisposition: "Ready to Join", timestamp: "2026-03-30 12:00", notes: "Confirmed joining date" },
  { id: "cl2", candidateId: "9", candidateName: "Meera Iyer", recruiterName: "Amit Desai", disposition: "interested", subDisposition: "Need Time", timestamp: "2026-03-29 14:00", notes: "Will decide by next week" },
  { id: "cl3", candidateId: "11", candidateName: "Pooja Mehta", recruiterName: "Neha Gupta", disposition: "not_connected", subDisposition: "No Answer", timestamp: "2026-03-30 10:30", notes: "Will retry tomorrow" },
];

// AI Screening
export type AIDecision = "passed" | "failed" | "pending" | "no_response";

export interface AIScreeningLog {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  round: 1 | 2;
  status: AIDecision;
  recordingUrl?: string;
  transcript?: string;
  decision: string;
  timestamp: string;
}

export const aiScreeningLogs: AIScreeningLog[] = [
  { id: "ai1", candidateId: "1", candidateName: "Priya Sharma", jobTitle: "Frontend Developer", round: 1, status: "passed", recordingUrl: "#", transcript: "Candidate expressed strong interest in the role. Has relevant React experience. Salary expectations align.", decision: "Qualified - proceed to Round 2", timestamp: "2026-03-28 10:00" },
  { id: "ai2", candidateId: "1", candidateName: "Priya Sharma", jobTitle: "Frontend Developer", round: 2, status: "passed", recordingUrl: "#", transcript: "Detailed screening complete. Strong technical background. Available to join in 2 weeks.", decision: "Selected for interview", timestamp: "2026-03-29 11:00" },
  { id: "ai3", candidateId: "2", candidateName: "Rahul Verma", jobTitle: "Backend Developer", round: 1, status: "passed", recordingUrl: "#", transcript: "Interested in the role. 5 years Java experience confirmed.", decision: "Qualified - proceed to Round 2", timestamp: "2026-03-30 09:00" },
  { id: "ai4", candidateId: "2", candidateName: "Rahul Verma", jobTitle: "Backend Developer", round: 2, status: "pending", decision: "Awaiting Round 2 call", timestamp: "" },
  { id: "ai5", candidateId: "7", candidateName: "Kavya Nair", jobTitle: "Frontend Developer", round: 1, status: "no_response", decision: "No response - retry scheduled", timestamp: "2026-03-31 08:30" },
  { id: "ai6", candidateId: "10", candidateName: "Ravi Shankar", jobTitle: "Full Stack Developer", round: 1, status: "pending", decision: "Call scheduled", timestamp: "" },
  { id: "ai7", candidateId: "3", candidateName: "Anjali Patel", jobTitle: "Customer Support", round: 1, status: "passed", recordingUrl: "#", transcript: "Good communication skills. Available immediately.", decision: "Qualified", timestamp: "2026-03-26 14:00" },
  { id: "ai8", candidateId: "3", candidateName: "Anjali Patel", jobTitle: "Customer Support", round: 2, status: "passed", recordingUrl: "#", transcript: "Cleared detailed screening. BPO experience verified.", decision: "Move to Interested", timestamp: "2026-03-27 10:00" },
];

// Recruiter list for filters
export const recruiters = ["Neha Gupta", "Amit Desai", "Suresh Yadav"];

// Client pipeline stages (updated - removed new, interview, joining_confirmed; added not_joined)
export const clientPipelineStages: CandidateStatus[] = [
  "new_lead", "screened", "interested", "interview_scheduled", "selected", "joined", "not_joined", "rejected"
];

// ITI/Polytechnic Candidate type (for Candidate Data Analysis page)
export interface ITICandidate {
  id: string;
  fullName: string;
  education: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  age: number;
  trades: string[];
  experience?: string;
  source?: string;
  isDeleted?: boolean;
}

export const educationOptions = [
  "10th Pass", "12th Pass", "ITI", "Diploma",
  "Graduation", "B.Tech", "MBA", "BCA", "BBA", "B.Sc", "B.Com", "B.A", "Others"
];

export const sourceOptions = [
  "JobMela", "WhatsApp", "Field Sourcing", "Bulk Upload", "Referral",
  "Naukri", "LinkedIn", "Walk-in", "Campus", "Social Media"
];

export const genderOptions = ["Male", "Female", "Other"];

export const stateDistricts: Record<string, string[]> = {
  'Andaman and Nicobar Islands': ['Port Blair', 'Nicobar', 'North and Middle Andaman', 'South Andaman'],
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey', 'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Upper Siang', 'Lower Siang', 'Lower Dibang Valley', 'Upper Dibang Valley', 'Anjaw', 'Lohit', 'Namsai', 'Changlang', 'Tirap', 'Longding'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Jorhat', 'Silchar', 'Tezpur', 'Nagaon', 'Tinsukia', 'Sivasagar', 'Dhubri', 'Goalpara', 'Barpeta', 'Bongaigaon', 'Karimganj', 'Hailakandi', 'Cachar'],
  'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
  'Chandigarh': ['Chandigarh'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Kanker', 'Kondagaon', 'Narayanpur', 'Bijapur', 'Sukma'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Dadra', 'Silvassa'],
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Goa': ['North Goa', 'South Goa'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Gandhinagar', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad', 'Dang', 'Chhota Udaipur', 'Mahisagar'],
  'Haryana': ['Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar', 'Charkhi Dadri'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Mandi', 'Solan', 'Hamirpur', 'Chamba', 'Kangra', 'Una', 'Bilaspur', 'Kinnaur', 'Lahaul and Spiti', 'Sirmaur'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur', 'Rajouri', 'Poonch', 'Samba', 'Reasi', 'Ganderbal', 'Kulgam', 'Shopian', 'Bandipora', 'Kupwara', 'Pulwama', 'Budgam', 'Ramban', 'Kishtwar', 'Doda'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Dumka', 'Palamu', 'Garhwa', 'Chatra', 'Koderma', 'Godda', 'Sahebganj', 'Pakur', 'Lohardaga', 'Gumla', 'Simdega', 'Latehar', 'Saraikela Kharsawan', 'Khunti', 'Jamtara'],
  'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kottayam', 'Malappuram', 'Kannur'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Singrauli', 'Burhanpur', 'Morena', 'Khandwa', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Panna', 'Chhatarpur'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  'Manipur': ['Imphal West', 'Imphal East', 'Bishnupur', 'Thoubal', 'Chandel', 'Senapati', 'Ukhrul', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar', 'Baghmara', 'Resubelpara'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Lawngtlai', 'Mamit'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Abohar'],
  'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur', 'Hanumangarh', 'Jhalawar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Pakyong', 'Soreng'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanchipuram', 'Kanyakumari', 'Madurai', 'Nagapattinam', 'Namakkal', 'Salem', 'Thanjavur', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Tenkasi', 'Tirupathur', 'Ranipet', 'Chengalpattu', 'Kallakurichi', 'Mayiladuthurai'],
  'Telangana': ['Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal Rural', 'Warangal Urban', 'Jagtial', 'Jangaon', 'Kamareddy', 'Mancherial', 'Nirmal', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Ambassa', 'Belonia', 'Khowai', 'Kailasahar', 'Sepahijala', 'South Tripura'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital', 'Pithoragarh', 'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Pauri Garhwal', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Ayodhya', 'Azamgarh', 'Bareilly', 'Bijnor', 'Bulandshahr', 'Etawah', 'Ghaziabad', 'Gorakhpur', 'Jhansi', 'Kanpur Nagar', 'Lucknow', 'Mathura', 'Meerut', 'Moradabad', 'Muzaffarnagar', 'Prayagraj', 'Saharanpur', 'Varanasi', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Basti', 'Bhadohi', 'Budaun', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Gonda', 'Ghazipur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Kannauj', 'Kanpur Dehat', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mau', 'Mirzapur', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao'],
  'West Bengal': ['Bankura', 'Birbhum', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'South 24 Parganas'],
};

export const tradesList: string[] = [
  'Electrician', 'Fitter', 'Turner', 'Machinist', 'Welder', 'Plumber',
  'Carpenter', 'Wireman', 'Diesel Mechanic', 'Motor Mechanic',
  'Sheet Metal Worker', 'Painter', 'Draughtsman Civil', 'Draughtsman Mechanical',
  'COPA (Computer)', 'Electronics Mechanic', 'Instrument Mechanic',
  'Refrigeration & AC', 'Tool & Die Maker', 'Moulder',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'Electronics & Communication', 'Computer Science', 'Information Technology',
  'Chemical Engineering', 'Automobile Engineering',
  'B.A (General)', 'B.Sc (General)', 'B.Com (General)', 'BBA', 'BCA',
  'MBA', 'MCA'
];

export const mockITICandidates: ITICandidate[] = [
  { id: "iti1", fullName: "Arjun Mehta", education: "ITI Electrician", email: "arjun.m@example.com", phone: "+91 98765 43210", address: "Hazratganj", state: "Uttar Pradesh", district: "Lucknow", age: 22, trades: ["Electrician", "Wireman"], experience: "2 years", source: "Field Sourcing" },
  { id: "iti2", fullName: "Priya Sharma", education: "Polytechnic Mechanical", email: "priya.s@example.com", phone: "+91 98765 43211", address: "Andheri East", state: "Maharashtra", district: "Mumbai City", age: 24, trades: ["Mechanical Engineering", "Fitter"], experience: "3 years", source: "JobMela" },
  { id: "iti3", fullName: "Rahul Verma", education: "ITI Diesel Mechanic", email: "rahul.v@example.com", phone: "+91 98765 43212", address: "Whitefield", state: "Karnataka", district: "Bengaluru Urban", age: 21, trades: ["Diesel Mechanic", "Motor Mechanic"], experience: "1 year", source: "WhatsApp" },
  { id: "iti4", fullName: "Ananya Iyer", education: "Polytechnic Civil", email: "ananya.i@example.com", phone: "+91 98765 43213", address: "Adyar", state: "Tamil Nadu", district: "Chennai", age: 23, trades: ["Civil Engineering", "Draughtsman Civil"], experience: "2 years", source: "Referral" },
  { id: "iti5", fullName: "Suresh Yadav", education: "ITI Fitter", email: "suresh.y@example.com", phone: "+91 98765 43214", address: "Govindpuri", state: "Delhi", district: "South Delhi", age: 20, trades: ["Fitter", "Turner"], experience: "Fresher", source: "Bulk Upload" },
  { id: "iti6", fullName: "Kavita Devi", education: "10th Pass", email: "kavita.d@example.com", phone: "+91 98765 43215", address: "Ashok Nagar", state: "Madhya Pradesh", district: "Bhopal", age: 19, trades: ["COPA (Computer)"], experience: "Fresher", source: "Walk-in" },
  { id: "iti7", fullName: "Manoj Kumar", education: "ITI Welder", email: "manoj.k@example.com", phone: "+91 98765 43216", address: "Civil Lines", state: "Rajasthan", district: "Jaipur", age: 25, trades: ["Welder", "Sheet Metal Worker"], experience: "4 years", source: "Field Sourcing" },
  { id: "iti8", fullName: "Neha Gupta", education: "B.Tech", email: "neha.g@example.com", phone: "+91 98765 43217", address: "Salt Lake", state: "West Bengal", district: "Kolkata", age: 26, trades: ["Computer Science", "Information Technology"], experience: "3 years", source: "LinkedIn" },
  { id: "iti9", fullName: "Ravi Shankar", education: "Diploma", email: "ravi.sh@example.com", phone: "+91 98765 43218", address: "Sector 62", state: "Uttar Pradesh", district: "Ghaziabad", age: 22, trades: ["Electronics & Communication", "Electronics Mechanic"], experience: "1 year", source: "Naukri" },
  { id: "iti10", fullName: "Sunita Patel", education: "ITI Electrician", email: "sunita.p@example.com", phone: "+91 98765 43219", address: "SG Highway", state: "Gujarat", district: "Ahmedabad", age: 21, trades: ["Electrician", "Refrigeration & AC"], experience: "2 years", source: "JobMela" },
  { id: "iti11", fullName: "Deepak Tiwari", education: "Graduation", email: "deepak.t@example.com", phone: "+91 98765 43220", address: "Aliganj", state: "Uttar Pradesh", district: "Lucknow", age: 28, trades: ["BBA", "MBA"], experience: "5 years", source: "Referral" },
  { id: "iti12", fullName: "Anjali Singh", education: "Polytechnic Electrical", email: "anjali.s@example.com", phone: "+91 98765 43221", address: "Koramangala", state: "Karnataka", district: "Bengaluru Urban", age: 23, trades: ["Electrical Engineering", "Instrument Mechanic"], experience: "2 years", source: "WhatsApp" },
];

// Helper: get candidates in pipeline for a specific client (new_lead to joined)
// Candidates in these statuses are "locked" and won't show in eligible counts for other jobs
export const pipelineLockedStatuses: CandidateStatus[] = [
  "new_lead", 
  "screened", 
  "interested", 
  "interview_scheduled", 
  "selected", 
  "joined"
];

export function getEligibleCandidateCount(job: Job, allCandidates: Candidate[]): number {
  // Candidates in pipeline from "new_lead" to "joined" for ANY client/job should be excluded
  const lockedCandidateIds = new Set(
    allCandidates
      .filter(c => pipelineLockedStatuses.includes(c.status))
      .map(c => c.id)
  );

  return allCandidates.filter(c => {
    if (lockedCandidateIds.has(c.id)) return false;
    // Match by skills/requirements overlap
    const skillMatch = c.skills.some(s =>
      job.requirements.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
    );
    return skillMatch;
  }).length;
}

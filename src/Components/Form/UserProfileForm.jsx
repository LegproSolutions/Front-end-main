import React, { useState, useRef, useContext, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Code,
  FileText,
  Camera,
  Calendar,
  Users,
  Upload,
  File,
  X,
  Check,
  AlertTriangle,
  GraduationCap,
  Building2,
  Globe,
  Languages,
  Star,
  Plus,
  Trash2,
  Edit,
  Save,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";
import axios from "../../utils/axiosConfig";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import computeProfileCompletion from "../../utils/profileCompletion";

const stateDistricts = {
  "Andaman And Nicobar Islands": [
    "Port Blair",
    "North and Middle Andaman",
    "South Andaman",
    "Nicobar"
  ],
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Krishna",
    "Kurnool",
    "Nellore",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa"
  ],
  "Arunachal Pradesh": [
    "Tawang",
    "West Kameng",
    "East Kameng",
    "Papum Pare",
    "Kurung Kumey",
    "Kra Daadi",
    "Lower Subansiri",
    "Upper Subansiri",
    "West Siang",
    "East Siang",
    "Siang",
    "Upper Siang",
    "Lower Siang",
    "Lower Dibang Valley",
    "Dibang Valley",
    "Anjaw",
    "Lohit",
    "Namsai",
    "Changlang",
    "Tirap",
    "Longding"
  ],
  "Assam": [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup Metropolitan",
    "Kamrup",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Dima Hasao",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran (Motihari)",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur (Bhabua)",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger (Monghyr)",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia (Purnea)",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Chhattisgarh": [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada (South Bastar)",
    "Dhamtari",
    "Durg",
    "Gariyaband",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham (Kawardha)",
    "Kanker (North Bastar)",
    "Kondagaon",
    "Korba",
    "Korea (Koriya)",
    "Mahasamund",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surajpur  ",
    "Surguja"
  ],
  "Delhi": [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East  Delhi",
    "North West  Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West  Delhi",
    "West Delhi"
  ],
  "Goa": [
    "North Goa",
    "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha (Palanpur)",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udepur",
    "Dahod",
    "Dangs (Ahwa)",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kachchh",
    "Kheda (Nadiad)",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada (Rajpipla)",
    "Navsari",
    "Panchmahal (Godhra)",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha (Himmatnagar)",
    "Surat",
    "Surendranagar",
    "Tapi (Vyara)",
    "Vadodara",
    "Valsad"
  ],
  "Haryana": [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurgaon",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Mewat",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul &amp; Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur (Sirmour)",
    "Solan",
    "Una"
  ],
  "Jammu And Kashmir": [
    "Anantnag",
    "Bandipore",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kargil",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Leh",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur"
  ],
  "Jharkhand": [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribag",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahibganj",
    "Seraikela-Kharsawan",
    "Simdega",
    "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot",
    "Ballari (Bellary)",
    "Belagavi (Belgaum)",
    "Bengaluru (Bangalore) Rural",
    "Bengaluru (Bangalore) Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikballapur",
    "Chikkamagaluru (Chikmagalur)",
    "Chitradurga",
    "Dakshina Kannada",
    "Davangere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi (Gulbarga)",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru (Mysore)",
    "Raichur",
    "Ramanagara",
    "Shivamogga (Shimoga)",
    "Tumakuru (Tumkur)",
    "Udupi",
    "Uttara Kannada (Karwar)",
    "Vijayapura (Bijapur)",
    "Yadgir"
  ],
  "Kerala": [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad"
  ],
  "Ladakh": [
    "Leh",
    "Kargil"
  ],
  "Lakshadweep": [
    "Agatti",
    "Amini",
    "Androth",
    "Bithra",
    "Chethlath",
    "Kavaratti",
    "Kadmath",
    "Kalpeni",
    "Kilthan",
    "Minicoy"
  ],
  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills ",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl",
    "Champhai",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saiha",
    "Serchhip"
  ],
  "Nagaland": [
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Mokokchung",
    "Mon",
    "Peren",
    "Phek",
    "Tuensang",
    "Wokha",
    "Zunheboto"
  ],
  "Odisha": [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Deogarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghapur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar (Keonjhar)",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Sonepur",
    "Sundargarh"
  ],
  "Puducherry": [
    "Karaikal",
    "Mahe",
    "Pondicherry",
    "Yanam"
  ],
  "Punjab": [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Mansa",
    "Moga",
    "Muktsar",
    "Nawanshahr (Shahid Bhagat Singh Nagar)",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sahibzada Ajit Singh Nagar (Mohali)",
    "Sangrur",
    "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur"
  ],
  "Sikkim": [
    "East Sikkim",
    "North Sikkim",
    "South Sikkim",
    "West Sikkim"
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Salem",
    "Sivaganga",
    "Thanjavur",
    "Theni",
    "Thoothukudi (Tuticorin)",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhoopalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Komaram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal",
    "Nagarkurnool",
    "Nalgonda",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal (Rural)",
    "Warangal (Urban)",
    "Yadadri Bhuvanagiri"
  ],
  "Dadra And Nagar Haveli And Daman And Diu": [
    "Dadra & Nagar Haveli",
    "Daman",
    "Diu"
  ],
  "Tripura": [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura"
  ],
  "Uttarakhand": [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi"
  ],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Allahabad",
    "Ambedkar Nagar",
    "Amethi (Chatrapati Sahuji Mahraj Nagar)",
    "Amroha (J.P. Nagar)",
    "Auraiya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Faizabad",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur (Panchsheel Nagar)",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kanshiram Nagar (Kasganj)",
    "Kaushambi",
    "Kushinagar (Padrauna)",
    "Lakhimpur - Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "RaeBareli",
    "Rampur",
    "Saharanpur",
    "Sambhal (Bhim Nagar)",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamali (Prabuddh Nagar)",
    "Shravasti",
    "Siddharth Nagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi"
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Burdwan (Bardhaman)",
    "Cooch Behar",
    "Dakshin Dinajpur (South Dinajpur)",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Medinipur (West Medinipur)",
    "Purba Medinipur (East Medinipur)",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur (North Dinajpur)"
  ]
};

const UserProfileForm = () => {
  const { applyForJob, fetchUserFromCookie } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(15);
  const fileInputRef = useRef(null);
  const profileImageRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState({
    resume: { loading: false, error: null, success: false },
    profileImage: { loading: false, error: null, success: false },
    submit: { loading: false, error: null, success: false },
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    // Basic Information
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      nationality: "Indian",
      profileImage: null,
    },

    // Address Information
    address: {
      current: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        landmark: "",
      },
      permanent: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        landmark: "",
        sameAsCurrent: false,
      },
    },

    // Professional Information
    professional: {
      currentJobTitle: "",
      currentCompany: "",
      workExperience: "",
      currentSalary: "",
      expectedSalary: "",
      noticePeriod: "",
      workMode: "",
      preferredLocations: [],
      industryExperience: [],
      availableFrom: "",
    },

    // Education
    education: [],

    // Experience
    experience: [],

    // Skills & Languages
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: [],
    },

    // Documents
    documents: {
      resume: null,
      profilePicture: null,
      portfolio: null,
    },

    // Social & Portfolio Links
    links: {
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
      other: [],
    },

    // Preferences
    preferences: {
      jobTypes: [],
      workShifts: [],
      disabilities: "",
      careerObjective: "",
    },
  });

  const steps = [
    {
      icon: User,
      label: "Personal",
      description: "Basic information",
      fields: ["fullName", "email", "phone", "dateOfBirth"],
    },
    {
      icon: MapPin,
      label: "Address",
      description: "Location details",
      fields: ["current.street", "current.city", "current.state"],
    },
    {
      icon: GraduationCap,
      label: "Education",
      description: "Academic background",
      fields: ["education"],
    },
    {
      icon: Globe,
      label: "Portfolio",
      description: "Links & documents",
      fields: ["resume", "linkedin", "github"],
    },
  ];

  // Helper function to update nested form data
  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Helper function to update deeply nested data
  const updateNestedData = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  // Add item to arrays (for experience, education, etc.)
  const addArrayItem = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  // Remove item from arrays
  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    return computeProfileCompletion(formData);
  };

  // File upload handlers
  const handleFileUpload = async (file, type = "resume") => {
    if (!file) return;

    const allowedTypes =
      type === "resume"
        ? ["application/pdf"]
        : ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          loading: false,
          error: `Only ${
            type === "resume" ? "PDF" : "image"
          } files are allowed`,
          success: false,
        },
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          loading: false,
          error: "File size should be less than 5MB",
          success: false,
        },
      }));
      return;
    }

    setUploadStatus((prev) => ({
      ...prev,
      [type]: { loading: true, error: null, success: false },
    }));

    try {
      const uploadData = new FormData();
      uploadData.append(type, file);

      const response = await axios.post(
        `/api/profile/upload-${type}`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        updateFormData("documents", type, {
          url: response.data.url,
          publicId: response.data.publicId,
          originalName: file.name,
        });

        setUploadStatus((prev) => ({
          ...prev,
          [type]: { loading: false, error: null, success: true },
        }));
      }
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          loading: false,
          error: error.response?.data?.message || `Error uploading ${type}`,
          success: false,
        },
      }));
    }
  };

  // Transform frontend form data to match backend schema
  const transformFormDataForAPI = () => {
    const fullName = formData.personalInfo.fullName || "";
    const nameParts = fullName.trim().split(/\s+/);
    let firstName = "";
    let middleName = "";
    let lastName = "";

    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else if (nameParts.length > 2) {
      firstName = nameParts[0];
      middleName = nameParts.slice(1, -1).join(" ");
      lastName = nameParts[nameParts.length - 1];
    }

    return {
      // Basic fields from personalInfo
      firstName,
      lastName,
      middleName,
      email: formData.personalInfo.email,
      phone: formData.personalInfo.phone,
      alternatePhone: formData.personalInfo.alternatePhone,
      dateOfBirth: formData.personalInfo.dateOfBirth,
      gender: formData.personalInfo.gender,
      maritalStatus: formData.personalInfo.maritalStatus,
      nationality: formData.personalInfo.nationality,
      
      // Optional fields
      fatherName: formData.personalInfo.fatherName || '',
      aadharNumber: formData.personalInfo.aadharNumber || '',
      
      // Address - use current address as main address
      address: {
        street: formData.address.current.street,
        city: formData.address.current.city,
        state: formData.address.current.state,
        country: formData.address.current.country,
        pincode: formData.address.current.pincode,
        landmark: formData.address.current.landmark,
      },
      
      // Permanent address if different from current
      permanentAddress: formData.address.permanent.sameAsCurrent ? null : {
        street: formData.address.permanent.street,
        city: formData.address.permanent.city,
        state: formData.address.permanent.state,
        country: formData.address.permanent.country,
        pincode: formData.address.permanent.pincode,
        landmark: formData.address.permanent.landmark,
      },
      
      // Education - convert array to Map structure expected by backend
      education: formData.education.filter(e => e.isSaved).reduce((acc, edu, index) => {
        acc[`education_${index}`] = {
          instituteType: edu.type || 'University',
          instituteFields: {
            instituteName: edu.institution || '',
            certificationBody: edu.certificationBody || edu.institution || '',
            passingYear: parseInt(edu.year) || new Date().getFullYear(),
            percentage: parseFloat(edu.percentage) || 0,
            courseType: edu.courseType || 'Full-time',
            courseDuration: parseInt(edu.duration) || 4,
            specialization: edu.field || edu.specialization || '',
            courseName: edu.degree || '',
            trade: edu.trade || '',
          }
        };
        return acc;
      }, {}),
      
      // Experience array
      experience: formData.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        description: exp.description,
      })),
      
      // Professional Information
      professional: {
        currentJobTitle: formData.professional.currentJobTitle,
        currentCompany: formData.professional.currentCompany,
        workExperience: formData.professional.workExperience,
        currentSalary: formData.professional.currentSalary,
        expectedSalary: formData.professional.expectedSalary,
        noticePeriod: formData.professional.noticePeriod,
        workMode: formData.professional.workMode,
        preferredLocations: formData.professional.preferredLocations,
        industryExperience: formData.professional.industryExperience,
        availableFrom: formData.professional.availableFrom,
      },
      
      // Skills - flatten technical and soft skills into array (for backward compatibility)
      skills: [
        ...formData.skills.technical,
        ...formData.skills.soft,
      ],
      
      // Detailed skills breakdown
      skillsDetailed: {
        technical: formData.skills.technical,
        soft: formData.skills.soft,
        certifications: formData.skills.certifications,
      },
      
      // Languages with proficiency
      languages: formData.skills.languages.map(lang => ({
        name: typeof lang === 'string' ? lang : lang.name,
        proficiency: typeof lang === 'object' ? lang.proficiency : 'Intermediate',
      })),
      
      // Documents
      documents: {
        resume: formData.documents.resume,
        profilePicture: formData.documents.profilePicture,
        portfolio: formData.documents.portfolio,
      },
      
      // Social Media and Portfolio Links
      socialLinks: {
        linkedin: formData.links.linkedin,
        github: formData.links.github,
        portfolio: formData.links.portfolio,
        website: formData.links.website,
        other: formData.links.other.map(link => ({
          platform: typeof link === 'object' ? link.platform : 'Other',
          url: typeof link === 'object' ? link.url : link,
        })),
      },
      
      // Job Preferences
      preferences: {
        jobTypes: formData.preferences.jobTypes,
        workShifts: formData.preferences.workShifts,
        disabilities: formData.preferences.disabilities,
        careerObjective: formData.preferences.careerObjective,
      },
      
      // Resume and profile picture (keeping for backward compatibility)
      resume: formData.documents.resume,
      profilePicture: formData.documents.profilePicture?.url || formData.personalInfo.profileImage,
    };
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    // Perform client-side validation for address state and district
    const stateVal = formData.address.current.state;
    const cityVal = formData.address.current.city;
    
    if (!stateVal || stateVal.trim() === "") {
      setUploadStatus(prev => ({
        ...prev,
        submit: { 
          loading: false, 
          error: 'Please select a valid State in the Address section.', 
          success: false 
        }
      }));
      return;
    }
    
    const validDistricts = stateDistricts[stateVal] || [];
    if (!cityVal || cityVal.trim() === "") {
      setUploadStatus(prev => ({
        ...prev,
        submit: { 
          loading: false, 
          error: 'Please select a valid District in the Address section.', 
          success: false 
        }
      }));
      return;
    }

    if (!validDistricts.includes(cityVal)) {
      setUploadStatus(prev => ({
        ...prev,
        submit: { 
          loading: false, 
          error: `Selected District "${cityVal}" does not match the selected State "${stateVal}".`, 
          success: false 
        }
      }));
      return;
    }

    try {
      setUploadStatus(prev => ({
        ...prev,
        submit: { loading: true, error: null, success: false }
      }));

      const transformedData = transformFormDataForAPI();
      console.log('Submitting data:', transformedData);

      const response = await axios.post('/api/profile/create', transformedData);

      if (response.data.success) {
        if (fetchUserFromCookie) {
          await fetchUserFromCookie();
        }
        const pendingJobId = sessionStorage.getItem("pendingJobId");
        const returnUrl = sessionStorage.getItem("returnAfterProfile") || sessionStorage.getItem("previousPath");

        if (pendingJobId && returnUrl && returnUrl.includes(`/job-details/${pendingJobId}`)) {
          toast?.success("Profile completed successfully. Redirecting back to your job application...");
          sessionStorage.setItem("autoApplyPendingJob", "true");

          setUploadStatus(prev => ({
            ...prev,
            submit: { loading: false, error: null, success: true }
          }));

          setTimeout(() => {
            navigate(returnUrl);
          }, 1500);
        } else {
          toast?.success("Profile updated successfully.");
          
          setUploadStatus(prev => ({
            ...prev,
            submit: { loading: false, error: null, success: true }
          }));

          setTimeout(() => {
            if (returnUrl) {
              navigate(returnUrl);
            } else {
              navigate("/candidate/dashboard");
            }
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setUploadStatus(prev => ({
        ...prev,
        submit: { 
          loading: false, 
          error: error.response?.data?.message || 'Failed to save profile', 
          success: false 
        }
      }));
    }
  };

  // Transform API data back to form structure
  const transformAPIDataToForm = (profileData, userData = null) => {
    let fullName = userData?.name || "";
    if (!fullName && (profileData.firstName || profileData.middleName || profileData.lastName)) {
      fullName = [
        profileData.firstName,
        profileData.middleName,
        profileData.lastName
      ].filter(Boolean).join(" ");
    }
    
    return {
      personalInfo: {
        // Prioritize userData for name and email, fallback to profileData
        fullName: fullName || '',
        email: userData?.email || profileData.email || '',
        phone: profileData.phone || '',
        alternatePhone: profileData.alternatePhone || '',
        dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
        gender: profileData.gender || '',
        maritalStatus: profileData.maritalStatus === 'Single' ? 'Unmarried' : (profileData.maritalStatus || ''),
        nationality: profileData.nationality || 'Indian',
        fatherName: profileData.fatherName || '',
        aadharNumber: profileData.aadharNumber || '',
        // Prioritize userData image, then profilePicture, then documents.profilePicture
        profileImage: userData?.image || profileData.profilePicture || profileData.documents?.profilePicture || null,
      },
      address: {
        current: {
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          country: profileData.address?.country || 'India',
          pincode: profileData.address?.pincode || '',
          landmark: profileData.address?.landmark || '',
        },
        permanent: {
          street: profileData.permanentAddress?.street || '',
          city: profileData.permanentAddress?.city || '',
          state: profileData.permanentAddress?.state || '',
          country: profileData.permanentAddress?.country || 'India',
          pincode: profileData.permanentAddress?.pincode || '',
          landmark: profileData.permanentAddress?.landmark || '',
          sameAsCurrent: !profileData.permanentAddress,
        },
      },
      professional: {
        currentJobTitle: profileData.professional?.currentJobTitle || '',
        currentCompany: profileData.professional?.currentCompany || '',
        workExperience: profileData.professional?.workExperience || '',
        currentSalary: profileData.professional?.currentSalary || '',
        expectedSalary: profileData.professional?.expectedSalary || '',
        noticePeriod: profileData.professional?.noticePeriod || '',
        workMode: profileData.professional?.workMode || '',
        preferredLocations: profileData.professional?.preferredLocations || [],
        industryExperience: profileData.professional?.industryExperience || [],
        availableFrom: profileData.professional?.availableFrom ? profileData.professional.availableFrom.split('T')[0] : '',
      },
      education: profileData.education && Object.keys(profileData.education).length > 0 ? Object.values(profileData.education).map(edu => ({
        type: edu.instituteType || '',
        institution: edu.instituteFields?.instituteName || '',
        degree: edu.instituteFields?.courseName || '',
        field: edu.instituteFields?.specialization || '',
        year: edu.instituteFields?.passingYear || '',
        percentage: edu.instituteFields?.percentage || '',
        courseType: edu.instituteFields?.courseType || 'Full Time',
        duration: edu.instituteFields?.courseDuration || '',
        trade: edu.instituteFields?.trade || '',
        universityNotInList: false,
        isSaved: true
      })) : [{
        type: "",
        institution: "",
        degree: "",
        field: "",
        year: "",
        percentage: "",
        courseType: "Full Time",
        universityNotInList: false
      }],
      experience: (profileData.experience || []).map(exp => ({
        ...exp,
        startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
        endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      })),
      skills: {
        technical: profileData.skillsDetailed?.technical || [],
        soft: profileData.skillsDetailed?.soft || [],
        languages: (profileData.languages || []).map(lang => typeof lang === 'object' ? lang.name : lang).filter(Boolean),
        certifications: profileData.skillsDetailed?.certifications || [],
      },
      documents: {
        resume: profileData.documents?.resume || profileData.resume || null,
        profilePicture: profileData.documents?.profilePicture || null,
        portfolio: profileData.documents?.portfolio || null,
      },
      links: {
        linkedin: profileData.socialLinks?.linkedin || '',
        github: profileData.socialLinks?.github || '',
        portfolio: profileData.socialLinks?.portfolio || '',
        website: profileData.socialLinks?.website || '',
        other: profileData.socialLinks?.other || [],
      },
      preferences: {
        jobTypes: profileData.preferences?.jobTypes || [],
        workShifts: profileData.preferences?.workShifts || [],
        disabilities: profileData.preferences?.disabilities || '',
        careerObjective: profileData.preferences?.careerObjective || '',
      },
    };
  };

  // Fetch current user data (for prefilling name and email)
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/users/user');
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
    return null;
  };

  // Fetch existing profile data
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      
      // First fetch current user data
      const userData = await fetchCurrentUser();
      
      // Then fetch profile data
      const response = await axios.get('/api/profile/get-user');
      
      if (response.data.success && response.data.profile) {
        const transformedData = transformAPIDataToForm(response.data.profile, userData);
        setFormData(transformedData);
      } else if (userData) {
        // If no profile exists but we have user data, prefill basic info
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: userData.name || '',
            email: userData.email || '',
            profileImage: userData.image || null,
          }
        }));
      }
    } catch (error) {
      // If no profile exists, that's fine - user is creating new profile
      if (error.response?.status !== 404) {
        console.error('Error fetching profile:', error);
      }
      
      // Still try to prefill user data even if profile fetch fails
      const userData = await fetchCurrentUser();
      if (userData) {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: userData.name || '',
            email: userData.email || '',
            profileImage: userData.image || null,
          }
        }));
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch profile data when component mounts
  React.useEffect(() => {
    fetchProfileData();
  }, []);

  // Update profile completion when form data changes
  React.useEffect(() => {
    setProfileCompletion(calculateCompletion());
  }, [formData]);

  // Show loading indicator while fetching profile data
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-legpro-primary" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-legpro-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-legpro-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Profile Image Upload */}
              <div className="relative group">
                <div
                  onClick={() => profileImageRef.current?.click()}
                  className="w-20 h-20 bg-legpro-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-legpro-primary-hover transition-colors"
                >
                  {formData.documents.profilePicture ? (
                    <img
                      src={formData.documents.profilePicture.url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
                <input
                  type="file"
                  ref={profileImageRef}
                  onChange={(e) =>
                    handleFileUpload(e.target.files[0], "profileImage")
                  }
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Complete Your Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Help employers find the perfect match
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-legpro-primary">
                  {profileCompletion}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#00394d"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={226}
                    strokeDashoffset={226 * (1 - profileCompletion / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <div key={index} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className="flex flex-col items-center gap-2 w-full group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-legpro-primary text-white shadow-lg"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-legpro-primary"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </button>

                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all ${
                        currentStep > index ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Personal Information - Step 0 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.fullName}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "fullName",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">(From your account)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        readOnly
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        placeholder="your.email@example.com"
                      />
                      <div className="absolute right-3 top-3.5">
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Email cannot be changed as it's linked to your account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) =>
                          updateFormData(
                            "personalInfo",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.alternatePhone}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "alternatePhone",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Alternative contact"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) =>
                          updateFormData(
                            "personalInfo",
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.personalInfo.gender}
                      onChange={(e) =>
                        updateFormData("personalInfo", "gender", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Marital Status
                    </label>
                    <select
                      value={formData.personalInfo.maritalStatus}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "maritalStatus",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Address Information - Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="bg-blue-50 border-b-4 border-blue-200 p-4 rounded-t-xl mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Current Location</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <div className="space-y-3 flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-700">
                      State : <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.address.current.state || ""}
                      onChange={(e) => {
                        const stateVal = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            current: {
                              ...prev.address.current,
                              state: stateVal,
                              city: "", // Automatically reset District on State change
                            },
                          },
                        }));
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary bg-white transition-all hover:border-gray-400"
                    >
                      <option value="">Select State</option>
                      {[
                        "Andaman And Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
                        "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", 
                        "Himachal Pradesh", "Jammu And Kashmir", "Jharkhand", "Karnataka", "Kerala", 
                        "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", 
                        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
                        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
                        "Dadra And Nagar Haveli And Daman And Diu", "Tripura", "Uttarakhand", 
                        "Uttar Pradesh", "West Bengal"
                      ].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-700">
                      District : <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.address.current.city || ""}
                      onChange={(e) => updateNestedData("address", "current", "city", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary bg-white transition-all hover:border-gray-400"
                    >
                      <option value="">Select District</option>
                      {(() => {
                        const selectedState = formData.address.current.state;
                        if (!selectedState) return null;
                        const districts = [...(stateDistricts[selectedState] || [])];
                        const currentCity = formData.address.current.city;
                        if (currentCity && !districts.includes(currentCity)) {
                          districts.push(currentCity);
                        }
                        return districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ));
                      })()}
                    </select>
                    {formData.address.current.state && !formData.address.current.city && (
                      <p className="text-xs text-amber-600 font-medium">
                        * Please select a district for {formData.address.current.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Education - Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="bg-blue-50 border-b-4 border-blue-200 p-4 rounded-t-xl mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Qualification Details</h2>
                </div>

                <div className="space-y-12">
                  <div className="p-6 border-2 border-gray-100 rounded-2xl bg-gray-50/30 hover:bg-white hover:border-legpro-primary/20 transition-all">
                    <div className="space-y-8">
                      {/* Education Level Selection */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Education : <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Below 10 Pass", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate"].map((level) => {
                            const eduIndex = formData.education.findIndex(e => e.type === level);
                            const isSelected = eduIndex !== -1;
                            const isSaved = isSelected && formData.education[eduIndex].isSaved;

                            return (
                              <label
                                key={level}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                                  isSelected
                                    ? isSaved
                                      ? "bg-green-500 border-green-500 text-white shadow-md scale-105"
                                      : "bg-legpro-primary border-legpro-primary text-white shadow-md scale-105"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    let updated = [...formData.education];
                                    // Filter out initial empty object
                                    updated = updated.filter(e => e.type && e.type.trim() !== "");

                                    if (isSelected) {
                                      updated = updated.filter(e => e.type !== level);
                                    } else {
                                      updated.push({
                                        type: level,
                                        institution: "",
                                        degree: level.includes("Pass") ? level : "",
                                        field: "",
                                        year: "",
                                        percentage: "",
                                        courseType: "Full Time",
                                        isSaved: false
                                      });
                                    }
                                    if (updated.length === 0) {
                                      updated = [{ type: "", institution: "", degree: "", field: "", year: "", percentage: "", courseType: "Full Time" }];
                                    }
                                    setFormData(prev => ({ ...prev, education: updated }));
                                  }}
                                  className="w-4 h-4 rounded border-gray-300 text-legpro-primary focus:ring-legpro-primary"
                                />
                                {level}
                              </label>
                            );
                          })}
                        </div>
                        {formData.education.filter(e => e.type && e.type.trim() !== "").length === 0 && (
                          <p className="text-sm text-red-500 font-medium mt-1">
                            Please select at least one education qualification.
                          </p>
                        )}
                      </div>

                      {formData.education.filter(e => e.type && e.type.trim() !== "").length === 0 ? (
                        <div className="bg-blue-50/50 rounded-xl p-8 text-center border-2 border-dashed border-blue-200 mt-4">
                          <h3 className="text-xl font-bold text-blue-900 mb-2">
                            Select Your Education Qualification
                          </h3>
                          <p className="text-gray-600">
                            Please choose at least one education qualification to continue filling your academic details.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8 mt-8">
                          {formData.education.filter(e => e.type && e.type.trim() !== "" && !e.isSaved).map((edu) => {
                            const actualIndex = formData.education.findIndex(e => e.type === edu.type);
                            const showCourseName = ["Graduate", "Post Graduate"].includes(edu.type);
                            const showSpecialization = ["ITI", "Diploma", "Graduate", "Post Graduate"].includes(edu.type);
                            
                            return (
                              <div key={edu.type} className="p-6 border-2 border-blue-100 rounded-xl bg-white shadow-sm relative">
                                <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">{edu.type} Details</h3>
                                <div className="grid lg:grid-cols-2 gap-6">
                                  {/* Course Name */}
                                  {showCourseName && (
                                    <div className="space-y-3">
                                      <label className="block text-sm font-semibold text-gray-700">
                                        Course Name: <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={edu.degree || ''}
                                        onChange={(e) => {
                                          const updated = [...formData.education];
                                          updated[actualIndex].degree = e.target.value;
                                          updated[actualIndex].isSaved = false;
                                          setFormData(prev => ({ ...prev, education: updated }));
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., B.Tech, B.Sc, M.A."
                                      />
                                    </div>
                                  )}

                                  {/* Specialization */}
                                  {showSpecialization && (
                                    <div className="space-y-3">
                                      <label className="block text-sm font-semibold text-gray-700">
                                        Specialization (Field of Study) <span className="text-red-500">*</span>
                                      </label>
                                      {edu.type === "ITI" ? (
                                        <select
                                          value={edu.field || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.education];
                                            updated[actualIndex].field = e.target.value;
                                            updated[actualIndex].isSaved = false;
                                            setFormData(prev => ({ ...prev, education: updated }));
                                          }}
                                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all bg-white"
                                        >
                                          <option value="">Select Specialization</option>
                                          <option value="Electrician">Electrician</option>
                                          <option value="Fitter">Fitter</option>
                                          <option value="Welder">Welder</option>
                                          <option value="Mechanic Motor Vehicle (MMV)">Mechanic Motor Vehicle (MMV)</option>
                                          <option value="COPA">Computer Operator and Programming Assistant (COPA)</option>
                                          <option value="Turner">Turner</option>
                                          <option value="Machinist">Machinist</option>
                                          <option value="Other">Other</option>
                                        </select>
                                      ) : edu.type === "Diploma" ? (
                                        <select
                                          value={edu.field || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.education];
                                            updated[actualIndex].field = e.target.value;
                                            updated[actualIndex].isSaved = false;
                                            setFormData(prev => ({ ...prev, education: updated }));
                                          }}
                                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all bg-white"
                                        >
                                          <option value="">Select Specialization</option>
                                          <option value="Computer Science Engineering">Computer Science Engineering</option>
                                          <option value="Information Technology">Information Technology</option>
                                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                                          <option value="Civil Engineering">Civil Engineering</option>
                                          <option value="Electrical Engineering">Electrical Engineering</option>
                                          <option value="Electronics & Communication">Electronics & Communication</option>
                                          <option value="Automobile Engineering">Automobile Engineering</option>
                                          <option value="Chemical Engineering">Chemical Engineering</option>
                                          <option value="Mining Engineering">Mining Engineering</option>
                                          <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                                          <option value="Others">Others</option>
                                        </select>
                                      ) : edu.type === "Graduate" ? (
                                        <select
                                          value={edu.field || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.education];
                                            updated[actualIndex].field = e.target.value;
                                            updated[actualIndex].isSaved = false;
                                            setFormData(prev => ({ ...prev, education: updated }));
                                          }}
                                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all bg-white"
                                        >
                                          <option value="">Select Specialization</option>
                                          <option value="B.Tech - Computer Science Engineering">B.Tech - Computer Science Engineering</option>
                                          <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
                                          <option value="B.Tech - Mechanical Engineering">B.Tech - Mechanical Engineering</option>
                                          <option value="B.Tech - Civil Engineering">B.Tech - Civil Engineering</option>
                                          <option value="B.Tech - Electrical Engineering">B.Tech - Electrical Engineering</option>
                                          <option value="B.Tech - Electronics & Communication">B.Tech - Electronics & Communication</option>
                                          <option value="BCA - Bachelor of Computer Applications">BCA - Bachelor of Computer Applications</option>
                                          <option value="B.Sc - Computer Science">B.Sc - Computer Science</option>
                                          <option value="B.Sc - Information Technology">B.Sc - Information Technology</option>
                                          <option value="B.Sc - Mathematics">B.Sc - Mathematics</option>
                                          <option value="B.Sc - Physics">B.Sc - Physics</option>
                                          <option value="B.Sc - Chemistry">B.Sc - Chemistry</option>
                                          <option value="B.Sc - Biology">B.Sc - Biology</option>
                                          <option value="B.Com - General">B.Com - General</option>
                                          <option value="B.Com - Accounting & Finance">B.Com - Accounting & Finance</option>
                                          <option value="B.Com - Banking & Insurance">B.Com - Banking & Insurance</option>
                                          <option value="BA - English">BA - English</option>
                                          <option value="BA - Hindi">BA - Hindi</option>
                                          <option value="BA - History">BA - History</option>
                                          <option value="BA - Political Science">BA - Political Science</option>
                                          <option value="BA - Economics">BA - Economics</option>
                                          <option value="BA - Sociology">BA - Sociology</option>
                                          <option value="BBA - Bachelor of Business Administration">BBA - Bachelor of Business Administration</option>
                                          <option value="BBA - Marketing">BBA - Marketing</option>
                                          <option value="BBA - Human Resource">BBA - Human Resource</option>
                                          <option value="BBA - Finance">BBA - Finance</option>
                                          <option value="LLB - Bachelor of Law">LLB - Bachelor of Law</option>
                                          <option value="B.Ed - Bachelor of Education">B.Ed - Bachelor of Education</option>
                                          <option value="B.Pharm - Bachelor of Pharmacy">B.Pharm - Bachelor of Pharmacy</option>
                                          <option value="BHM - Hotel Management">BHM - Hotel Management</option>
                                        </select>
                                      ) : edu.type === "Post Graduate" ? (
                                        <select
                                          value={edu.field || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.education];
                                            updated[actualIndex].field = e.target.value;
                                            updated[actualIndex].isSaved = false;
                                            setFormData(prev => ({ ...prev, education: updated }));
                                          }}
                                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all bg-white"
                                        >
                                          <option value="">Select Specialization</option>
                                          {[
                                            "M.Tech - Computer Science Engineering",
                                            "M.Tech - Information Technology",
                                            "M.Tech - Mechanical Engineering",
                                            "M.Tech - Civil Engineering",
                                            "M.Tech - Electrical Engineering",
                                            "M.Tech - Electronics & Communication",
                                            "MCA - Master of Computer Applications",
                                            "M.Sc - Computer Science",
                                            "M.Sc - Information Technology",
                                            "M.Sc - Mathematics",
                                            "M.Sc - Physics",
                                            "M.Sc - Chemistry",
                                            "M.Sc - Biology",
                                            "M.Com - General",
                                            "M.Com - Accounting & Finance",
                                            "M.Com - Banking & Insurance",
                                            "MA - English",
                                            "MA - Hindi",
                                            "MA - History",
                                            "MA - Political Science",
                                            "MA - Economics",
                                            "MA - Sociology",
                                            "MBA - Master of Business Administration",
                                            "MBA - Marketing",
                                            "MBA - Human Resource",
                                            "MBA - Finance",
                                            "LLM - Master of Law",
                                            "M.Ed - Master of Education",
                                            "M.Pharm - Master of Pharmacy",
                                            "Master in Hotel Management"
                                          ].map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input
                                          type="text"
                                          value={edu.field || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.education];
                                            updated[actualIndex].field = e.target.value;
                                            updated[actualIndex].isSaved = false;
                                            setFormData(prev => ({ ...prev, education: updated }));
                                          }}
                                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                                          placeholder="e.g., Computer Science, Marketing"
                                        />
                                      )}
                                    </div>
                                  )}

                                  {/* Passing Year */}
                                  <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                      Passing Year: <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                      <select
                                        value={edu.year}
                                        onChange={(e) => {
                                          const updated = [...formData.education];
                                          updated[actualIndex].year = e.target.value;
                                          updated[actualIndex].isSaved = false;
                                          setFormData(prev => ({ ...prev, education: updated }));
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                                      >
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                          <option key={year} value={year}>{year}</option>
                                        ))}
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!edu.year || (showCourseName && !edu.degree) || (showSpecialization && !edu.field)) return;
                                          const updated = [...formData.education];
                                          updated[actualIndex].isSaved = true;
                                          setFormData(prev => ({ ...prev, education: updated }));
                                        }}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-md"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Saved Box */}
                      {formData.education.some(e => e.isSaved) && (
                        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                          <h4 className="text-lg font-bold text-green-900 mb-4 border-b border-green-200 pb-2">Saved Education Entries</h4>
                          <div className="space-y-4">
                            {formData.education
                              .filter(e => e.isSaved)
                              .sort((a, b) => {
                                const order = ["Below 10 Pass", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate"];
                                return order.indexOf(a.type) - order.indexOf(b.type);
                              })
                              .map((edu) => (
                              <div key={edu.type} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm bg-white p-4 rounded-lg border border-green-100">
                                <div>
                                  <span className="text-green-700/70 font-medium block mb-1">Education</span>
                                  <span className="font-bold text-green-950">✓ {edu.type}</span>
                                </div>
                                {edu.degree && (
                                  <div>
                                    <span className="text-green-700/70 font-medium block mb-1">Course Name</span>
                                    <span className="font-bold text-green-950">{edu.degree}</span>
                                  </div>
                                )}
                                {edu.field && (
                                  <div>
                                    <span className="text-green-700/70 font-medium block mb-1">Specialization</span>
                                    <span className="font-bold text-green-950">{edu.field}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-green-700/70 font-medium block mb-1">Passing Year</span>
                                  <span className="font-bold text-green-950">{edu.year}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio & Documents - Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Portfolio & Documents
                    </h2>
                    <p className="text-gray-600">
                      Upload your resume and add links
                    </p>
                  </div>
                </div>

                <div className="max-w-xl">
                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Resume Upload <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-legpro-primary transition-colors">
                      {formData.documents.resume ? (
                        <div className="space-y-3">
                          <FileText className="w-12 h-12 mx-auto text-green-500" />
                          <p className="font-medium text-gray-900">
                            {typeof formData.documents.resume === 'string'
                              ? formData.documents.resume.split('/').pop()
                              : (formData.documents.resume.originalName || "resume.pdf")}
                          </p>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 text-sm bg-legpro-primary text-white rounded hover:bg-legpro-primary-hover"
                            >
                              Replace
                            </button>
                            <a
                              href={typeof formData.documents.resume === 'string'
                                ? formData.documents.resume
                                : (formData.documents.resume.url || "")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="space-y-3 cursor-pointer"
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Upload Resume
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF, max 5MB
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], "resume")
                        }
                        accept=".pdf"
                        className="hidden"
                      />
                    </div>

                    {uploadStatus.resume.loading && (
                      <div className="text-blue-600 text-sm flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    )}
                    {uploadStatus.resume.error && (
                      <p className="text-red-600 text-sm">
                        {uploadStatus.resume.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {(uploadStatus.submit?.error || uploadStatus.submit?.success) && (
            <div className="px-8 py-4 border-t border-gray-200">
              {uploadStatus.submit?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Error submitting profile</span>
                  </div>
                  <p className="text-red-700 mt-2">{uploadStatus.submit.error}</p>
                </div>
              )}
              
              {uploadStatus.submit?.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Profile submitted successfully!</span>
                  </div>
                  <p className="text-green-700 mt-2">Your profile has been created and saved.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-8 py-6 flex justify-between items-center rounded-b-2xl">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-legpro-primary text-white rounded-lg font-medium hover:bg-legpro-primary-hover transition-all shadow-md hover:shadow-lg"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleFormSubmit}
                  disabled={uploadStatus.submit?.loading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadStatus.submit?.loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving profile...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Submit Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;

import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import DetailsNavbarPage from "./DetailsNavbarPage";

const UserProfileView = ({ profile }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  if (!profile)
    return (
      <div>
        <DetailsNavbarPage />
        <p className="mt-14 text-center">No profile data available.</p>
      </div>
    );

  const {
    userId, // Extract userId from profile
    firstName,
    lastName,
    gender,
    dateOfBirth,
    email,
    phone,
    aadharNumber,
    fatherName,
    address = {},
    skills = [],
    languages = [],
    experience = [],
    education = {},
    resume,
    profilePicture,
  } = profile;

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";
  const handleViewAppliedJobs = () => {
    // Navigate to the new page, passing the userId
    navigate(`/admin/user-job-applications/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
      <DetailsNavbarPage />
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8 mt-20">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{`${firstName || ""} ${lastName || ""}`}</h1>
            <p className="text-gray-600 text-sm mt-1">📧 {email}</p>
            <p className="text-gray-600 text-sm">📞 {phone}</p>
            <p className="text-gray-600 text-sm">🧬 Gender: {gender}</p>
            <p className="text-gray-600 text-sm">🎂 DOB: {formatDate(dateOfBirth)}</p>
          </div>
        </div>

       
        {/* Basic Info & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">🪪 Basic Information</h2>
            <p><strong>Aadhar:</strong> {aadharNumber || "N/A"}</p>
            <p><strong>Father Name:</strong> {fatherName || "N/A"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">📍 Address</h2>
            <p>{address.street}</p>
            <p>{address.city}, {address.state}</p>
            <p>{address.country} - {address.pincode}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">💡 Skills</h2>
          {skills.length ? (
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <li key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills provided.</p>
          )}
        </div>

        {/* Languages */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">🗣️ Languages</h2>
          {languages.length ? (
            <ul className="list-disc list-inside">
              {languages.map((lang, i) => (
                <li key={i}>{lang.name} ({lang.proficiency})</li>
              ))}
            </ul>
          ) : (
            <p>No languages provided.</p>
          )}
        </div>

        {/* Education */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🎓 Education</h2>
          {Object.entries(education).length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(education).map(([key, edu]) => (
                <div key={key} className="border p-4 rounded-lg bg-white shadow-sm">
                  <h3 className="text-legpro-primary font-semibold">{edu.instituteType}</h3>
                  <p><strong>Institute:</strong> {edu.instituteFields.instituteName}</p>
                  <p><strong>Board:</strong> {edu.instituteFields.certificationBody}</p>
                  <p><strong>Year:</strong> {edu.instituteFields.passingYear}</p>
                  <p><strong>Percentage:</strong> {edu.instituteFields.percentage}%</p>
                  {edu.instituteFields.courseType && <p><strong>Course Type:</strong> {edu.instituteFields.courseType}</p>}
                  {edu.instituteFields.courseName && <p><strong>Course Name:</strong> {edu.instituteFields.courseName}</p>}
                  {edu.instituteFields.specialization && <p><strong>Specialization:</strong> {edu.instituteFields.specialization}</p>}
                  {edu.instituteFields.courseDuration && <p><strong>Duration:</strong> {edu.instituteFields.courseDuration} years</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>No education records available.</p>
          )}
        </div>

        {/* Experience */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">💼 Experience</h2>
          {experience.length ? (
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i} className="border p-4 rounded-md bg-white shadow-sm">
                  <h3 className="font-semibold">{exp.position} @ {exp.company}</h3>
                  <p><strong>From:</strong> {formatDate(exp.startDate)}</p>
                  <p><strong>To:</strong> {formatDate(exp.endDate)}</p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No experience provided.</p>
          )}
        </div>

   <div className="flex justify-center gap-2">     {/* Resume */}
        {resume && (
          <div className="text-center">
            <a
              href={typeof resume === 'string' ? resume : (resume?.url || resume?.secure_url || "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-legpro-primary text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              📄 View Resume
            </a>
          </div>
        )}
         {/* Applied Jobs Button */}
        <div className="text-center">
          <button
            onClick={handleViewAppliedJobs}
            className="inline-block bg-legpro-primary text-white px-5 py-2 rounded hover:bg-blue-700 transition shadow-md font-semibold"
          >
            Applied Jobs
          </button>
        </div>
</div>
      </div>
    </div>
  );
};

export default UserProfileView;

// import React from "react";
// import DetailsNavbarPage from "./DetailsNavbarPage";

// const UserProfileView = ({ profile }) => {
//   console.log(profile);
//   if (!profile)
//     return (
//       <div>
//         <DetailsNavbarPage />
//         <p className="mt-14 text-center">No profile data available.</p>
//       </div>
//     );

//   const {
//     firstName,
//     lastName,
//     gender,
//     dateOfBirth,
//     email,
//     phone,
//     aadharNumber,
//     fatherName,
//     address = {},
//     skills = [],
//     languages = [],
//     experience = [],
//     education = {},
//     resume,
//     profilePicture,
//   } = profile;

//   const formatDate = (dateStr) =>
//     dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
//       <DetailsNavbarPage />
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8 mt-20">

//         {/* Profile Header */}
//         <div className="flex flex-col md:flex-row items-center gap-6">
//           {profilePicture ? (
//             <img
//               src={profilePicture}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover shadow-md"
//             />
//           ) : (
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
//               No Image
//             </div>
//           )}
//           <div>
//             <h1 className="text-3xl font-bold">{`${firstName || ""} ${lastName || ""}`}</h1>
//             <p className="text-gray-600 text-sm mt-1">📧 {email}</p>
//             <p className="text-gray-600 text-sm">📞 {phone}</p>
//             <p className="text-gray-600 text-sm">🧬 Gender: {gender}</p>
//             <p className="text-gray-600 text-sm">🎂 DOB: {formatDate(dateOfBirth)}</p>
//           </div>
//         </div>

//         {/* Basic Info & Address */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-gray-50 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">🪪 Basic Information</h2>
//             <p><strong>Aadhar:</strong> {aadharNumber || "N/A"}</p>
//             <p><strong>Father Name:</strong> {fatherName || "N/A"}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">📍 Address</h2>
//             <p>{address.street}</p>
//             <p>{address.city}, {address.state}</p>
//             <p>{address.country} - {address.pincode}</p>
//           </div>
//         </div>

//         {/* Skills */}
//         <div className="bg-gray-50 p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-2">💡 Skills</h2>
//           {skills.length ? (
//             <ul className="flex flex-wrap gap-2">
//               {skills.map((skill, i) => (
//                 <li key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
//                   {skill}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No skills provided.</p>
//           )}
//         </div>

//         {/* Languages */}
//         <div className="bg-gray-50 p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-2">🗣️ Languages</h2>
//           {languages.length ? (
//             <ul className="list-disc list-inside">
//               {languages.map((lang, i) => (
//                 <li key={i}>{lang.name} ({lang.proficiency})</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No languages provided.</p>
//           )}
//         </div>

//         {/* Education */}
//         <div className="bg-gray-50 p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">🎓 Education</h2>
//           {Object.entries(education).length ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {Object.entries(education).map(([key, edu]) => (
//                 <div key={key} className="border p-4 rounded-lg bg-white shadow-sm">
//                   <h3 className="text-legpro-primary font-semibold">{edu.instituteType}</h3>
//                   <p><strong>Institute:</strong> {edu.instituteFields.instituteName}</p>
//                   <p><strong>Board:</strong> {edu.instituteFields.certificationBody}</p>
//                   <p><strong>Year:</strong> {edu.instituteFields.passingYear}</p>
//                   <p><strong>Percentage:</strong> {edu.instituteFields.percentage}%</p>
//                   {edu.instituteFields.courseType && <p><strong>Course Type:</strong> {edu.instituteFields.courseType}</p>}
//                   {edu.instituteFields.courseName && <p><strong>Course Name:</strong> {edu.instituteFields.courseName}</p>}
//                   {edu.instituteFields.specialization && <p><strong>Specialization:</strong> {edu.instituteFields.specialization}</p>}
//                   {edu.instituteFields.courseDuration && <p><strong>Duration:</strong> {edu.instituteFields.courseDuration} years</p>}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No education records available.</p>
//           )}
//         </div>

//         {/* Experience */}
//         <div className="bg-gray-50 p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-2">💼 Experience</h2>
//           {experience.length ? (
//             <div className="space-y-4">
//               {experience.map((exp, i) => (
//                 <div key={i} className="border p-4 rounded-md bg-white shadow-sm">
//                   <h3 className="font-semibold">{exp.position} @ {exp.company}</h3>
//                   <p><strong>From:</strong> {formatDate(exp.startDate)}</p>
//                   <p><strong>To:</strong> {formatDate(exp.endDate)}</p>
//                   <p>{exp.description}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No experience provided.</p>
//           )}
//         </div>

//         {/* Resume */}
//         {resume && (
//           <div className="text-center">
//             <a
//               href={resume}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block bg-legpro-primary text-white px-5 py-2 rounded hover:bg-blue-700 transition"
//             >
//               📄 View Resume
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfileView;

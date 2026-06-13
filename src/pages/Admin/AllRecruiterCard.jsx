// import React from 'react';

// const AllRecruiterCard = ({ recruiter, onToggleAccess }) => {
//   const { _id, name, email, phone, image, havePremiumAccess } = recruiter;

//   return (
//     <div className="bg-white rounded-lg shadow p-4 w-full flex flex-col justify-between text-gray-800">
//       {/* Image & Info */}
//       <div>
//         <img
//           src={image || "https://via.placeholder.com/150"}
//           alt={name}
//           className="w-full h-32 sm:h-36 md:h-28 object-cover rounded-md mb-3"
//         />
//         <h3 className="font-semibold text-base sm:text-lg">🏢 {name}</h3>
//         <p className="text-sm text-gray-700 truncate">📧 {email}</p>
//         <p className="text-sm text-gray-700 truncate">📞 {phone}</p>
//       </div>

//       {/* Button */}
//       <button
//         onClick={() => onToggleAccess(_id, !havePremiumAccess)}
//         className={`mt-4 w-full py-2 rounded-md text-sm font-semibold transition ${
//           havePremiumAccess
//             ? "bg-red-600 hover:bg-red-700 text-white"
//             : "bg-green-600 hover:bg-green-700 text-white"
//         }`}
//       >
//         {havePremiumAccess ? "Revoke Premium Access" : "Grant Premium Access"}
//       </button>
//     </div>
//   );
// };

// export default AllRecruiterCard;

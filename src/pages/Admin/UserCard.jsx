import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const { _id, name, email, image, resume } = user;
  const userId = _id;

  // First letter fallback for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleViewProfile = () => {
    navigate(`/admin/user-profile/${userId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 text-gray-800 w-full flex flex-col justify-between">
      {/* Image or Initial */}
      <div>
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-32 sm:h-36 md:h-28 object-cover rounded-md mb-3"
          />
        ) : (
          <div className="w-full h-32 sm:h-36 md:h-28 bg-blue-100 rounded-md flex items-center justify-center mb-3">
            <span className="text-3xl sm:text-4xl font-bold text-legpro-primary">
              {getInitial(name)}
            </span>
          </div>
        )}

        {/* Name and Email */}
        <h3 className="font-semibold text-base sm:text-lg">{name}</h3>
        <p className="text-sm text-gray-600 break-words">📧 {email}</p>

        {/* Resume Link */}
        {resume && (
          <p className="text-sm text-blue-500 underline mt-1">
            <a href={resume} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </p>
        )}
      </div>

      {/* Button */}
      <button
        className="bg-legpro-primary text-white rounded-md py-2 hover:bg-blue-700 mt-4 text-sm transition"
        onClick={handleViewProfile}
      >
        View Profile
      </button>
    </div>
  );
};

export default UserCard;

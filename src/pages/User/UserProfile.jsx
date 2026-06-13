import React, { useContext } from "react";
import Navbar from "@/Components/Navbar";
import UserProfileForm from "@/Components/Form/UserProfileForm";
import { AppContext } from "../../context/AppContext";

const UserProfile = () => {
  const { userData, profileCompletion } = useContext(AppContext);

  return (
    <>
      <Navbar />

  

      {/* Form Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
        <UserProfileForm />
      </div>
    </>
  );
};

export default UserProfile;


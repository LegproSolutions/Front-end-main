import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserProfileView from "./UserProfileView"; // previously created
const backendUrl = import.meta.env?.VITE_API_URL;
const UserProfileFetch= () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/admin/user-profile/${userId}`
        );
        setProfile(data.profile); // adjust key as per backend response
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <UserProfileView profile={profile} />
    </div>
  );
};

export default UserProfileFetch;

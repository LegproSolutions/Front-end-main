import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("aToken") || "demo-token" // Temporary for testing
  );

  // Update localStorage whenever adminToken changes
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("aToken", adminToken);
    } else {
      localStorage.removeItem("aToken");
    }
  }, [adminToken]);

  const value = {
    adminToken,
    setAdminToken,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
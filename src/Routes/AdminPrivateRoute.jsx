import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Outlet, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const AdminPrivateRoute = () => {
  const {
    isAdminAuthenticated,
    isAdminAuthLoading,
    getIsAdminAuth,
  } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if auth check is done and user is not authenticated as admin
    if (!isAdminAuthLoading && !isAdminAuthenticated && !getIsAdminAuth()) {
      navigate("/unauth");
    }
  }, [isAdminAuthenticated, isAdminAuthLoading, navigate, getIsAdminAuth]);

  if (isAdminAuthLoading || isAdminAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#123abc" size={100} />
      </div>
    );
  }

  return isAdminAuthenticated ? <Outlet /> : null;
};

export default AdminPrivateRoute;



// import React, { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { AppContext } from "../context/AppContext";

// const AdminPrivateRoute = () => {
//   const { isAdminAuthenticated,getIsAdminAuth ,isAdminAuthLoading} = useContext(AppContext);

//   // You can add more checks here to confirm the user is an admin:
//   // e.g. companyData.role === "admin"
  
//   if (!isAdminAuthenticated && !getIsAdminAuth() ) {
//     return <Navigate to="/unauth" replace />;
//   }

//   return <Outlet />;
// };

// export default AdminPrivateRoute;

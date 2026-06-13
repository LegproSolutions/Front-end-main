import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const UserPrivateRoute = () => {
  const { isUserAuthenticated, isUserAuthLoading, isLoggingOut, setShowUserLogin } =
    useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not loading and not authenticated
    if (!isUserAuthLoading && isUserAuthenticated === false) {
      if (isLoggingOut) {
        navigate("/", { replace: true });
      } else {
        setShowUserLogin(true);
        navigate("/", {
          replace: true,
          state: { from: location.pathname },
        });
      }
    }
  }, [
    isUserAuthenticated,
    isUserAuthLoading,
    isLoggingOut,
    location.pathname,
    navigate,
  ]);

  if (isUserAuthLoading || isUserAuthenticated === null)
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

  return isUserAuthenticated ? <Outlet /> : null;
};

export default UserPrivateRoute;

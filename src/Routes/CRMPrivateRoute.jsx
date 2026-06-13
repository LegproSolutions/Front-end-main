import { useAuth } from "../crm/contexts/AuthContext";
import CRMWebLogin from "../crm/pages/Login";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader.js";

const routePermissions = [
  { path: "/dashboard/crm/candidates", permission: "candidate_view" },
  { path: "/dashboard/crm/jobs", permission: "job_view" },
  { path: "/dashboard/crm/pipeline", permission: "application_view" },
  { path: "/dashboard/crm/clients", permission: "client_view" },
  { path: "/dashboard/crm/settings", permission: "settings_view" },
  { path: "/dashboard/crm/calling-portal", permission: "interview_view" },
  { path: "/dashboard/crm/reports", permission: "reports_view" },
  { path: "/dashboard/crm/communications", permission: "settings_view" },
];

const CRMPrivateRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
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

  if (!isAuthenticated) {
    return <CRMWebLogin />;
  }

  const userPerms = user?.permissions || [];
  let parsedPerms = [];
  if (Array.isArray(userPerms)) {
    parsedPerms = userPerms;
  } else if (typeof userPerms === "string") {
    try {
      parsedPerms = JSON.parse(userPerms);
    } catch (e) {
      parsedPerms = [];
    }
  }

  // Expand permissions for backward compatibility and implicit dashboard view
  const expandPermissions = (perms) => {
    const expanded = new Set(perms);
    const mapping = {
      "candidates": ["candidate_view", "candidate_add", "candidate_edit", "candidate_delete"],
      "pipeline": ["application_view", "application_status_update"],
      "jobs": ["job_view", "job_add", "job_edit", "job_delete"],
      "clients": ["client_view", "client_add", "client_edit", "client_delete"],
      "settings": ["settings_view", "settings_manage"],
      "reports": ["reports_view", "reports_export"],
      "dashboard": ["dashboard_view", "dashboard_analytics"]
    };
    perms.forEach(p => {
      if (mapping[p]) {
        mapping[p].forEach(item => expanded.add(item));
      }
    });
    // Auto-grant dashboard_view if user has any other view permission
    const viewPermissions = ["candidate_view", "job_view", "client_view", "application_view", "reports_view"];
    const hasAnyViewPerm = viewPermissions.some(vp => expanded.has(vp));
    if (hasAnyViewPerm) {
      expanded.add("dashboard_view");
    }
    return Array.from(expanded);
  };

  parsedPerms = expandPermissions(parsedPerms);

  const hasWildcard = parsedPerms.includes("*");

  if (!hasWildcard) {
    const matchedRule = routePermissions.find(rule => 
      location.pathname === rule.path || location.pathname.startsWith(rule.path + "/")
    );
    
    if (matchedRule && !parsedPerms.includes(matchedRule.permission)) {
      return <Navigate to="/unauth" replace />;
    }
  }

  return <Outlet />;
};

export default CRMPrivateRoute;

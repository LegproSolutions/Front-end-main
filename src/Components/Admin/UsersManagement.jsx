import { Calendar, Mail, Phone, Search, User, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";

const backendUrl = import.meta.env?.VITE_API_URL;

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [type, setType] = useState("all"); // "all" | "portal" | "crm"
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    portalTotal: 0,
    crmTotal: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Debounce search input â€” wait 500 ms before triggering API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPagination(p => ({ ...p, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchUsers = useCallback(async (pageOverride) => {
    setLoading(true);
    try {
      const currentPage = pageOverride ?? pagination.page;
      const params = new URLSearchParams({
        page: currentPage,
        limit: pagination.limit,
        type,
      });
      if (debouncedQuery) params.set("search", debouncedQuery);

      const res = await axios.get(`${backendUrl}/api/admin/all-users?${params}`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } else {
        toast.error(res.data?.message || "Failed to load users");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Unable to fetch users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedQuery, type]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, debouncedQuery, type]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(p => ({ ...p, page: newPage }));
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");

  const exportUsersCSV = () => {
    if (users.length === 0) {
      toast.error("No users on current page to export.");
      return;
    }
    const rows = users.map((u) => ({
      "Full Name": [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "",
      "Email": u.email || "",
      "Phone": u.phone || "",
      "State": u.address?.state || u.state || "",
      "District": u.address?.district || u.district || "",
      "Education": u.education || "",
      "Trades": u.trades || "",
      "Role": u.type || "User",
      "Source": u.source || "Portal",
      "Joined Date": formatDate(u.createdAt),
    }));
    exportToCSV({ data: rows, filename: `users_page${pagination.page}_${new Date().toISOString().split("T")[0]}` });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/admin/upload-users-csv`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data?.success) {
        toast.success(res.data.message || "Users uploaded successfully");
        fetchUsers(1);
      } else {
        toast.error(res.data?.message || "Failed to upload users");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Error uploading file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Smart page number range with ellipsis
  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const cur   = pagination.page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4)   return [1, 2, 3, 4, 5, "...", total];
    if (cur >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", cur - 1, cur, cur + 1, "...", total];
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Users Management
          </CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
            <span>Total: <strong>{(pagination.total || 0).toLocaleString()}</strong></span>
            {pagination.portalTotal !== undefined && (
              <>
                <span>Portal Users: <strong>{(pagination.portalTotal || 0).toLocaleString()}</strong></span>
                <span>CRM Candidates: <strong>{(pagination.crmTotal || 0).toLocaleString()}</strong></span>
              </>
            )}
            <span className="text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
          </div>
        </CardHeader>

        <CardContent>
          {/* Controls row */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center flex-wrap">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="users-search-input"
                placeholder="Search by name, email, or phoneâ€¦"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type filter pills */}
            <div className="flex gap-1 bg-gray-100 rounded-md p-1">
              {[
                { key: "all",    label: "All" },
                { key: "portal", label: "Portal" },
                { key: "crm",    label: "CRM" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setType(key); setPagination(p => ({ ...p, page: 1 })); }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    type === key
                      ? "bg-legpro-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Upload / Export */}
            <div className="md:ml-auto flex items-center gap-2 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploadingâ€¦" : "Upload CSV"}
              </Button>
              <Button variant="outline" onClick={exportUsersCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Export Page
              </Button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-legpro-primary" />
              <span className="ml-3 text-gray-500">Loading usersâ€¦</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <Card key={user._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-legpro-primary text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                            <Badge
                              variant="secondary"
                              className={
                                user.type === "CRM Candidate"
                                  ? "bg-orange-100 text-orange-700 border-orange-200 whitespace-nowrap text-xs"
                                  : "bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap text-xs"
                              }
                            >
                              {user.type === "CRM Candidate" ? "CRM" : "Portal"}
                            </Badge>
                          </div>
                          {user.email && (
                            <a href={`mailto:${user.email}`} className="mt-1 hover:underline text-sm text-gray-600 flex items-center gap-2 truncate">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </a>
                          )}
                          {user.phone && (
                            <a href={`tel:${user.phone}`} className="mt-1 hover:underline text-sm text-gray-600 flex items-center gap-2 truncate">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{user.phone}</span>
                            </a>
                          )}
                          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(user.createdAt)}
                          </div>
                          {(user.state || user.district) && (
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              ðŸ“ {[user.district, user.state].filter(Boolean).join(", ")}
                            </div>
                          )}
                          {user.trades && (
                            <div className="mt-1 text-xs text-gray-500 truncate">ðŸ”§ {user.trades}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {users.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500">
                    {query ? "Try a different search term." : "No users available."}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-8 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPreviousPage || loading}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>

              {getPageNumbers().map((num, idx) =>
                num === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-500 text-sm">â€¦</span>
                ) : (
                  <Button
                    key={num}
                    variant={pagination.page === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(num)}
                    disabled={loading}
                    className={`min-w-[2rem] ${pagination.page === num ? "bg-legpro-primary text-white" : ""}`}
                  >
                    {num}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Records summary */}
          {pagination.total > 0 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Showing {((pagination.page - 1) * pagination.limit) + 1}â€“
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total.toLocaleString()} users
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;

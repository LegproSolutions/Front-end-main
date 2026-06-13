import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";

const SubAdmins = () => {
  const { backendUrl, adminData, isAdminAuthenticated } = useContext(AppContext);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const isSuperAdmin = adminData?.role === "admin";

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    fetchSubAdmins();
  }, [isAdminAuthenticated]);

  const fetchSubAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/sub-admins`, { withCredentials: true });
      if (data.success) {
        setSubAdmins(data.subAdmins || data.subAdmins || []);
      } else {
        toast.error(data.message || "Failed to load sub-admins");
      }
    } catch (err) {
      console.error("Error fetching sub-admins:", err);
      toast.error("Failed to load sub-admins");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    setCreateLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/sub-admin`, form, { withCredentials: true });
      if (data.success) {
        toast.success("Sub-Admin created");
        setForm({ name: "", email: "", password: "" });
        fetchSubAdmins();
      } else {
        toast.error(data.message || "Failed to create sub-admin");
      }
    } catch (err) {
      console.error("Error creating sub-admin:", err);
      toast.error(err.response?.data?.message || "Failed to create sub-admin");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this sub-admin?")) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/sub-admins/${id}`, { withCredentials: true });
      if (data.success) {
        toast.success("Sub-Admin deleted");
        setSubAdmins((s) => s.filter((x) => String(x._id || x.id) !== String(id)));
      } else {
        toast.error(data.message || "Failed to delete sub-admin");
      }
    } catch (err) {
      console.error("Error deleting sub-admin:", err);
      toast.error(err.response?.data?.message || "Failed to delete sub-admin");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Sub-Admins</h2>
        <p className="mt-4 text-gray-600">You must be signed in as an admin to view this page.</p>
      </div>
    );
  }

  // Only full admin (not sub-admin) may access this page
  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Sub-Admins</h2>
        <p className="mt-4 text-red-600">Unauthorized. Only primary admin can manage sub-admins.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sub-Admins Management</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Create Sub-Admin</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
          <div className="flex gap-2">
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="flex-1 border p-2 rounded" />
            <button type="submit" disabled={createLoading} className="bg-blue-600 text-white px-4 rounded">
                {createLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Existing Sub-Admins</h3>
        {loading ? (
          <p>Loading...</p>
        ) : subAdmins.length === 0 ? (
          <p className="text-gray-500">No sub-admins found.</p>
        ) : (
          <div className="space-y-2">
            {subAdmins.map((s) => (
              <div key={s._id || s.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">Role: {s.role || 'sub-admin'}</div>
                  <button onClick={() => handleDelete(s._id || s.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubAdmins;

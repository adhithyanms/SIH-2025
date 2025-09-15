
import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import { Plus, Edit, Trash2 } from "lucide-react";

interface AccessUser {
  _id: string;
  phoneNumber: string;
  conductorId?: string;
  name: string;
  role: "Admin" | "Conductor";
  assignedRoute?: { _id: string; routeNumber: string } | null;
}

interface RouteItem { _id: string; routeNumber: string }

const Access: React.FC = () => {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [form, setForm] = useState<{
    name?: string;
    phoneNumber?: string;
    conductorId?: string;
    role?: "Admin" | "Conductor" | "";
    assignedBusId?: string;
  }>({ role: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await apiService.getAccessUsers(search, roleFilter);
      const data = Array.isArray(res) ? res : res?.users || [];
      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    }
  };

  // Fetch Routes
  const fetchRoutes = async () => {
    try {
      const res = await apiService.getAllRoutes();
      const data = Array.isArray(res) ? res : res?.routes || [];
      setRoutes(data);
    } catch (err) {
      console.error("Failed to fetch routes", err);
      setRoutes([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoutes();
  }, [search, roleFilter]);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phoneNumber || !form.role) {
      setError("Name, phone and role are required");
      return;
    }

    if (form.role === "Conductor" && !form.assignedRouteId) {
      setError("Conductor must be assigned a route");
      return;
    }

    // Payload for backend
    const payload = {
      name: form.name,
      phoneNumber: form.phoneNumber,
      conductorId: form.conductorId || null,
      role: form.role as "Admin" | "Conductor",
      assignedRoute: form.role === "Conductor" ? form.assignedRouteId : null,
    };

    try {
      if (editingId) {
        await apiService.updateAccess(editingId, payload);
        setEditingId(null);
      } else {
        await apiService.createAccess(payload);
      }

      // Reset form
      setForm({ role: "" });
      fetchUsers();
    } catch (err: any) {
      // Catch backend errors and display
      setError(err.message || "Error saving user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteAccess(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Error deleting user");
    }
  };

  const handleEdit = (user: AccessUser) => {
    setForm({
      name: user.name,
      phoneNumber: user.phoneNumber,
      conductorId: user.conductorId || "",
      role: user.role,
      assignedRouteId: user.assignedRoute?._id || "",
    });
    setEditingId(user._id);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Access Management</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 w-full rounded"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 w-full rounded"
            value={form.phoneNumber || ""}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Conductor ID (optional)"
            className="border p-2 w-full rounded"
            value={form.conductorId || ""}
            onChange={(e) =>
              setForm({ ...form, conductorId: e.target.value })
            }
          />
          <select
            className="border p-2 w-full rounded"
            value={form.role || ""}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as "Admin" | "Conductor" | "",
                assignedRouteId: "",
              })
            }
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Conductor">Conductor</option>
          </select>

          {form.role === "Conductor" && (
            <select
              className="border p-2 w-full rounded"
              value={form.assignedRouteId || ""}
              onChange={(e) =>
                setForm({ ...form, assignedRouteId: e.target.value })
              }
            >
              <option value="">Select Assigned Route</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  Route {route.routeNumber}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Role</th>
            <th className="p-2">Assigned Route</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.phoneNumber}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {u.role === "Conductor" ? u.assignedRoute?.routeNumber || "N/A" : "-"}
              </td>
              <td className="p-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-600 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-600 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Access;

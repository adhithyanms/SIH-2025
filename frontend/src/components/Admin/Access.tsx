
// import React, { useState, useEffect } from "react";
// import apiService from "../../services/api";
// import { Plus, Edit, Trash2 } from "lucide-react";

// interface AccessUser {
//   _id: string;
//   phoneNumber: string;
//   conductorId?: string;
//   name: string;
//   role: "Admin" | "Conductor";
//   assignedBus?: { _id: string; routeNumber: string } | null;
// }

// interface Bus {
//   _id: string;
//   routeNumber: string;
// }

// const Access: React.FC = () => {
//   const [users, setUsers] = useState<AccessUser[]>([]);
//   const [buses, setBuses] = useState<Bus[]>([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [form, setForm] = useState<{
//     name?: string;
//     phoneNumber?: string;
//     conductorId?: string;
//     role?: "Admin" | "Conductor" | "";
//     assignedBusId?: string;
//   }>({ role: "" });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch Access Users
//   const fetchUsers = async () => {
//     try {
//       const res = await apiService.getAccessUsers(search, roleFilter);
//       const data = Array.isArray(res) ? res : res?.users || [];
//       setUsers(data);
//     } catch (err: any) {
//       console.error("Error fetching users:", err);
//       setError(err.message || "Failed to fetch users");
//     }
//   };

//   // Fetch Buses
//   const fetchBuses = async () => {
//     try {
//       const res = await apiService.getAllBuses();
//       console.log("Fetched buses:", res); // debug
//       const data = Array.isArray(res) ? res : res?.buses || [];
//       setBuses(data);
//     } catch (err) {
//       console.error("Failed to fetch buses", err);
//       setBuses([]); // fallback
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchBuses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, roleFilter]);

//   // Submit handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!form.name || !form.phoneNumber || !form.role) {
//       setError("Name, phone and role required");
//       return;
//     }
//     if (form.role === "Conductor" && !form.assignedBusId) {
//       setError("Conductor must be assigned a bus");
//       return;
//     }

//     try {
//       if (editingId) {
//         await apiService.updateAccess(editingId, {
//           name: form.name,
//           phoneNumber: form.phoneNumber,
//           conductorId: form.conductorId,
//           role: form.role as "Admin" | "Conductor",
//           assignedBus: form.role === "Conductor" ? form.assignedBusId : null,
//         });
//         setEditingId(null);
//       } else {
//         await apiService.createAccess({
//           name: form.name,
//           phoneNumber: form.phoneNumber,
//           conductorId: form.conductorId,
//           role: form.role as "Admin" | "Conductor",
//           assignedBus: form.role === "Conductor" ? form.assignedBusId : null,
//         });
//       }

//       setForm({ role: "" });
//       fetchUsers();
//     } catch (err: any) {
//       setError(err.message || "Error saving user");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await apiService.deleteAccess(id);
//       fetchUsers();
//     } catch (err: any) {
//       setError(err.message || "Error deleting user");
//     }
//   };

//   const handleEdit = (user: AccessUser) => {
//     setForm({
//       name: user.name,
//       phoneNumber: user.phoneNumber,
//       conductorId: user.conductorId || "",
//       role: user.role,
//       assignedBusId: user.assignedBus?._id || "",
//     });
//     setEditingId(user._id);
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Access Management</h2>

//       {/* Error message */}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-4 rounded shadow mb-6 space-y-3"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-2 w-full rounded"
//             value={form.name || ""}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Phone Number"
//             className="border p-2 w-full rounded"
//             value={form.phoneNumber || ""}
//             onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Conductor ID (optional)"
//             className="border p-2 w-full rounded"
//             value={form.conductorId || ""}
//             onChange={(e) =>
//               setForm({ ...form, conductorId: e.target.value })
//             }
//           />
//           <select
//             className="border p-2 w-full rounded"
//             value={form.role || ""}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 role: e.target.value as "Admin" | "Conductor" | "",
//                 assignedBusId: "",
//               })
//             }
//           >
//             <option value="">Select Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Conductor">Conductor</option>
//           </select>

//           {/* Show Assigned Bus only if role is Conductor */}
//           {form.role === "Conductor" && Array.isArray(buses) && (
//             <select
//               className="border p-2 w-full rounded"
//               value={form.assignedBusId || ""}
//               onChange={(e) =>
//                 setForm({ ...form, assignedBusId: e.target.value })
//               }
//             >
//               <option value="">Select Assigned Bus</option>
//               {buses.map((bus) => (
//                 <option key={bus._id} value={bus._id}>
//                   Route {bus.routeNumber}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-purple-600 text-white px-4 py-2 rounded flex items-center"
//         >
//           <Plus className="w-4 h-4 mr-1" />
//           {editingId ? "Update User" : "Add User"}
//         </button>
//       </form>

//       {/* Table */}
//       <table className="w-full bg-white rounded shadow">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2">Name</th>
//             <th className="p-2">Phone</th>
//             <th className="p-2">Role</th>
//             <th className="p-2">Assigned Bus</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr key={u._id} className="border-t">
//               <td className="p-2">{u.name}</td>
//               <td className="p-2">{u.phoneNumber}</td>
//               <td className="p-2">{u.role}</td>
//               <td className="p-2">
//                 {u.role === "Conductor"
//                   ? u.assignedBus?.routeNumber || "N/A"
//                   : "-"}
//               </td>
//               <td className="p-2 flex space-x-2">
//                 <button
//                   onClick={() => handleEdit(u)}
//                   className="text-blue-600 flex items-center"
//                 >
//                   <Edit className="w-4 h-4 mr-1" /> Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(u._id)}
//                   className="text-red-600 flex items-center"
//                 >
//                   <Trash2 className="w-4 h-4 mr-1" /> Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Access;
import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import { Plus, Edit, Trash2 } from "lucide-react";

interface AccessUser {
  _id: string;
  phoneNumber: string;
  conductorId?: string;
  name: string;
  role: "Admin" | "Conductor";
  assignedBus?: { _id: string; routeNumber: string } | null;
}

interface Bus {
  _id: string;
  routeNumber: string;
}

const Access: React.FC = () => {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
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

  // Fetch Buses
  const fetchBuses = async () => {
    try {
      const res = await apiService.getAllBuses();
      const data = Array.isArray(res) ? res : res?.buses || [];
      setBuses(data);
    } catch (err) {
      console.error("Failed to fetch buses", err);
      setBuses([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter]);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phoneNumber || !form.role) {
      setError("Name, phone and role are required");
      return;
    }
    if (form.role === "Conductor" && !form.assignedBusId) {
      setError("Conductor must be assigned a bus");
      return;
    }

    const payload = {
      name: form.name,
      phoneNumber: form.phoneNumber,
      conductorId: form.conductorId,
      role: form.role as "Admin" | "Conductor",
      assignedBusId: form.role === "Conductor" ? form.assignedBusId : undefined,
    };

    try {
      if (editingId) {
        await apiService.updateAccess(editingId, payload);
        setEditingId(null);
      } else {
        await apiService.createAccess(payload);
      }

      setForm({ role: "" });
      fetchUsers();
    } catch (err: any) {
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
      assignedBusId: user.assignedBus?._id || "",
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
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
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
                assignedBusId: "",
              })
            }
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Conductor">Conductor</option>
          </select>

          {/* Assigned Bus dropdown for Conductor */}
          {form.role === "Conductor" && (
            <select
              className="border p-2 w-full rounded"
              value={form.assignedBusId || ""}
              onChange={(e) =>
                setForm({ ...form, assignedBusId: e.target.value })
              }
            >
              <option value="">Select Assigned Bus</option>
              {buses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  Route {bus.routeNumber}
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
            <th className="p-2">Assigned Bus</th>
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
                {u.role === "Conductor"
                  ? u.assignedBus?.routeNumber || "N/A"
                  : "-"}
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

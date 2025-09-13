import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Bus,
  Search,
  MoreVertical,
  Check,
  X,
} from "lucide-react";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "conductor" | "passenger" | "admin"
  >("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVerify = async (userId: string) => {
    await fetch(`http://localhost:5000/api/users/${userId}/verify`, {
      method: "PUT",
    });
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isVerified: true } : u))
    );
  };

  const handleToggleStatus = async (userId: string) => {
    await fetch(`http://localhost:5000/api/users/${userId}/status`, {
      method: "PUT",
    });
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      (user.conductorId &&
        user.conductorId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "conductor":
        return <Bus className="w-4 h-4" />;
      case "passenger":
        return <User className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "conductor":
        return "bg-blue-100 text-blue-700";
      case "passenger":
        return "bg-green-100 text-green-700";
      case "admin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6" /> User Management
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="conductor">Conductors</option>
            <option value="passenger">Passengers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Conductors</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === "conductor").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Passengers</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.role === "passenger").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Pending Verification</p>
          <p className="text-2xl font-bold text-yellow-600">
            {users.filter((u) => !u.isVerified).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">
                  User
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">
                  Role
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">
                  Last Active
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.phoneNumber}
                        </div>
                        {user.conductorId && (
                          <div className="text-xs text-gray-500">
                            ID: {user.conductorId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <X className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                    <span
                      className={`ml-2 w-2 h-2 rounded-full ${
                        user.isActive ? "bg-green-400" : "bg-gray-300"
                      }`}
                    ></span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {!user.isVerified && (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          user.isActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {user.isActive ? "Suspend" : "Activate"}
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

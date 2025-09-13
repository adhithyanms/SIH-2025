import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Route as RouteIcon,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/routes";

const RouteManagement: React.FC = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  const [newRoute, setNewRoute] = useState({
    routeNumber: "",
    routeName: "",
    isActive: true,
    stops: [{ name: "", location: { lat: 0, lng: 0 } }],
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRoutes(data.routes || []);
    } catch (err) {
      console.error("Fetch routes error:", err);
    }
  };

  // stops
  const handleAddStop = () => {
    setNewRoute((prev) => ({
      ...prev,
      stops: [...prev.stops, { name: "", location: { lat: 0, lng: 0 } }],
    }));
  };

  const handleRemoveStop = (index: number) => {
    setNewRoute((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const handleStopChange = (
    index: number,
    field: "name" | "lat" | "lng",
    value: string
  ) => {
    setNewRoute((prev) => ({
      ...prev,
      stops: prev.stops.map((stop, i) =>
        i === index
          ? field === "name"
            ? { ...stop, name: value }
            : {
                ...stop,
                location: {
                  ...stop.location,
                  [field]: parseFloat(value) || 0,
                },
              }
          : stop
      ),
    }));
  };

  // create / update
  const handleSaveRoute = async () => {
    try {
      if (editingRouteId) {
        const res = await fetch(`${API_URL}/${editingRouteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRoute),
        });
        const data = await res.json();
        if (res.ok) {
          setRoutes((prev) =>
            prev.map((r) => (r._id === editingRouteId ? data.route : r))
          );
          resetForm();
        } else {
          alert(data.error || "Failed to update route");
        }
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRoute),
        });
        const data = await res.json();
        if (res.ok) {
          setRoutes((prev) => [...prev, data.route]);
          resetForm();
        } else {
          alert(data.error || "Failed to create route");
        }
      }
    } catch (err) {
      console.error("Save route error:", err);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      const res = await fetch(`${API_URL}/${routeId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setRoutes((prev) => prev.filter((r) => r._id !== routeId));
      } else {
        alert(data.error || "Failed to delete route");
      }
    } catch (err) {
      console.error("Delete route error:", err);
    }
  };

  const handleEditRoute = (route: any) => {
    setEditingRouteId(route._id);
    setNewRoute({
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      isActive: route.isActive ?? true,
      stops: route.stops.map((s: any) => ({
        name: s.name,
        location: { lat: s.location.lat, lng: s.location.lng },
      })),
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingRouteId(null);
    setNewRoute({
      routeNumber: "",
      routeName: "",
      isActive: true,
      stops: [{ name: "", location: { lat: 0, lng: 0 } }],
    });
  };

  // -------- UI --------
  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingRouteId ? "Edit Route" : "Create New Route"}
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveRoute}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingRouteId ? "Update Route" : "Save Route"}</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Number
              </label>
              <input
                type="text"
                value={newRoute.routeNumber}
                onChange={(e) =>
                  setNewRoute((prev) => ({
                    ...prev,
                    routeNumber: e.target.value,
                  }))
                }
                placeholder="e.g., 103"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Name
              </label>
              <input
                type="text"
                value={newRoute.routeName}
                onChange={(e) =>
                  setNewRoute((prev) => ({
                    ...prev,
                    routeName: e.target.value,
                  }))
                }
                placeholder="e.g., Downtown - Airport Express"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* stops */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Route Stops
              </label>
              <button
                onClick={handleAddStop}
                className="px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-3">
              {newRoute.stops.map((stop, index) => (
                <div
                  key={index}
                  className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={stop.name}
                      onChange={(e) =>
                        handleStopChange(index, "name", e.target.value)
                      }
                      placeholder={`Stop ${index + 1} name`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    {newRoute.stops.length > 1 && (
                      <button
                        onClick={() => handleRemoveStop(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pl-11">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={stop.location.lat || ""}
                      onChange={(e) =>
                        handleStopChange(index, "lat", e.target.value)
                      }
                      placeholder="Enter latitude"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      value={stop.location.lng || ""}
                      onChange={(e) =>
                        handleStopChange(index, "lng", e.target.value)
                      }
                      placeholder="Enter longitude"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Route Management</h3>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingRouteId(null);
            setNewRoute({
              routeNumber: "",
              routeName: "",
              isActive: true,
              stops: [{ name: "", location: { lat: 0, lng: 0 } }],
            });
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Route</span>
        </button>
      </div>

      <div className="grid gap-6">
        {routes.map((route) => (
          <div
            key={route._id}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RouteIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Route #{route.routeNumber}
                  </h4>
                  <p className="text-gray-600">{route.routeName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    route.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {route.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => handleEditRoute(route)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRoute(route._id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Route Stops ({route.stops.length})
                </h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {route.stops.map((stop: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-900">{stop.name}</span>
                      <span className="text-xs text-gray-500">
                        ({stop.location.lat}, {stop.location.lng})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Distance</div>
                  <div className="font-semibold text-gray-900">~25 km</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Average Journey Time
                  </div>
                  <div className="font-semibold text-gray-900">45 minutes</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Active Buses</div>
                  <div className="font-semibold text-gray-900">3 buses</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteManagement;

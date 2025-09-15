// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// class ApiService {
//   private baseURL: string;

//   constructor(baseURL: string) {
//     this.baseURL = baseURL;
//   }

//   // keep request private — helper methods expose specific endpoints
//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const url = `${this.baseURL}${endpoint}`;

//     const config: RequestInit = {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           (errorData && (errorData.error || errorData.message)) ||
//             `HTTP error! status: ${response.status}`
//         );
//       }

//       // handle 204 No Content
//       if (response.status === 204) {
//         // @ts-ignore
//         return null;
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("API request failed:", error);
//       throw error;
//     }
//   }

//   // =====================
//   // ACCESS / AUTHZ ENDPOINTS (added)
//   // =====================
//   async getAccessUsers(search?: string, role?: string) {
//     const params = new URLSearchParams();
//     if (search) params.append("search", search);
//     if (role) params.append("role", role);
//     const query = params.toString();
//     const endpoint = `/access${query ? `?${query}` : ""}`;

//     return this.request<any[]>(endpoint);
//   }

//   async createAccess(data: {
//     name: string;
//     phoneNumber: string;
//     conductorId?: string;
//     role: "Admin" | "Conductor";
//     assignedBus?: string | null;
//   }) {
//     return this.request("/access", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   }

//   async updateAccess(id: string, data: Partial<{
//     name: string;
//     phoneNumber: string;
//     conductorId?: string;
//     role: "Admin" | "Conductor";
//     assignedBus?: string | null;
//   }>) {
//     return this.request(`/access/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(data),
//     });
//   }

//   async deleteAccess(id: string) {
//     return this.request(`/access/${id}`, {
//       method: "DELETE",
//     });
//   }

//   // =====================
//   // EXISTING PUBLIC METHODS (unchanged)
//   // =====================
//   async sendOTP(phoneNumber: string, role: string, conductorId?: string) {
//     return this.request("/auth/send-otp", {
//       method: "POST",
//       body: JSON.stringify({ phoneNumber, role, conductorId }),
//     });
//   }

//   async verifyOTP(phoneNumber: string, otp: string) {
//     return this.request("/auth/verify-otp", {
//       method: "POST",
//       body: JSON.stringify({ phoneNumber, otp }),
//     });
//   }

//   async getProfile(userId: string) {
//     return this.request(`/auth/profile/${userId}`);
//   }

//   async getAllBuses() {
//     return this.request("/buses");
//   }

//   async getBusesByRoute(routeNumber: string) {
//     return this.request(`/buses/route/${routeNumber}`);
//   }

//   async getConductorBus(conductorId: string) {
//     return this.request(`/buses/conductor/${conductorId}`);
//   }

//   async updateBusLocation(busId: string, lat: number, lng: number) {
//     return this.request(`/buses/${busId}/location`, {
//       method: "PUT",
//       body: JSON.stringify({ lat, lng }),
//     });
//   }

//   async updateCrowdLevel(busId: string, crowdLevel: "low" | "medium" | "high") {
//     return this.request(`/buses/${busId}/crowd-level`, {
//       method: "PUT",
//       body: JSON.stringify({ crowdLevel }),
//     });
//   }

//   async updatePassengerCount(busId: string, passengerCount: number) {
//     return this.request(`/buses/${busId}/passenger-count`, {
//       method: "PUT",
//       body: JSON.stringify({ passengerCount }),
//     });
//   }

//   async getAllRoutes() {
//     return this.request("/routes");
//   }

//   async getRouteByNumber(routeNumber: string) {
//     return this.request(`/routes/${routeNumber}`);
//   }

//   async generateTicket(data: {
//     routeNumber: string;
//     fromStop: string;
//     toStop: string;
//     passengerCount: number;
//     conductorId: string;
//   }) {
//     return this.request("/tickets/generate", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   }

//   async getTicketsByConductor(
//     conductorId: string,
//     startDate?: string,
//     endDate?: string
//   ) {
//     const params = new URLSearchParams();
//     if (startDate) params.append("startDate", startDate);
//     if (endDate) params.append("endDate", endDate);

//     const queryString = params.toString();
//     const endpoint = `/tickets/conductor/${conductorId}${
//       queryString ? `?${queryString}` : ""
//     }`;

//     return this.request(endpoint);
//   }

//   async verifyTicket(qrCode: string) {
//     return this.request(`/tickets/verify/${qrCode}`);
//   }

//   async createAlert(data: {
//     busId: string;
//     type: "emergency" | "breakdown" | "delay" | "info";
//     message: string;
//     conductorId: string;
//   }) {
//     return this.request("/alerts", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   }

//   async getAllAlerts(resolved?: boolean) {
//     const params = new URLSearchParams();
//     if (resolved !== undefined) params.append("resolved", resolved.toString());

//     const queryString = params.toString();
//     const endpoint = `/alerts${queryString ? `?${queryString}` : ""}`;

//     return this.request(endpoint);
//   }

//   async getAlertsByBus(busId: string) {
//     return this.request(`/alerts/bus/${busId}`);
//   }

//   async resolveAlert(alertId: string) {
//     return this.request(`/alerts/${alertId}/resolve`, {
//       method: "PUT",
//     });
//   }

//   async getAnalytics() {
//     return this.request("/analytics");
//   }

//   async healthCheck() {
//     return this.request("/health");
//   }
// }

// export const apiService = new ApiService(API_BASE_URL);
// export default apiService;
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // =====================
  // Generic request handler
  // =====================
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData && (errorData.error || errorData.message)) ||
            `HTTP error! status: ${response.status}`
        );
      }

      // handle 204 No Content
      if (response.status === 204) {
        // @ts-ignore
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // =====================
  // ACCESS ENDPOINTS
  // =====================
  async getAccessUsers(search?: string, role?: string) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    const query = params.toString();
    const endpoint = `/access${query ? `?${query}` : ""}`;

    return this.request<any[]>(endpoint);
  }

  async createAccess(data: {
    name: string;
    phoneNumber: string;
    conductorId?: string;
    role: "Admin" | "Conductor";
    assignedBus?: string | null;
  }) {
    return this.request("/access", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAccess(
    id: string,
    data: Partial<{
      name: string;
      phoneNumber: string;
      conductorId?: string;
      role: "Admin" | "Conductor";
      assignedBus?: string | null;
    }>
  ) {
    return this.request(`/access/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAccess(id: string) {
    return this.request(`/access/${id}`, {
      method: "DELETE",
    });
  }

  // =====================
  // AUTH ENDPOINTS
  // =====================
  async sendOTP(phoneNumber: string, role: string, conductorId?: string) {
    return this.request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, role, conductorId }),
    });
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    return this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, otp }),
    });
  }

  async getProfile(userId: string) {
    return this.request(`/auth/profile/${userId}`);
  }

  // =====================
  // BUS ENDPOINTS
  // =====================
  async getAllBuses() {
    return this.request("/buses");
  }

  async getBusesByRoute(routeNumber: string) {
    return this.request(`/buses/route/${routeNumber}`);
  }

  async getConductorBus(conductorId: string) {
    return this.request(`/buses/conductor/${conductorId}`);
  }

  async updateBusLocation(busId: string, lat: number, lng: number) {
    return this.request(`/buses/${busId}/location`, {
      method: "PUT",
      body: JSON.stringify({ lat, lng }),
    });
  }

  async updateCrowdLevel(
    busId: string,
    crowdLevel: "low" | "medium" | "high"
  ) {
    return this.request(`/buses/${busId}/crowd-level`, {
      method: "PUT",
      body: JSON.stringify({ crowdLevel }),
    });
  }

  async updatePassengerCount(busId: string, passengerCount: number) {
    return this.request(`/buses/${busId}/passenger-count`, {
      method: "PUT",
      body: JSON.stringify({ passengerCount }),
    });
  }

  // =====================
  // ROUTE ENDPOINTS
  // =====================
  async getAllRoutes() {
    return this.request("/routes");
  }

  async getRouteByNumber(routeNumber: string) {
    return this.request(`/routes/${routeNumber}`);
  }

  // =====================
  // TICKET ENDPOINTS
  // =====================
  async generateTicket(data: {
    routeNumber: string;
    fromStop: string;
    toStop: string;
    passengerCount: number;
    conductorId: string;
  }) {
    return this.request("/tickets/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTicketsByConductor(
    conductorId: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const endpoint = `/tickets/conductor/${conductorId}${
      queryString ? `?${queryString}` : ""
    }`;

    return this.request(endpoint);
  }

  async verifyTicket(qrCode: string) {
    return this.request(`/tickets/verify/${qrCode}`);
  }

  // =====================
  // ALERT ENDPOINTS
  // =====================
  async createAlert(data: {
    busId: string;
    type: "emergency" | "breakdown" | "delay" | "info";
    message: string;
    conductorId: string;
  }) {
    return this.request("/alerts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAllAlerts(resolved?: boolean) {
    const params = new URLSearchParams();
    if (resolved !== undefined) params.append("resolved", resolved.toString());

    const queryString = params.toString();
    const endpoint = `/alerts${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint);
  }

  async getAlertsByBus(busId: string) {
    return this.request(`/alerts/bus/${busId}`);
  }

  async resolveAlert(alertId: string) {
    return this.request(`/alerts/${alertId}/resolve`, {
      method: "PUT",
    });
  }

  // =====================
  // ANALYTICS + HEALTH
  // =====================
  async getAnalytics() {
    return this.request("/analytics");
  }

  async healthCheck() {
    return this.request("/health");
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;

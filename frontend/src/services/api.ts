const API_BASE_URL = import.meta.env.BACKEND_URL;

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

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
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
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

  async updateCrowdLevel(busId: string, crowdLevel: "low" | "medium" | "high") {
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
  // ANALYTICS ENDPOINTS
  // =====================
  async getAnalytics() {
    return this.request("/analytics");
  }

  // =====================
  // HEALTH CHECK
  // =====================
  async healthCheck() {
    return this.request("/health");
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;

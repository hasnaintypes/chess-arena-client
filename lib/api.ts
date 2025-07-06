const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * API client with authentication and error handling
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: any }> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Handle non-JSON responses (like 404 HTML pages)
        if (response.status === 404) {
          throw new Error("The requested resource was not found");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later");
        } else if (response.status === 403) {
          throw new Error("Access denied. Please check your permissions");
        } else if (response.status === 401) {
          throw new Error("Authentication required. Please log in");
        } else {
          throw new Error("Network error. Please check your connection");
        }
      }

      const data = await response.json();

      if (!response.ok) {
        // Extract friendly error message from server response
        const errorMessage =
          data.error?.message ||
          data.message ||
          this.getFriendlyErrorMessage(response.status);

        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);

      // Handle network errors
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection"
        );
      }

      // Handle JSON parsing errors
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        throw new Error("Server returned invalid data. Please try again");
      }

      // Re-throw with original message if it's already user-friendly
      throw error;
    }
  }

  /**
   * Get friendly error message based on HTTP status code
   */
  private getFriendlyErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return "Invalid request. Please check your input";
      case 401:
        return "Authentication required. Please log in";
      case 403:
        return "Access denied. You don't have permission to perform this action";
      case 404:
        return "The requested resource was not found";
      case 409:
        return "This action conflicts with existing data";
      case 422:
        return "Invalid data provided. Please check your input";
      case 429:
        return "Too many requests. Please wait a moment and try again";
      case 500:
        return "Server error. Please try again later";
      case 502:
        return "Server temporarily unavailable. Please try again later";
      case 503:
        return "Service temporarily unavailable. Please try again later";
      default:
        return "An error occurred. Please try again";
    }
  }

  // Authentication methods
  async register(userData: {
    username: string;
    email: string;
    password: string;
    country?: string;
  }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" });
  }

  async getMe() {
    return this.request("/auth/me");
  }

  async updateProfile(data: any) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Game methods
  async getGameHistory(params?: {
    page?: number;
    limit?: number;
    result?: string;
    gameType?: string;
    timeControl?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }

    return this.request(`/games/history?${searchParams}`);
  }

  async getGame(gameId: string) {
    if (!gameId || gameId.trim() === "") {
      throw new Error("Game ID is required");
    }
    return this.request(`/games/${gameId}`);
  }

  async getGameByRoom(roomId: string) {
    return this.request(`/games/room/${roomId}`);
  }

  async getUserStats(username: string) {
    return this.request(`/games/stats/${username}`);
  }

  // Room methods
  async getRooms(params?: {
    status?: string;
    gameType?: string;
    timeControl?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }

    return this.request(`/rooms?${searchParams}`);
  }

  async createRoom(roomData: {
    name: string;
    timeControl: string;
    gameType: string;
    maxPlayers?: number;
    isPrivate?: boolean;
    password?: string;
    minRating?: number;
    maxRating?: number;
  }) {
    return this.request("/rooms", {
      method: "POST",
      body: JSON.stringify(roomData),
    });
  }

  async joinRoom(roomId: string, data?: { password?: string; color?: string }) {
    return this.request(`/rooms/${roomId}/join`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  }

  async leaveRoom(roomId: string) {
    return this.request(`/rooms/${roomId}/leave`, { method: "POST" });
  }

  // Leaderboard methods
  async getLeaderboard(params?: {
    timeControl?: string;
    timeframe?: string;
    limit?: number;
    page?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }

    return this.request(`/leaderboard?${searchParams}`);
  }

  async getUserPosition(username: string, timeControl?: string) {
    const searchParams = new URLSearchParams();
    if (timeControl) searchParams.append("timeControl", timeControl);

    return this.request(`/leaderboard/position/${username}?${searchParams}`);
  }
}

export const apiClient = new ApiClient();

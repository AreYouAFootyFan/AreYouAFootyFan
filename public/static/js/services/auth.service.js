import { navigator } from "../index.js";

class AuthService {
  constructor() {
    this.token = localStorage.getItem("authToken");
    this.user = JSON.parse(localStorage.getItem("user") || "null");
    this.googleClientId =
      "139220435832-r9666l09203vjkd9bf74rlbnogc75vh7.apps.googleusercontent.com";
  }

  isAuthenticated() {
    return !!this.token;
  }

  hasUsername() {
    return this.user && !!this.user.username;
  }

  isQuizMaster() {
    return this.user && this.user.role_id === 2;
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  getUser() {
    return this.user;
  }

  async loginWithGoogle(googleCode) {
    try {
      const response = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: googleCode }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem("authToken", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));

      return {
        requiresUsername: data.requiresUsername,
        user: data.user,
      };
    } catch (error) {
      throw error;
    }
  }

  async setUsername(username) {
    try {
      const response = await fetch("/api/users/username", {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to set username");
      }

      const user = await response.json();
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigator("/");
  }

  async refreshUserData() {
    if (!this.token) return Promise.reject("Not authenticated");

    try {
      const response = await fetch("/api/users/me", {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return Promise.reject("Session expired");
        }
        throw new Error("Failed to get user data");
      }

      const user = await response.json();
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkAuthentication() {
    if (!this.token) {
      return false;
    }

    try {
      await this.refreshUserData();
      return true;
    } catch (error) {
      return false;
    }
  }

  initGoogleSignIn(callback) {
    window.handleCredentialResponse = (response) => {
      callback(response.credential);
    };
  }

  getAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: "http://localhost:3000/",
      client_id:
        "919528168572-5i38f4pli5j6a7q7q1s6jibuomlbbdpa.apps.googleusercontent.com",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const queryString = new URLSearchParams(options);

    return `${rootUrl}?${queryString.toString()}`;
  }
}

const authService = new AuthService();
export default authService;

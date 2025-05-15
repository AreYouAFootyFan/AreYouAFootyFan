import { navigator } from "../index.js";
import { Message, Http, Storage } from "../enums/index.js";

class AuthService {
  constructor() {
    this.token = localStorage.getItem(Storage.Key.Auth.TOKEN);
    this.user = JSON.parse(localStorage.getItem(Storage.Key.Auth.USER) || "null");
    this.googleClientId = "139220435832-r9666l09203vjkd9bf74rlbnogc75vh7.apps.googleusercontent.com";
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
      const response = await fetch(Http.Api.Auth.GOOGLE_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: googleCode }),
      });

      if (!response.ok) {
        throw new Error(Message.Error.Auth.LOGIN_FAILED);
      }

      const data = await response.json();
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem(Storage.Key.Auth.TOKEN, this.token);
      localStorage.setItem(Storage.Key.Auth.USER, JSON.stringify(this.user));

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
      const response = await fetch(Http.Api.Auth.SET_USERNAME, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(Message.Error.Auth.FAILED_USERNAME);
      }

      const user = await response.json();
      this.user = user;
      localStorage.setItem(Storage.Key.Auth.USER, JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem(Storage.Key.Auth.TOKEN);
    localStorage.removeItem(Storage.Key.Auth.USER);
    navigator("/");
  }

  async refreshUserData() {
    if (!this.token) return Promise.reject(Message.Error.Auth.NOT_AUTHENTICATED);

    try {
      const response = await fetch(Http.Api.Auth.GET_USER, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === Http.Status.UNAUTHORIZED) {
          this.logout();
          return Promise.reject(Message.Error.Auth.SESSION_EXPIRED);
        }
        throw new Error(Message.Error.Auth.FAILED_USER_DATA);
      }

      const user = await response.json();
      this.user = user;
      localStorage.setItem(Storage.Key.Auth.USER, JSON.stringify(user));

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
    const rootUrl = Http.Api.Google.AUTH_URL;

    const options = {
      redirect_uri: "http://localhost:3000/",
      client_id:
        "919528168572-5i38f4pli5j6a7q7q1s6jibuomlbbdpa.apps.googleusercontent.com",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: Http.Api.Google.SCOPES.join(" "),
    };

    const queryString = new URLSearchParams(options);

    return `${rootUrl}?${queryString.toString()}`;
  }
}

const authService = new AuthService();
export default authService;

import { StyleLoader } from "../../utils/cssLoader.js";
import { Role } from "../../enums/users.js";
import "./ProfileStats.js";
import "./ProfileCategories.js";
import "./ProfileBadges.js";
import "./QuizHistory.js";
import { navigator } from "../../index.js";

class UserProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.user = null;
    this.userStats = null;
    this.errorMessage = "";
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    this.userStats = await this.getStats();
    await this.loadStyles();
    this.render();
    this.loadUserData();
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/profile/profile.css"
    );
  }

  render() {
    const main = document.createElement("main");
    main.className = "profile-page";

    const header = document.createElement("header");
    header.className = "page-header";
    const h1 = document.createElement("h1");
    h1.textContent = "Your Info";
    header.appendChild(h1);

    const section = document.createElement("section");
    section.className = "profile-grid";

    const article = document.createElement("article");
    article.className = "profile-card";
    article.id = "profile-content";

    const loadingSection = document.createElement("section");
    loadingSection.className = "loading-container";
    const spinner = document.createElement("i");
    spinner.className = "loading-spinner";
    spinner.setAttribute("aria-hidden", "true");
    const p = document.createElement("p");
    p.textContent = "Loading user data...";

    loadingSection.appendChild(spinner);
    loadingSection.appendChild(p);
    article.appendChild(loadingSection);
    section.appendChild(article);

    main.appendChild(header);
    main.appendChild(section);

    const stats = this.createUserStatsView(this.userStats);
    main.appendChild(stats);

    const quizHistory = document.createElement("quiz-history");
    main.appendChild(quizHistory);

    this.shadowRoot.appendChild(main);
  }

  createUserStatsView(userStats) {
    const authService = window.authService;

    const statsView = document.createElement("section");
    statsView.id = "user-stats-view";

    // Header
    const statsHeader = document.createElement("header");
    statsHeader.className = "page-header";

    const statsTitle = document.createElement("h1");
    statsTitle.textContent = "Your Quiz Stats";

    statsHeader.appendChild(statsTitle);
    statsView.appendChild(statsHeader);

    // Stats Summary
    const user = authService.getUser();
    const isPlayer = user.role_id === 1;

    const statsSummary = document.createElement("profile-stats");
    statsSummary.id = "user-stats-summary";
    if (isPlayer) {
      statsSummary.setAttribute(
        "statistics",
        JSON.stringify({
          role: "Player",
          elo: userStats.elo,
          rank: userStats.rank,
          quizzesCompleted: userStats.quizzesCompleted,
          avgScore: userStats.avgScore,
        })
      );
    } else {
      statsSummary.setAttribute(
        "statistics",
        JSON.stringify({
          role: "Manager",
          quizzesCreated: userStats.quizzesCreated,
          quizAttempts: userStats.quizAttempts,
          rank: userStats.rank,
          avgScore: userStats.avgScore,
        })
      );
    }

    statsView.appendChild(statsSummary);

    // Cards for Top Categories and Badges
    const statsCards = document.createElement("section");
    statsCards.className = "admin-cards";

    // Top Categories Card
    const topCategoriesCard = document.createElement("top-categories");
    topCategoriesCard.setAttribute("title", "Your 3 Best Categories");

    const categories = [];
    userStats.topCategories.forEach((category) => {
      if (isPlayer) {
        categories.push({
          role: "Player",
          name: category.name,
          averageScore: parseFloat(category.accuracy),
        });
      } else {
        categories.push({
          role: "Manager",
          name: category.name,
          count: parseInt(category.count),
        });
      }
    });

    topCategoriesCard.setAttribute(
      "data-top-categories",
      JSON.stringify(categories)
    );

    statsCards.appendChild(topCategoriesCard);

    // Badges Card
    if (isPlayer) {
      const badgesCard = document.createElement("badges-earned");
      badgesCard.setAttribute("title", "Badges Earned");

      const badgeMap = {
        Rookie: { src: "./static/img/badges/rookie.png", alt: "" },
        Amateur: { src: "./static/img/badges/amateur.png", alt: "" },
        "Semi-Pro": { src: "./static/img/badges/semi-pro.png", alt: "" },
        Professional: { src: "./static/img/badges/professional.png", alt: "" },
        "World Class": { src: "./static/img/badges/world-class.png", alt: "" },
        Legendary: { src: "./static/img/badges/legendary.png", alt: "" },
      };

      const badges = userStats.badges
        .map((name) => badgeMap[name])
        .filter(Boolean);

      badgesCard.setAttribute("badges-earned", JSON.stringify(badges));
      statsCards.appendChild(badgesCard);
    }
    statsView.appendChild(statsCards);

    return statsView;
  }

  async loadUserData() {
    try {
      if (!authService || !authService.isAuthenticated()) {
        navigator("/");
        return;
      }

      this.user = authService.getUser();

      if (!this.user) {
        this.showError("Failed to load user data.");
        return;
      }

      this.updateUserInfo();
    } catch (error) {
      this.showError(
        "Failed to load user data: " + (error.message || "Unknown error")
      );
    }
  }

  async getStats() {
    try {
      const statsService = window.statsService;
      if (statsService) {
        const stats = await statsService.getProfileStats();
        return stats;
      }
    } catch (error) {
      statsComponent.setError(error);
    }
  }

  updateUserInfo() {
    const profileContent = this.shadowRoot.querySelector("#profile-content");
    if (!profileContent) return;

    while (profileContent.firstChild) {
      profileContent.removeChild(profileContent.firstChild);
    }

    const roleName =
      this.user.role_name ||
      (this.user.role_id === 2 ? Role.Manager : Role.Player);

    const profileHeader = document.createElement("header");
    profileHeader.className = "profile-header";

    const profileInfo = document.createElement("section");
    profileInfo.className = "profile-info";

    const h2 = document.createElement("h2");
    h2.id = "profile-username";
    h2.textContent = this.user.username || "Username";

    const rank = document.createElement("p");
    rank.className = "profile-rank";
    rank.textContent = roleName;

    profileInfo.appendChild(h2);
    profileInfo.appendChild(rank);
    profileHeader.appendChild(profileInfo);
    profileContent.appendChild(profileHeader);

    // Form
    const form = document.createElement("form");
    form.id = "profile-form";
    form.className = "profile-form";

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "Update Username";

    const label = document.createElement("label");
    label.setAttribute("for", "edit-username");
    label.textContent = "New Username: ";

    const input = document.createElement("input");
    input.type = "text";
    input.id = "edit-username";
    input.value = this.user.username || "";
    input.required = true;
    input.minLength = 3;
    input.maxLength = 32;

    fieldset.appendChild(legend);
    fieldset.appendChild(label);
    fieldset.appendChild(input);
    form.appendChild(fieldset);

    const footer = document.createElement("footer");
    footer.className = "form-actions";

    const button = document.createElement("button");
    button.type = "submit";
    button.className = "btn btn-primary";
    button.textContent = "Save Changes";

    footer.appendChild(button);
    form.appendChild(footer);

    if (this.errorMessage) {
      const error = document.createElement("p");
      error.className = "message error-message";
      error.textContent = this.errorMessage;
      form.appendChild(error);
    }

    profileContent.appendChild(form);

    form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const usernameInput = this.shadowRoot.querySelector("#edit-username");
    if (!usernameInput) return;

    const username = usernameInput.value.trim();

    if (username.length < 3 || username.length > 32) {
      this.showError("Username must be between 3 and 32 characters");
      return;
    }

    if (username === this.user.username) {
      return;
    }

    try {
      const authService = window.authService;

      if (!authService || !authService.setUsername) {
        this.showError("Authentication service not available");
        return;
      }

      this.user = await authService.setUsername(username);

      const usernameElement =
        this.shadowRoot.querySelector("#profile-username");
      if (usernameElement) {
        usernameElement.textContent = this.user.username;
      }

      this.errorMessage = "";
      this.updateUserInfo();
      this.showSuccessMessage("Username updated successfully!");

      if (
        window.updateHeaderUI &&
        typeof window.updateHeaderUI === "function"
      ) {
        window.updateHeaderUI();
      }
    } catch (error) {
      this.showError(
        "Failed to update username: " +
          (error.message || "Username may already be taken")
      );
    }
  }

  showError(message) {
    this.errorMessage = message;
    this.updateUserInfo();
  }

  showSuccessMessage(message) {
    const formActions = this.shadowRoot.querySelector(".form-actions");
    if (!formActions) return;

    const existingMessage = this.shadowRoot.querySelector(".success-message");
    if (existingMessage) existingMessage.remove();

    const successMessage = document.createElement("p");
    successMessage.className = "message success-message";
    successMessage.textContent = message;

    formActions.insertAdjacentElement("afterend", successMessage);

    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 3000);
  }
}

customElements.define("user-profile", UserProfile);

export default UserProfile;

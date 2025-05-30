import { StyleLoader } from "../utils/cssLoader.js";
import { Role } from "../enums/index.js";
import { clearDOM } from "../utils/domHelpers.js";
import { navigator } from "../index.js";
import authService from "../services/auth.service.js";

class FootballQuizHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.user = null;
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    this.setupEventListeners();

    window.addEventListener("popstate", () => this.updateActiveNavLink());

    setTimeout(() => {
      this.updateUserUI();
    }, 50);
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/header/header.css"
    );
  }

  render() {
    clearDOM(this.shadowRoot);

    const header = document.createElement("header");

    const headerTop = document.createElement("section");
    headerTop.className = "header-top";

    const headerTopInner = document.createElement("section");
    headerTopInner.className = "header-top-inner";

    const logoSection = document.createElement("section");
    logoSection.className = "logo-section";

    const logo = document.createElement("a");
    logo.href = "/";
    logo.className = "logo";
    logo.dataset.link = "";

    const logoIcon = document.createElement("fig");
    logoIcon.className = "logo-icon";
    logoIcon.setAttribute("aria-hidden", "true");
    logoIcon.textContent = "⚽";

    const logoHeading = document.createElement("h1");
    logoHeading.textContent = "Football Quiz";

    logo.appendChild(logoIcon);
    logo.appendChild(logoHeading);
    logoSection.appendChild(logo);

    const userMenu = document.createElement("section");
    userMenu.className = "user-menu";

    const loginBtn = document.createElement("a");
    loginBtn.href = "/login";
    loginBtn.className = "login-btn nav-link";
    loginBtn.dataset.link = "";
    loginBtn.textContent = "Login";

    const userDropdown = document.createElement("section");
    userDropdown.id = "user-dropdown";
    userDropdown.className = "user-dropdown hidden";

    const usernameBtn = document.createElement("button");
    usernameBtn.type = "button";
    usernameBtn.className = "username-btn";
    usernameBtn.id = "username-display";
    usernameBtn.textContent = "Username";

    const dropdownMenu = document.createElement("nav");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.setAttribute("aria-label", "User menu");

    const dropdownList = document.createElement("ul");
    dropdownList.className = "dropdown-list";

    const logoutItem = document.createElement("li");
    const logoutButton = document.createElement("button");
    logoutButton.id = "logout-button";
    logoutButton.type = "button";
    logoutButton.className = "logout-btn";
    logoutButton.textContent = "Log Out";
    logoutItem.appendChild(logoutButton);

    const profileItem = document.createElement("li");
    const profileButton = document.createElement("button");
    profileButton.id = "profile-button";
    profileButton.type = "button";
    profileButton.className = "logout-btn";
    profileButton.textContent = "Profile";
    profileButton.addEventListener("click", (event) => {
      event.preventDefault();
      dropdownMenu.classList.toggle("visible");
      navigator("/profile");
    });
    profileItem.appendChild(profileButton);

    const quizmakerItem = document.createElement("li");

    const quizmakerButton = document.createElement("button");
    quizmakerButton.id = "quizmaker-button";
    quizmakerButton.type = "button";
    quizmakerButton.className = "logout-btn";
    quizmakerButton.textContent = "Become a manager";

  
    quizmakerItem.appendChild(quizmakerButton);
    
    dropdownList.appendChild(quizmakerItem);

    dropdownList.appendChild(logoutItem);
    dropdownList.appendChild(profileItem);

    dropdownMenu.appendChild(dropdownList);

    userDropdown.appendChild(usernameBtn);
    userDropdown.appendChild(dropdownMenu);

    userMenu.appendChild(loginBtn);
    userMenu.appendChild(userDropdown);

    headerTopInner.appendChild(logoSection);
    headerTopInner.appendChild(userMenu);

    headerTop.appendChild(headerTopInner);

    const headerNav = document.createElement("section");
    headerNav.className = "header-nav";

    const navInner = document.createElement("nav");
    navInner.className = "nav-inner";

    const navList = document.createElement("ul");
    navList.className = "nav-list";

    const homeItem = document.createElement("li");
    homeItem.className = "nav-item";

    const homeLink = document.createElement("a");
    homeLink.href = "/home";
    homeLink.className = "nav-link";
    homeLink.dataset.link = "";
    homeLink.textContent = "Home";

    homeItem.appendChild(homeLink);

    const leaderboardItem = document.createElement("li");
    leaderboardItem.className = "nav-item";

    const leaderboard = document.createElement("a");
    leaderboard.href = "/leaderboard";
    leaderboard.className = "nav-link";
    leaderboard.dataset.link = "";
    leaderboard.textContent = "Leaderboard";
    leaderboardItem.appendChild(leaderboard);

    const gameModeItem = document.createElement("li");
    gameModeItem.className = "nav-item";

    const gameModeLink = document.createElement("a");
    gameModeLink.href = "/game-modes";
    gameModeLink.className = "nav-link";
    gameModeLink.dataset.link = "";
    gameModeLink.textContent = "Play";

    gameModeItem.appendChild(gameModeLink);

    const adminItem = document.createElement("li");
    adminItem.className = "nav-item admin-item hidden";

    const adminLink = document.createElement("a");
    adminLink.href = "/admin";
    adminLink.className = "nav-link admin-link";
    adminLink.dataset.link = "";
    adminLink.textContent = Role.Manager;

    adminItem.appendChild(adminLink);

    navList.appendChild(homeItem);
    navList.appendChild(gameModeItem);
    navList.appendChild(adminItem);
    navList.appendChild(leaderboardItem);

    navInner.appendChild(navList);
    headerNav.appendChild(navInner);

    header.appendChild(headerTop);
    header.appendChild(headerNav);

    this.shadowRoot.appendChild(header);
  }

  setupEventListeners() {
    const usernameButton = this.shadowRoot.querySelector(".username-btn");
    const dropdownMenu = this.shadowRoot.querySelector(".dropdown-menu");
    const userDropdown = this.shadowRoot.querySelector("#user-dropdown");
    const quizmakerButton = this.shadowRoot.querySelector("#quizmaker-button");


    if (usernameButton && dropdownMenu) {
      usernameButton.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        dropdownMenu.classList.toggle("visible");
      });
    }

    const logoutButton = this.shadowRoot.querySelector("#logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => this.handleLogout());
    }

    document.addEventListener("click", (event) => {
      const dropdownMenu = this.shadowRoot.querySelector(".dropdown-menu");
      if (dropdownMenu && dropdownMenu.classList.contains("visible")) {
        const path = event.composedPath();
        if (!path.includes(userDropdown)) {
          dropdownMenu.classList.remove("visible");
        }
      }
    });

    quizmakerButton.addEventListener("click", (event) => {
      event.preventDefault();
      const username =  authService.getUser().username;
      const subject = encodeURIComponent("Quizmaker Request");
      const body = encodeURIComponent(
        `Hey , I would like to become a Manager \n Thak you \n kind regards \n ${username} `
      );
      const mailtoLink = `mailto:tevlen.naidoo@bbd.co.za?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
    });

    this.shadowRoot.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        window.history.pushState(null, null, href);
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    });
  }

  updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const linkPath = new URL(link.href).pathname;

      if (
        linkPath === currentPath ||
        (linkPath === "/home" &&
          (currentPath === "/" || currentPath === "/home")) ||
        (linkPath !== "/home" &&
          currentPath.startsWith(linkPath) &&
          linkPath !== "/")
      ) {
        link.classList.add("active");
      }
    });
  }

  updateUserUI() {
    const authService = window.authService;

    if (!authService) {
      return;
    }

    const isAuthenticated = authService.isAuthenticated();
    const loginLink = this.shadowRoot.querySelector(".login-btn");
    const userDropdown = this.shadowRoot.querySelector("#user-dropdown");
    const usernameDisplay = this.shadowRoot.querySelector("#username-display");
    const adminItem = this.shadowRoot.querySelector(".admin-item");

    if (isAuthenticated) {
      const user = authService.getUser();

      if (loginLink) loginLink.classList.add("hidden");
      if (userDropdown) {
        userDropdown.classList.remove("hidden");
        if (usernameDisplay && user) {
          usernameDisplay.textContent = user.username || "User";
        }
      }

      if (adminItem) {
        if (authService.isQuizMaster && authService.isQuizMaster()) {
          adminItem.classList.remove("hidden");
        } else {
          adminItem.classList.add("hidden");
        }
      }
    } else {
      if (loginLink) loginLink.classList.remove("hidden");
      if (userDropdown) userDropdown.classList.add("hidden");
      if (adminItem) adminItem.classList.add("hidden");
    }
  }

  handleLogout() {
    const authService = window.authService;

    if (authService && typeof authService.logout === "function") {
      authService.logout();
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigator("/");
    }
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.updateActiveNavLink);
  }
}

customElements.define("football-quiz-header", FootballQuizHeader);

export default FootballQuizHeader;

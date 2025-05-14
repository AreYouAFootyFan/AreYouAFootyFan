import { StyleLoader } from "../../utils/cssLoader.js";
import { Role } from "../../enums/users.js";
import { clearDOM } from "../../utils/domHelpers.js";
import "../../components/widgets/LiveScores.js";


class QuizHome extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.quizzes = [];
    this.categories = [];
    this.selectedCategory = "";
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    await this.loadStyles();
    this.shadowRoot.innerHTML = "";
    await this.render();
    this.setupEventListeners();
    await this.loadData();
    this.checkUserRole();
    
    // Create and append the live scores widget
    this.initializeLiveScores();
  }

  disconnectedCallback() {
    // Remove the live scores widget when navigating away
    const liveScores = document.querySelector('live-scores');
    if (liveScores) {
      liveScores.remove();
    }
  }

  initializeLiveScores() {
    // Remove any existing live scores widget
    const existingWidget = document.querySelector('live-scores');
    if (existingWidget) {
      existingWidget.remove();
    }

    // Create and append the new widget
    const liveScores = document.createElement('live-scores');
    document.body.appendChild(liveScores);

    // Ensure the widget is visible in the DOM
    liveScores.style.display = 'block';
    liveScores.style.visibility = 'visible';
    liveScores.style.opacity = '1';
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/home/home.css",
      "./static/css/widgets/liveScores.css"
    );
  }

  async render() {
    const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }

  buildMainContent() {
    const main = document.createElement("main");

    const hero = document.createElement("section");
    hero.className = "hero";

    const heroContent = document.createElement("section");
    heroContent.className = "hero-content";

    const heroTitle = document.createElement("h2");
    heroTitle.className = "hero-title";
    heroTitle.textContent = "Test Your Football Knowledge";

    const heroSubtitle = document.createElement("p");
    heroSubtitle.className = "hero-subtitle";
    heroSubtitle.textContent =
      "Choose from a variety of quizzes and compete with players worldwide";

    heroContent.appendChild(heroTitle);
    heroContent.appendChild(heroSubtitle);
    hero.appendChild(heroContent);
    main.appendChild(hero);

    const notification = document.createElement("section");
    notification.className = "notification";
    notification.id = "quiz-maker-note";

    const noteTitle = document.createElement("h3");
    noteTitle.className = "notification-title";
    noteTitle.textContent = `${Role.Manager} Account`;

    const noteMessage = document.createElement("p");
    noteMessage.className = "notification-message";
    noteMessage.textContent = `As a ${Role.Manager}, you can take quizzes, but won't be ranked. Use a ${Role.Player} account to compete.`;

    notification.appendChild(noteTitle);
    notification.appendChild(noteMessage);
    main.appendChild(notification);

    const contentSection = document.createElement("section");
    contentSection.className = "content-section";

    const sectionHeader = document.createElement("header");
    sectionHeader.className = "section-header";

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = "Quizzes for you";

    const filter = document.createElement("quiz-category-filter");
    filter.id = "category-filter";

    sectionHeader.appendChild(sectionTitle);
    sectionHeader.appendChild(filter);
    contentSection.appendChild(sectionHeader);

    const quizGrid = document.createElement("section");
    quizGrid.id = "quiz-grid";
    quizGrid.className = "quiz-grid";

    const loadingParagraph = document.createElement("p");
    loadingParagraph.className = "loading";

    const spinner = document.createElement("section");
    spinner.className = "loading-spinner";

    const loadingText = document.createElement("section");
    loadingText.textContent = "Loading quizzes...";

    loadingParagraph.appendChild(spinner);
    loadingParagraph.appendChild(loadingText);
    quizGrid.appendChild(loadingParagraph);
    contentSection.appendChild(quizGrid);

    main.appendChild(contentSection);

    const leaderboard = document.createElement("quiz-leaderboard");
    leaderboard.id = "leaderboard";
    main.appendChild(leaderboard);

    const modal = document.createElement("section");
    modal.id = "quiz-master-modal";
    modal.className = "modal";

    const modalContent = document.createElement("article");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h3");
    modalTitle.className = "modal-title";
    modalTitle.textContent = `${Role.Manager} Account`;

    const modalMessage = document.createElement("p");
    modalMessage.className = "modal-message";
    modalMessage.textContent = `As a ${Role.Manager}, you can partake in quizzes but will not be ranked.\n\nWould you like to proceed?`;

    const modalFooter = document.createElement("footer");
    modalFooter.className = "modal-actions";

    const cancelButton = document.createElement("button");
    cancelButton.id = "close-modal-btn";
    cancelButton.className = "secondary-btn";
    cancelButton.textContent = "Cancel";

    const adminLink = document.createElement("a");
    adminLink.href = "/quiz";
    adminLink.className = "primary-btn";
    adminLink.dataset.link = "";
    adminLink.textContent = "Continue";

    modalFooter.appendChild(cancelButton);
    modalFooter.appendChild(adminLink);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);

    main.appendChild(modal);

    return main;
  }

  createEmptyQuizMessage() {
    const article = document.createElement("article");
    article.className = "empty-state";

    const icon = document.createElement("p");
    icon.className = "empty-icon";
    icon.textContent = "🔍";

    const title = document.createElement("h3");
    title.className = "empty-title";
    title.textContent = "No quizzes found";

    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent =
      "Try selecting a different category or check back later for new quizzes.";

    article.appendChild(icon);
    article.appendChild(title);
    article.appendChild(message);

    return article;
  }

  setupEventListeners() {
    const categoryFilter = this.shadowRoot.querySelector("#category-filter");
    if (categoryFilter) {
      categoryFilter.addEventListener("filter-change", (event) => {
        this.selectedCategory = event.detail.value;
        this.renderQuizzes();
      });
    }

    const leaderboard = this.shadowRoot.querySelector("#leaderboard");
    if (leaderboard) {
      leaderboard.addEventListener("view-full-leaderboard", () => {
        leaderboard.showFullLeaderboard();
      });
    }

    const closeModalBtn = this.shadowRoot.querySelector("#close-modal-btn");
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        this.hideQuizMasterModal();
      });
    }

    const quizMasterModal = this.shadowRoot.querySelector("#quiz-master-modal");
    if (quizMasterModal) {
      quizMasterModal.addEventListener("click", (event) => {
        if (event.target === quizMasterModal) {
          this.hideQuizMasterModal();
        }
      });
    }
  }

  async loadData() {
    try {
      const dataPromises = [];

      // Verify football service is available
      if (!window.footballService) {
        console.warn("Football service not available. Live scores widget may not work.");
      }

      if (window.categoryService) {
        dataPromises.push(
          window.categoryService
            .getAllCategories()
            .then((categories) => {
              this.categories = categories;
              this.populateCategoryFilter();
            })
            .catch((error) => {
              this.showNotification("Error loading categories:", "error");
            })
        );
      }

      if (window.quizService) {
        dataPromises.push(
          window.quizService
            .getValidQuizzes()
            .then((response) => {
              // Handle paginated response
              if (response && response.data && Array.isArray(response.data)) {
                this.quizzes = response.data;
                this.renderQuizzes();
              } else {
                throw new Error('Invalid quiz data format');
              }
            })
            .catch((error) => {
              this.showNotification("Error loading quizzes:", "error");
              const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
              if (quizGrid) {
                quizGrid.innerHTML = "";
                const errorMessage = document.createElement("p");
                errorMessage.className = "error-message";
                errorMessage.textContent = "Error loading quizzes. Please try again later.";
                quizGrid.appendChild(errorMessage);
              }
            })
        );
      }

      if (window.leaderboardService) {
        const leaderboard = this.shadowRoot.querySelector("#leaderboard");
        if (leaderboard) {
          leaderboard.loadLeaderboardData();
        }
      }

      await Promise.all(dataPromises);
    } catch (error) {
      this.showNotification("Error loading data:", "error");
    }
  }

  populateCategoryFilter() {
    const categoryFilter = this.shadowRoot.querySelector("#category-filter");
    if (categoryFilter) {
      categoryFilter.categories = this.categories;
    }
  }

  renderQuizzes() {
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
    if (!quizGrid) return;

    const filteredQuizzes = this.selectedCategory
      ? this.quizzes.filter(
          (quiz) => quiz.category_id.toString() === this.selectedCategory
        )
      : this.quizzes;

    if (filteredQuizzes.length === 0) {
      quizGrid.innerHTML = "";
      const emptyQuiz = this.createEmptyQuizMessage();
      quizGrid.appendChild(emptyQuiz);
      return;
    }

    quizGrid.innerHTML = "";

    filteredQuizzes.forEach((quiz) => {
      const quizCard = document.createElement("quiz-card");
      quizCard.quiz = quiz;
      quizCard.addEventListener("quiz-start", (e) => {
        this.handleStartQuiz(e, quiz.quiz_id);
      });
      quizGrid.appendChild(quizCard);
    });
    const buttonContainer = document.createElement("article");

    buttonContainer.className = "quiz-grid-button-container";

    quizGrid.appendChild(buttonContainer);
  }

  checkUserRole() {
    const authService = window.authService;
    if (!authService) return;

    const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();

    const notification = this.shadowRoot.querySelector("#quiz-maker-note");
    if (notification && isQuizMaster) {
      notification.style.display = "block";
    }
  }

  handleStartQuiz(event, quizId) {
    event.preventDefault();

    const authService = window.authService;
    if (!authService) return;

    const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();
    localStorage.setItem("selected_quiz_to_play_id", quizId);
    if (isQuizMaster) {
      this.showQuizMasterModal();
    } else {
      window.location.href = "/quiz";
    }
  }

  showQuizMasterModal() {
    const modal = this.shadowRoot.querySelector("#quiz-master-modal");
    if (modal) {
      modal.classList.add("visible");
    }
  }

  hideQuizMasterModal() {
    const modal = this.shadowRoot.querySelector("#quiz-master-modal");
    if (modal) {
      modal.classList.remove("visible");
    }
  }

  showNotification(message, type = 'success') {
      const notification = this.shadowRoot.querySelector('#notification');
      if (!notification) return;
      
      while (notification.firstChild) {
          notification.removeChild(notification.firstChild);
      }
      
      notification.textContent = message;
      notification.className = `notification ${type}`;
      notification.classList.add('visible');
      
      setTimeout(() => {
          notification.classList.remove('visible');
      }, 3000);
    }
}

customElements.define("quiz-home", QuizHome);

export default QuizHome;

import { StyleLoader } from "../../utils/cssLoader.js";
import { Role } from "../../enums/index.js";
import { clearDOM } from "../../utils/domHelpers.js";
import "../../components/widgets/LiveScores.js";
import { navigator } from "../../index.js";

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
    clearDOM(this.shadowRoot);
    await this.render();
    this.setupEventListeners();
    await this.loadData();
    this.checkUserRole();

    this.initializeLiveScores();
  }

  disconnectedCallback() {
    const liveScores = document.querySelector("live-scores");
    if (liveScores) {
      liveScores.remove();
    }
  }

  initializeLiveScores() {
    const existingWidget = document.querySelector("live-scores");
    if (existingWidget) {
      existingWidget.remove();
    }

    const liveScores = document.createElement("live-scores");
    document.body.appendChild(liveScores);

    // Ensure the widget is visible in the DOM
    liveScores.style.display = "block";
    liveScores.style.visibility = "visible";
    liveScores.style.opacity = "1";
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
    main.setAttribute("role", "main");
    main.className = "quiz-main-content";
  
    const backgroundSection = document.createElement("section");
    backgroundSection.className = "football-bg";
  
    this.createFootballs(backgroundSection,20);
    main.appendChild(backgroundSection);
    this.createHeroSection(backgroundSection);
  
    const notificationSection = document.createElement("aside");
    notificationSection.className = "notification";
    notificationSection.id = "quiz-maker-note";
  
    const noteTitle = document.createElement("h2");
    noteTitle.className = "notification-title";
    noteTitle.textContent = `${Role.Manager} Account`;
  
    const noteMessage = document.createElement("p");
    noteMessage.className = "notification-message";
    noteMessage.textContent = `As a ${Role.Manager}, you can take quizzes, but won't be ranked. Use a ${Role.Player} account to compete.`;
  
    notificationSection.appendChild(noteTitle);
    notificationSection.appendChild(noteMessage);
    main.appendChild(notificationSection);
  
    const contentWrapper = document.createElement("section");
    contentWrapper.className = "content-wrapper";
    
  
    const contentSection = document.createElement("section");
    contentSection.className = "content-section";
  
    const modal = document.createElement("dialog");
    modal.id = "quiz-master-modal";
    modal.className = "modal";
    modal.setAttribute("aria-labelledby", "modal-title");
    modal.setAttribute("aria-describedby", "modal-message");
  
    const modalContent = document.createElement("section");
    modalContent.className = "modal-content";
  
    const modalTitle = document.createElement("h3");
    modalTitle.id = "modal-title";
    modalTitle.className = "modal-title";
    modalTitle.textContent = `${Role.Manager} Account`;
  
    const modalMessage = document.createElement("p");
    modalMessage.id = "modal-message";
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

  createHeroSection(parent) {
    const heroSection = document.createElement("section");
    heroSection.className = "hero";
    
    const heroContainer = document.createElement("section");
    heroContainer.className = "hero-content";
  
    const heroHeading = document.createElement("h1");
    heroHeading.className = "hero-title hero-title--gradient";
    heroHeading.textContent = "Elevate Your Football IQ";
  
    const heroDescription = document.createElement("p");
    heroDescription.className = "hero-subtitle";
    heroDescription.textContent = 
      "⚽ Test your football skills!\n" +
      "Pick from legends, matches, transfers & more.\n\n" +
      "🔥 ELO ranks you against players at your level.\n\n" +
      "🏆 See where you stand on live leaderboards.\n\n" +
      "📊 Follow live scores and 🎮 apply to be a manager.\n\n" +
      "Ready to prove you're the best? Let's go! 🚀";
  
    const ctaButton = document.createElement("a");
    ctaButton.className = "hero-cta";
    ctaButton.textContent = "Explore Quizzes";
    ctaButton.href = "/game-modes";
    ctaButton.setAttribute("data-link", "");
    ctaButton.setAttribute("aria-label", "Browse all football quizzes");
  
    heroContainer.appendChild(heroHeading);
    heroContainer.appendChild(heroDescription);
    heroContainer.appendChild(ctaButton);
    heroSection.appendChild(heroContainer);
    
    parent.appendChild(heroSection);
  }
  

  createFootballs(parent, amount){
    for (let i = 0; i < amount; i++) {
      const ball = document.createElement("article");
      ball.className = "football";
      ball.textContent = "⚽";
      ball.style.left = Math.random() * 100 + "vw";
      ball.style.animationDelay = Math.random() * 5 + "s";
      ball.style.fontSize = `${Math.random() * 2 + 1}rem`;
      parent.appendChild(ball);
    }
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
        console.warn(
          "Football service not available. Live scores widget may not work."
        );
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
                throw new Error("Invalid quiz data format");
              }
            })
            .catch((error) => {
              this.showNotification("Error loading quizzes:", "error");
              const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
              if (quizGrid) {
                clearDOM(quizGrid)
                const errorMessage = document.createElement("p");
                errorMessage.className = "error-message";
                errorMessage.textContent =
                  "Error loading quizzes. Please try again later.";
                quizGrid.appendChild(errorMessage);
              }
            })
        );
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
      clearDOM(quizGrid);
      const emptyQuiz = this.createEmptyQuizMessage();
      quizGrid.appendChild(emptyQuiz);
      return;
    }

    clearDOM(quizGrid);

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
      navigator("/quiz");
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

  showNotification(message, type = "success") {
    const notification = this.shadowRoot.querySelector("#notification");
    if (!notification) return;

    while (notification.firstChild) {
      notification.removeChild(notification.firstChild);
    }

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add("visible");

    setTimeout(() => {
      notification.classList.remove("visible");
    }, 3000);
  }
}

customElements.define("quiz-home", QuizHome);

export default QuizHome;

import { StyleLoader } from "../../utils/cssLoader.js";

/**
 * GameModes component displays available quizzes and filters by category
 */
class Quizzes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.quizzes = [];
    this.categories = [];
    this.selectedCategory = "";
  }

  /**
   * Lifecycle callback when element is added to DOM
   */
  async connectedCallback() {
    await this.loadStyles();
    this.clearDOM(this.shadowRoot);
    await this.render();
    this.setupEventListeners();
    await this.loadData();
    this.checkUserRole();
  }

  /**
   * Clear all child nodes from a DOM element
   * @param {HTMLElement} element - Element to clear
   */
  clearDOM(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Load component stylesheets
   */
  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/playQuiz/playQuiz.css"
    );
  }

  /**
   * Render component content
   */
  async render() {
    const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }

  /**
   * Build main content structure
   * @returns {HTMLElement} Main content element
   */
  buildMainContent() {
    const main = document.createElement("main");


    // Content Section
    const contentSection = document.createElement("section");
    contentSection.className = "content-section";

    const sectionHeader = document.createElement("header");
    sectionHeader.className = "section-header";

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = "Choose a Quiz to test your Knowledge! ";

    const filter = document.createElement("quiz-category-filter");
    filter.id = "category-filter";

    sectionHeader.appendChild(sectionTitle);
    sectionHeader.appendChild(filter);
    contentSection.appendChild(sectionHeader);

    // Quiz Grid
    const quizGrid = document.createElement("section");
    quizGrid.id = "quiz-grid";
    quizGrid.className = "quiz-grid";

    const loadingParagraph = document.createElement("p");
    loadingParagraph.className = "loading";

    const spinner = document.createElement("span");
    spinner.className = "loading-spinner";

    const loadingText = document.createElement("span");
    loadingText.textContent = "Loading quizzes...";

    loadingParagraph.appendChild(spinner);
    loadingParagraph.appendChild(loadingText);
    quizGrid.appendChild(loadingParagraph);
    contentSection.appendChild(quizGrid);

    main.appendChild(contentSection);
    
    return main;
  }

  /**
   * Create empty state message when no quizzes match filter
   * @returns {HTMLElement} Empty state element
   */
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

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    const categoryFilter = this.shadowRoot.querySelector("#category-filter");
    if (categoryFilter) {
      categoryFilter.addEventListener("filter-change", (event) => {
        this.selectedCategory = event.detail.value;
        this.renderQuizzes();
      });
    }
  }

  /**
   * Load quiz and category data
   */
  async loadData() {
    try {
      const dataPromises = [];

      if (window.categoryService) {
        dataPromises.push(
          window.categoryService
            .getAllCategories()
            .then((categories) => {
              this.categories = categories;
              this.populateCategoryFilter();
            })
            .catch((error) => {
              console.error("Error loading categories:", error);
            })
        );
      }

      if (window.quizService) {
        dataPromises.push(
          window.quizService
            .getValidQuizzes()
            .then((quizzes) => {
              this.quizzes = quizzes;
              this.renderQuizzes();
            })
            .catch((error) => {
              console.error("Error loading quizzes:", error);
            })
        );
      }

      await Promise.all(dataPromises);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  /**
   * Populate category filter with available categories
   */
  populateCategoryFilter() {
    const categoryFilter = this.shadowRoot.querySelector("#category-filter");
    if (categoryFilter) {
      categoryFilter.categories = this.categories;
    }
  }

  /**
   * Render quizzes based on selected category
   */
  renderQuizzes() {
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
    if (!quizGrid) return;

    const filteredQuizzes = this.selectedCategory
      ? this.quizzes.filter(
          (quiz) => quiz.category_id.toString() === this.selectedCategory
        )
      : this.quizzes;

    this.clearDOM(quizGrid);

    if (filteredQuizzes.length === 0) {
      const emptyQuiz = this.createEmptyQuizMessage();
      quizGrid.appendChild(emptyQuiz);
      return;
    }

    filteredQuizzes.forEach((quiz) => {
      const quizCard = document.createElement("quiz-card");
      quizCard.quiz = quiz;
      quizCard.addEventListener("quiz-start", (e) => {
        this.handleStartQuiz(e, quiz.quiz_id);
      });
      quizGrid.appendChild(quizCard);
    });
  }

  /**
   * Check user role to enable additional functionality
   */
  checkUserRole() {
    const authService = window.authService;
    if (!authService) return;

    const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();

    const notification = this.shadowRoot.querySelector("#quiz-maker-note");
    if (notification && isQuizMaster) {
      notification.style.display = "block";
    }
  }

  /**
   * Handle starting a quiz
   * @param {Event} event - Click event
   * @param {string|number} quizId - ID of selected quiz
   */
  handleStartQuiz(event, quizId) {
    event.preventDefault();

    const authService = window.authService;
    if (!authService) return;

    const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();
    localStorage.setItem("selected_quiz_id", quizId);
    
    if (isQuizMaster) {
      this.showQuizMasterModal();
    } else {
      window.location.href = "/quiz";
    }
  }

  /**
   * Display quiz master modal for quiz masters
   */
  showQuizMasterModal() {
    // Implementation would go here
    // Could show a modal asking if they want to play or edit
    console.log("Quiz master modal would show here");
    
    // Placeholder implementation - redirect to quiz page
    window.location.href = "/quiz";
  }
}

// Register the component with the correct name
customElements.define("play-quizzes", Quizzes);

export default Quizzes;
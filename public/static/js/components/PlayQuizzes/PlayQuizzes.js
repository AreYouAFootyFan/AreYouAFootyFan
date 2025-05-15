import { navigator } from "../../index.js";
import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
import "../common/Pagination.js";

class Quizzes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.quizzes = [];
    this.categories = [];
    this.currentPage = 1;
    this.itemsPerPage = 4;
    this.totalPages = 1;
    this.isLoading = false;
    this.categoryId = null;
    this.categoryName = "All Categories";
  }

  static get observedAttributes() {
    return ["mode-id"];
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === "mode-id" && oldValue !== newValue) {
      this.categoryId = newValue;
      if (this.isConnected) {
        await this.loadData();
      }
    }
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    await this.loadData();
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "/static/css/styles.css",
      "/static/css/playQuiz/playQuiz.css"
    );
  }

  render() {
    const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }

  buildMainContent() {
    const main = document.createElement("main");

    const contentSection = document.createElement("section");
    contentSection.className = "content-section";    
    const sectionHeader = document.createElement("header");
    sectionHeader.className = "section-header";


    const backLink = document.createElement("a");
    backLink.href = "/game-modes";
    backLink.className = "back-link";
    backLink.textContent = "← Back to Categories";
    contentSection.appendChild(backLink);

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = `${this.categoryName} Quizzes`;

    sectionHeader.appendChild(sectionTitle);
    contentSection.appendChild(sectionHeader);

    const quizGrid = document.createElement("section");
    quizGrid.id = "quiz-grid";
    quizGrid.className = "quiz-grid";

    const loadingParagraph = document.createElement("p");
    loadingParagraph.className = "loading";

    const spinner = document.createElement("article");
    spinner.className = "loading-spinner";

    const loadingText = document.createElement("article");
    loadingText.textContent = "Loading quizzes...";

    loadingParagraph.appendChild(spinner);
    loadingParagraph.appendChild(loadingText);
    quizGrid.appendChild(loadingParagraph);
    contentSection.appendChild(quizGrid);

    const pagination = document.createElement("pagination-controls");
    pagination.setAttribute("current-page", this.currentPage);
    pagination.setAttribute("total-pages", this.totalPages);
    pagination.addEventListener("page-change", (event) => {
      this.handlePageChange(event.detail.page);
    });
    contentSection.appendChild(pagination);

    main.appendChild(contentSection);
    return main;
  }

  async handlePageChange(newPage) {
    if (this.isLoading || newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    await this.loadData();
  }

  updatePaginationControls() {
    const pagination = this.shadowRoot.querySelector("pagination-controls");
    if (pagination) {
      pagination.setAttribute("current-page", this.currentPage);
      pagination.setAttribute("total-pages", this.totalPages);
    }
  }

  async loadData() {
    if (!window.quizService) return;

    this.isLoading = true;
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");

    try {
      if (quizGrid) {
        clearDOM(quizGrid);
        const loadingParagraph = document.createElement("p");
        loadingParagraph.className = "loading";
        const spinner = document.createElement("article");
        spinner.className = "loading-spinner";
        const loadingText = document.createElement("article");
        loadingText.textContent = "Loading quizzes...";
        loadingParagraph.appendChild(spinner);
        loadingParagraph.appendChild(loadingText);
        quizGrid.appendChild(loadingParagraph);
      }

      const response = await window.quizService.getValidQuizzesByCategory(
        this.categoryId,
        this.currentPage,
        this.itemsPerPage
      );

      if (response && response.data) {
        this.quizzes = response.data;
        this.totalPages = response.pagination.totalPages;
        this.currentPage = response.pagination.page;
      } else {
        throw new Error("Invalid response format");
      }

      this.renderQuizzes();
      this.updatePaginationControls();
    } catch (error) {
      message.textContent = "Error loading data";
      if (quizGrid) {
        clearDOM(quizGrid);
        quizGrid.appendChild(this.createErrorMessage());
      }
    } finally {
      this.isLoading = false;
    }
  }

  renderQuizzes() {
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
    if (!quizGrid) return;

    clearDOM(quizGrid);

    if (!Array.isArray(this.quizzes) || this.quizzes.length === 0) {
      const emptyQuiz = this.createEmptyQuizMessage();
      quizGrid.appendChild(emptyQuiz);
      return;
    }

    this.quizzes.forEach((quiz) => {
      const quizCard = document.createElement("quiz-card");
      quizCard.quiz = quiz;

      quizCard.addEventListener("quiz-start", (e) => {
        this.handleStartQuiz(e, quiz.quiz_id);
      });
      quizGrid.appendChild(quizCard);
    });
  }

  createEmptyQuizMessage() {
    const emptyState = document.createElement("section");
    emptyState.className = "empty-state";

    const icon = document.createElement("p");
    icon.className = "empty-icon";
    icon.textContent = "📚";

    const title = document.createElement("h3");
    title.className = "empty-title";
    title.textContent = "No Quizzes Found";

    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent =
      "There are no quizzes available in this category yet.";

    emptyState.appendChild(icon);
    emptyState.appendChild(title);
    emptyState.appendChild(message);

    return emptyState;
  }

  createErrorMessage() {
    const errorState = document.createElement("section");
    errorState.className = "error-state";

    const icon = document.createElement("p");
    icon.className = "error-icon";
    icon.textContent = "❌";

    const title = document.createElement("h3");
    title.className = "error-title";
    title.textContent = "Error Loading Quizzes";

    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "Failed to load quizzes. Please try again later.";

    errorState.appendChild(icon);
    errorState.appendChild(title);
    errorState.appendChild(message);

    return errorState;
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
    navigator("/quiz");
  }
}

customElements.define("play-quizzes", Quizzes);

export default Quizzes;

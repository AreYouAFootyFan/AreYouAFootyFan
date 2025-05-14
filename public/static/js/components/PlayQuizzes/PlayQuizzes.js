import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class Quizzes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.quizzes = [];
    this.categories = [];
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.totalPages = 1;
    this.isLoading = false;
    this.categoryId = null;
    this.categoryName = "All Categories";
  }

  async connectedCallback() {
    // Get category ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    this.categoryId = urlParams.get('modeId');
    
    // If we have a category ID, get the category name
    if (this.categoryId && window.categoryService) {
      try {
        const category = await window.categoryService.getCategoryById(this.categoryId);
        if (category) {
          this.categoryName = category.category_name;
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }
    
    this.loadStyles();
    clearDOM(this.shadowRoot);
    await this.render();
    this.setupEventListeners();
    await this.loadData();
    this.checkUserRole();
  }


  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "/static/css/styles.css",
      "/static/css/playQuiz/playQuiz.css"
    );
  }


  async render() {
    const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }


  buildMainContent() {
    const main = document.createElement("main");

    // Content Section
    const contentSection = document.createElement("section");
    contentSection.className = "content-section";

    const sectionHeader = document.createElement("header");
    sectionHeader.className = "section-header";

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = `${this.categoryName} Quizzes`;

    const backLink = document.createElement("a");
    backLink.href = "/game-modes";
    backLink.className = "back-link";
    backLink.textContent = "← Back to Categories";

    sectionHeader.appendChild(backLink);
    sectionHeader.appendChild(sectionTitle);
    contentSection.appendChild(sectionHeader);

    // Quiz Grid
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

    // Pagination Controls
    const paginationNav = document.createElement("nav");
    paginationNav.setAttribute("aria-label", "Quiz pages navigation");
    paginationNav.className = "pagination-controls";

    const paginationList = document.createElement("ul");
    paginationList.className = "pagination-list";

    // Previous button
    const prevItem = document.createElement("li");
    const prevButton = document.createElement("button");
    prevButton.id = "prev-page";
    prevButton.className = "pagination-button";
    prevButton.textContent = "Previous";
    prevButton.disabled = true;
    prevButton.setAttribute("aria-label", "Go to previous page");
    prevItem.appendChild(prevButton);

    // Page info
    const pageInfoItem = document.createElement("li");
    const pageInfo = document.createElement("strong");
    pageInfo.id = "page-info";
    pageInfo.className = "page-info";
    pageInfo.textContent = "Page 1";
    pageInfo.setAttribute("aria-live", "polite");
    pageInfoItem.appendChild(pageInfo);

    // Next button
    const nextItem = document.createElement("li");
    const nextButton = document.createElement("button");
    nextButton.id = "next-page";
    nextButton.className = "pagination-button";
    nextButton.textContent = "Next";
    nextButton.disabled = true;
    nextButton.setAttribute("aria-label", "Go to next page");
    nextItem.appendChild(nextButton);

    paginationList.appendChild(prevItem);
    paginationList.appendChild(pageInfoItem);
    paginationList.appendChild(nextItem);
    paginationNav.appendChild(paginationList);
    
    contentSection.appendChild(paginationNav);
    main.appendChild(contentSection);
    
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
    message.textContent = "Try selecting a different category or check back later for new quizzes.";

    article.appendChild(icon);
    article.appendChild(title);
    article.appendChild(message);

    return article;
  }

  setupEventListeners() {
    const prevButton = this.shadowRoot.querySelector("#prev-page");
    const nextButton = this.shadowRoot.querySelector("#next-page");

    if (prevButton) {
      prevButton.addEventListener("click", () => this.handlePageChange(this.currentPage - 1));
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => this.handlePageChange(this.currentPage + 1));
    }
  }

  async handlePageChange(newPage) {
    if (this.isLoading || newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    await this.loadData();
  }

  updatePaginationControls() {
    const prevButton = this.shadowRoot.querySelector("#prev-page");
    const nextButton = this.shadowRoot.querySelector("#next-page");
    const pageInfo = this.shadowRoot.querySelector("#page-info");

    if (prevButton) {
      prevButton.disabled = this.currentPage === 1;
    }
    if (nextButton) {
      nextButton.disabled = this.currentPage === this.totalPages;
    }
    if (pageInfo) {
      pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    }
  }

  async loadData() {
    if (!window.quizService) return;
    
    this.isLoading = true;
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
    
    try {
      // Show loading state
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
      
      // Check if response has the expected structure
      if (response && response.data) {
        this.quizzes = response.data;
        this.totalPages = response.pagination.totalPages;
        this.currentPage = response.pagination.page;
      } else {
        // If response doesn't have the expected structure, treat it as an error
        throw new Error('Invalid response format');
      }
      
      this.renderQuizzes();
      this.updatePaginationControls();
    } catch (error) {
      console.error("Error loading quizzes:", error);
      if (quizGrid) {
        clearDOM(quizGrid);
        quizGrid.appendChild(this.createErrorMessage());
      }
    } finally {
      this.isLoading = false;
    }
  }

  createErrorMessage() {
    const article = document.createElement("article");
    article.className = "error-state";
    article.innerHTML = `
      <p class="error-icon">❌</p>
      <h3 class="error-title">Error Loading Quizzes</h3>
      <p class="error-message">There was a problem loading the quizzes. Please try again later.</p>
    `;
    return article;
  }

  renderQuizzes() {
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
    if (!quizGrid) return;

    clearDOM(quizGrid);

    // Check if this.quizzes is an array and has items
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
    // Could show a modal asking if they want to play or edit. Placeholder implementation - redirect to quiz page
    window.location.href = "/quiz";
  }
}

customElements.define("play-quizzes", Quizzes);

export default Quizzes;
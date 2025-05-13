import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class Quizzes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.quizzes = [];
    this.categories = [];
  }

  async connectedCallback() {
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
    sectionTitle.textContent = "Choose a Quiz to test your Knowledge! ";

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
    
  }

  async loadData() {
    try {
      const dataPromises = [];
      if (window.quizService) {
        dataPromises.push(
          window.quizService
            .getValidQuizzesByCategory(this.getAttribute('mode-id'))
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

  renderQuizzes() {
    const quizGrid = this.shadowRoot.querySelector("#quiz-grid");
    if (!quizGrid) return;


    clearDOM(quizGrid);

    if (this.quizzes.length === 0) {
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
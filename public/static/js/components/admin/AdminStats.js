import { StyleLoaderStatic } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class AdminStats extends HTMLElement {
  static {
    this.styleSheet = null;
    this.stylesLoaded = this.loadStylesOnce();
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.stats = {
      active_quizzes: 0,
      registered_players: 0,
      quizzes_completed: 0,
      questions_answered: 0,
    };
  }

  async connectedCallback() {
    await AdminStats.stylesLoaded;
    this.shadowRoot.adoptedStyleSheets = AdminStats.styleSheet;
    this.render();
  }

  static async loadStylesOnce() {
    try {
      if (!this.styleSheet) {
        this.styleSheet = await StyleLoaderStatic(
          "./static/css/styles.css",
          "./static/css/admin/shared.css",
          "./static/css/admin/adminStats.css"
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  render() {
    clearDOM(this.shadowRoot);
    const statsContainer = document.createElement("section");
    statsContainer.className = "admin-stats";

    const quizzesCard = document.createElement("article");
    quizzesCard.className = "stat-card";

    const quizzesValue = document.createElement("h2");
    quizzesValue.className = "stat-value";
    quizzesValue.id = "active-quizzes-stat";
    quizzesValue.textContent = this.stats.active_quizzes.toLocaleString();

    const quizzesLabel = document.createElement("p");
    quizzesLabel.className = "stat-label";
    quizzesLabel.textContent = "Total Quizzes Created";

    quizzesCard.appendChild(quizzesValue);
    quizzesCard.appendChild(quizzesLabel);

    const playersCard = document.createElement("article");
    playersCard.className = "stat-card";

    const playersValue = document.createElement("h2");
    playersValue.className = "stat-value";
    playersValue.id = "registered-players-stat";
    playersValue.textContent = this.stats.registered_players.toLocaleString();

    const playersLabel = document.createElement("p");
    playersLabel.className = "stat-label";
    playersLabel.textContent = "Registered Players";

    playersCard.appendChild(playersValue);
    playersCard.appendChild(playersLabel);

    const completedCard = document.createElement("article");
    completedCard.className = "stat-card";

    const completedValue = document.createElement("h2");
    completedValue.className = "stat-value";
    completedValue.id = "quizzes-completed-stat";
    completedValue.textContent = this.stats.quizzes_completed.toLocaleString();

    const completedLabel = document.createElement("p");
    completedLabel.className = "stat-label";
    completedLabel.textContent = "Quizzes Completed";

    completedCard.appendChild(completedValue);
    completedCard.appendChild(completedLabel);

    const questionsCard = document.createElement("article");
    questionsCard.className = "stat-card";

    const questionsValue = document.createElement("h2");
    questionsValue.className = "stat-value";
    questionsValue.id = "questions-answered-stat";
    questionsValue.textContent = this.stats.questions_answered.toLocaleString();

    const questionsLabel = document.createElement("p");
    questionsLabel.className = "stat-label";
    questionsLabel.textContent = "Questions Answered";

    questionsCard.appendChild(questionsValue);
    questionsCard.appendChild(questionsLabel);

    statsContainer.appendChild(quizzesCard);
    statsContainer.appendChild(playersCard);
    statsContainer.appendChild(completedCard);
    statsContainer.appendChild(questionsCard);

    this.shadowRoot.appendChild(statsContainer);
  }

  setStats(stats) {
    this.stats = stats;
    this.render();
  }

  setError(error) {
    clearDOM(this.shadowRoot);

    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.textContent = `Error loading statistics: ${
      error.message || "Unknown error"
    }`;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(errorMessage);
  }
}

customElements.define("admin-stats", AdminStats);

export default AdminStats;

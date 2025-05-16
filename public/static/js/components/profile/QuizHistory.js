import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
import "../common/Pagination.js";

class QuizHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.historyData = [];
    this.styleSheet = new CSSStyleSheet();
    this.currentPage = 1;
    this.limit = 6;
    this.totalPages = 1;
    this.totalItems = 0;
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    this.loadHistoryData();
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/profile/history.css",
      "./static/css/playQuiz/playQuiz.css"
    );
  }

  render() {
    const shadow = this.shadowRoot;
    clearDOM(shadow);
    const history = this.createHistorySection();

    shadow.appendChild(history);
  }

  createHistorySection() {
    const card = document.createElement("article");
    card.className = "history-card";

    const header = document.createElement("header");
    header.className = "card-header";
    const title = document.createElement("h2");
    title.textContent = "Quizzes Played";
    header.appendChild(title);
    card.appendChild(header);

    const content = document.createElement("main");
    content.className = "card-content";

    const table = this.createHistoryTable(
      "history-body",
      "Loading quiz history data..."
    );
    content.appendChild(table);

    const paginationContainer = document.createElement("nav");
    paginationContainer.className = "pagination-container";
    paginationContainer.id = "history-pagination";
    paginationContainer.setAttribute("aria-label", "History pagination");
    content.appendChild(paginationContainer);

    card.appendChild(content);
    return card;
  }

  createHistoryTable(tbodyId, loadingText) {
    const tableWrapper = document.createElement("figure");
    tableWrapper.className = "table-container";

    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const rowHeaders = ["Quiz Name", "Quiz Category", "Score", "Day Played"];
    rowHeaders.forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");
    tbody.id = tbodyId;

    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");
    loadingCell.colSpan = 4;
    loadingCell.className = "loading";

    const spinner = document.createElement("mark");
    spinner.className = "loading-spinner";
    spinner.setAttribute("aria-hidden", "true");

    const message = document.createElement("p");
    message.textContent = loadingText;

    loadingCell.appendChild(spinner);
    loadingCell.appendChild(message);
    loadingRow.appendChild(loadingCell);
    tbody.appendChild(loadingRow);

    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrapper.appendChild(table);

    return tableWrapper;
  }

  createEmptyState(title, message) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";

    const h3 = document.createElement("h3");
    h3.className = "empty-title";
    h3.textContent = title;

    const p = document.createElement("p");
    p.className = "empty-message";
    p.textContent = message;

    emptyState.appendChild(h3);
    emptyState.appendChild(p);

    return emptyState;
  }

  createColSpanCell(content, colspan = 4) {
    const td = document.createElement("td");
    td.colSpan = colspan;
    td.appendChild(content);
    return td;
  }

  createErrorRow() {
    const row = document.createElement("tr");
    const cell = this.createColSpanCell(
      this.createEmptyState(
        "Error loading leaderboard",
        "There was a problem loading the leaderboard data. Please try again later."
      )
    );
    row.appendChild(cell);
    return row;
  }

  createHistoryRow(quiz) {
    const row = document.createElement("tr");

    const quizPlayedCell = document.createElement("td");
    const quizPlayedElement = document.createElement("strong");
    quizPlayedElement.classList.add("quizPlayed");
    quizPlayedElement.textContent = quiz.title;
    quizPlayedCell.appendChild(quizPlayedElement);

    const categoryCell = document.createElement("td");
    categoryCell.textContent = quiz.category;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = quiz.score;

    const dateCell = document.createElement("td");
    dateCell.textContent = quiz.date;

    row.appendChild(quizPlayedCell);
    row.appendChild(categoryCell);
    row.appendChild(scoreCell);
    row.appendChild(dateCell);

    return row;
  }

  createHistoryRows(data) {
    return data.map((quiz) => this.createHistoryRow(quiz));
  }

  createEmptyRow() {
    const row = document.createElement("tr");
    const cell = this.createColSpanCell(
      this.createEmptyState(
        "No quizzes played",
        "There is quiz history. Start playing quizzes to see history"
      )
    );
    row.appendChild(cell);
    return row;
  }

  createPagination() {
    const paginationContainer = this.shadowRoot.querySelector(
      "#history-pagination"
    );
    if (!paginationContainer) return;

    clearDOM(paginationContainer);

    if (this.totalPages <= 1) return;

    const pagination = document.createElement("pagination-controls");
    pagination.setAttribute("current-page", this.currentPage.toString());
    pagination.setAttribute("total-pages", this.totalPages.toString());

    pagination.addEventListener("page-change", (event) => {
      this.currentPage = event.detail.page;
      this.loadHistoryData();
    });

    paginationContainer.appendChild(pagination);
  }

  async loadHistoryData() {
    try {
      if (window.statsService) {
        const historyBody = this.shadowRoot.querySelector("#history-body");
        if (historyBody) {
          clearDOM(historyBody);

          const loadingRow = document.createElement("tr");
          const loadingCell = document.createElement("td");
          loadingCell.colSpan = 4;
          loadingCell.className = "loading";

          const spinner = document.createElement("mark");
          spinner.className = "loading-spinner";
          spinner.setAttribute("aria-hidden", "true");

          const message = document.createElement("p");
          message.textContent = "Loading quiz history data...";

          loadingCell.appendChild(spinner);
          loadingCell.appendChild(message);
          loadingRow.appendChild(loadingCell);
          historyBody.appendChild(loadingRow);
        }

        const response = await window.statsService.getPlayedQuizzes(
          this.currentPage,
          this.limit
        );

        this.historyData = response.data;
        this.totalPages = response.pagination.totalPages;
        this.totalItems = response.pagination.total;
        this.currentPage = response.pagination.page;

        this.renderHistory();
        this.createPagination();
      }
    } catch (error) {
      const historyBody = this.shadowRoot.querySelector("#history-body");
      if (historyBody) {
        clearDOM(historyBody);
        historyBody.appendChild(this.createErrorRow());
      }
    }
  }

  renderHistory() {
    const historyBody = this.shadowRoot.querySelector("#history-body");
    if (!historyBody) return;
    clearDOM(historyBody);
    try {
      if (!this.historyData || this.historyData.length === 0) {
        const emptyRow = this.createEmptyRow();
        historyBody.appendChild(emptyRow);
      } else {
        const rows = this.createHistoryRows(this.historyData);
        rows.forEach((row) => historyBody.appendChild(row));
      }
    } catch (e) {
      historyBody.appendChild(this.createErrorRow());
    }
  }
}

customElements.define("quiz-history", QuizHistory);

export default QuizHistory;

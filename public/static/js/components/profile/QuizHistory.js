import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class QuizHistory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.historyData = [];
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
        // this.setupEventListeners();
        // this.loadLeaderboardData();
    }

    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/home/history.css'
        );
    }
    
    render() {
        const shadow = this.shadowRoot;
        clearDOM(shadow);
        const history = this.createHisorySection();
    
        shadow.appendChild(history);
    }
    
    createHisorySection() {
      const section = document.createElement("section");
      section.className = "history";

      const inner = document.createElement("section");
      inner.className = "history-inner";

      const header = document.createElement("header");
      header.className = "section-header";

      const title = document.createElement("h2");
      title.className = "section-title";
      title.textContent = "Quizzes Played";

      header.appendChild(title);

      const table = this.createHistoryTable(
        "history-body",
        "Loading quiz history data..."
      );
      inner.appendChild(header);
      inner.appendChild(table);

      section.appendChild(inner);
      return section;
    }
    
    createHistoryTable(tbodyId, loadingText) {
        const container = document.createElement('section');
        container.className = 'table-container';
    
        const table = document.createElement('table');
    
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const rowHeaders = ['Quiz Name', 'Quiz Categpry', 'Score', 'Date Played'];
        rowHeaders.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    
        const tbody = document.createElement('tbody');
        tbody.id = tbodyId;
    
        const loadingRow = document.createElement('tr');
        const loadingCell = document.createElement('td');
        loadingCell.colSpan = 4;
        loadingCell.className = 'loading';
    
        const spinner = document.createElement('section');
        spinner.className = 'loading-spinner';
    
        const message = document.createElement('section');
        message.textContent = loadingText;
    
        loadingCell.appendChild(spinner);
        loadingCell.appendChild(message);
        loadingRow.appendChild(loadingCell);
        tbody.appendChild(loadingRow);
    
        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
    
        return container;
    }

    createEmptyState(title, message) {
        const section = document.createElement('section');
        section.className = 'empty-state';
    
        const h3 = document.createElement('h3');
        h3.className = 'empty-title';
        h3.textContent = title;
    
        const p = document.createElement('p');
        p.className = 'empty-message';
        p.textContent = message;
    
        section.appendChild(h3);
        section.appendChild(p);
    
        return section;
    }
    
    createColSpanCell(content, colspan = 4) {
        const td = document.createElement('td');
        td.colSpan = colspan;
        td.appendChild(content);
        return td;
    }

    createErrorRow() {
        const row = document.createElement('tr');
        const cell = this.createColSpanCell(
            this.createEmptyState(
                'Error loading leaderboard',
                'There was a problem loading the leaderboard data. Please try again later.'
            )
        );
        row.appendChild(cell);
        return row;
    }

    createHistoryRow(quiz) {
        const row = document.createElement('tr');

        const quizPlayedCell = document.createElement('td');
        const quizPlayedSection = document.createElement('section');
        quizPlayedSection.classList.add('quizPlayed');
        quizPlayedSection.textContent = quiz.title;
        quizPlayedCell.appendChild(quizPlayedSection);
    
        const usernameCell = document.createElement('td');
        usernameCell.textContent = quiz.category;
    
        const pointsCell = document.createElement('td');
        pointsCell.textContent = quiz.score;
    
        const quizzesCell = document.createElement('td');
        quizzesCell.textContent = quiz.date;
    
        row.appendChild(quizPlayedCell);
        row.appendChild(usernameCell);
        row.appendChild(pointsCell);
        row.appendChild(quizzesCell);
    
        return row;
    }
    
    createHistoryRow(data) {
        return data.map(quiz => this.createHistoryRow(quiz));
    }

    createEmptyRow() {
        const row = document.createElement('tr');
        const cell = this.createColSpanCell(
           this.createEmptyState(
                'No leaderboard data',
                'There is no leaderboard data to display yet. Start playing quizzes to appear on the leaderboard!'
            )
        );
        row.appendChild(cell);
        return row;
    }

    // setupEventListeners() {
    //     const viewLeaderboardBtn = this.shadowRoot.querySelector('#view-full-leaderboard');
    //     if (viewLeaderboardBtn) {
    //         viewLeaderboardBtn.addEventListener('click', (e) => {
    //             e.preventDefault();
    //             this.dispatchEvent(new CustomEvent('view-full-leaderboard'));
    //             this.showFullLeaderboard();
    //         });
    //     }
        
    //     const closeLeaderboardBtn = this.shadowRoot.querySelector('#close-leaderboard-btn');
    //     if (closeLeaderboardBtn) {
    //         closeLeaderboardBtn.addEventListener('click', () => {
    //             this.hideFullLeaderboard();
    //         });
    //     }
        
    //     const leaderboardModal = this.shadowRoot.querySelector('#full-leaderboard-modal');
    //     if (leaderboardModal) {
    //         leaderboardModal.addEventListener('click', (e) => {
    //             if (e.target === leaderboardModal) {
    //                 this.hideFullLeaderboard();
    //             }
    //         });
    //     }
    // }
    
    async loadHisotryData() {
        try {
            if (window.statsService) {
                const historyData = await window.statsService.getPlayedQuizes(5);
                this.historyData = historyData;
                this.renderHistory();
            }
        } catch (error) {
            const historyBody = this.shadowRoot.querySelector('#history-body');
            if (historyBody) {
                historyBody.innerHTML = '';
                try {
                    if (this.historyData.length === 0) {
                        historyBody.appendChild(this.createEmptyRow());
                    } else {
                        const rows = this.createHistoryRow(this.historyData);
                        rows.forEach(row => historyBody.appendChild(row));
                    }
                } catch (e) {
                    historyBody.appendChild(this.createErrorRow());
                }
            }
        }
    }
    
    renderHistory() {
        const historyBody = this.shadowRoot.querySelector('#history-body');
        if (!historyBody) return;

        historyBody.innerHTML = '';
        try {
            if (!this.historyData || this.historyData.length === 0) {
                const emptyRow = this.createEmptyRow();
                historyBody.appendChild(emptyRow);
            } else {
                const rows = this.createHistoryRow(this.historyData);
                rows.forEach(row => historyBody.appendChild(row));
            }
        } catch (e) {
            historyBody.appendChild(this.createErrorRow());
        }
        return;
    }
}

customElements.define('quiz-history', QuizHistory);

export default QuizHistory;
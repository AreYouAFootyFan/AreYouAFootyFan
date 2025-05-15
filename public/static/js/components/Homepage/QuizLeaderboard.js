import { StyleLoader } from "../../utils/cssLoader.js";
class QuizLeaderboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.leaderboardData = [];
        this.fullLeaderboardData = [];
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        await this.render();
        this.setupEventListeners();
        this.loadLeaderboardData();
    }

    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/home/leaderboard.css'
        );
    }
    
    async render() {
        const shadow = this.shadowRoot;
        shadow.innerHTML = '';
        

        const leaderboard = this.createLeaderboardSection();
        const modal = this.createModalSection();
    
        shadow.appendChild(leaderboard);
        shadow.appendChild(modal);
    }
    
    createLeaderboardSection() {
      const section = document.createElement("section");
      section.className = "leaderboard";

      const inner = document.createElement("section");
      inner.className = "leaderboard-inner";

      const header = document.createElement("header");
      header.className = "section-header";

      const title = document.createElement("h2");
      title.className = "section-title";
      title.textContent = "Top Players";

      const button = document.createElement("button");
      button.className = "view-all";
      button.id = "view-full-leaderboard";
      button.textContent = "View Full Leaderboard";

      header.appendChild(title);
      header.appendChild(button);

      const table = this.createLeaderboardTable(
        "leaderboard-body",
        "Loading leaderboard data..."
      );
      inner.appendChild(header);
      inner.appendChild(table);

      section.appendChild(inner);
      return section;
    }
    
    createModalSection() {
        const modal = document.createElement('section');
        modal.className = 'modal';
        modal.id = 'full-leaderboard-modal';
    
        const content = document.createElement('article');
        content.className = 'modal-content';
    
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.id = 'close-leaderboard-btn';
        closeBtn.textContent = '×';
    
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Football Quiz Leaderboard';
    
        const table = this.createLeaderboardTable('full-leaderboard-body', 'Loading full leaderboard data...');
    
        content.appendChild(closeBtn);
        content.appendChild(title);
        content.appendChild(table);
    
        modal.appendChild(content);
        return modal;
    }
    
    createLeaderboardTable(tbodyId, loadingText) {
        const container = document.createElement('section');
        container.className = 'table-container';
    
        const table = document.createElement('table');
    
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Rank', 'Player', 'Points', 'Quizzes'].forEach(text => {
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

    createLeaderboardRow(player) {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        const rankSection = document.createElement('section');
        rankSection.classList.add('rank');
        if (player.rank <= 3) rankSection.classList.add(`rank-${player.rank}`);
        rankSection.textContent = player.rank;
        rankCell.appendChild(rankSection);
    
        const usernameCell = document.createElement('td');
        usernameCell.textContent = player.username;
    
        const pointsCell = document.createElement('td');
        pointsCell.textContent = player.total_points;
    
        const quizzesCell = document.createElement('td');
        quizzesCell.textContent = player.quizzes_taken || 0;
    
        row.appendChild(rankCell);
        row.appendChild(usernameCell);
        row.appendChild(pointsCell);
        row.appendChild(quizzesCell);
    
        return row;
    }
    
    createLeaderboardRows(data) {
        return data.map(player => this.createLeaderboardRow(player));
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

    setupEventListeners() {
        const viewLeaderboardBtn = this.shadowRoot.querySelector('#view-full-leaderboard');
        if (viewLeaderboardBtn) {
            viewLeaderboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('view-full-leaderboard'));
                this.showFullLeaderboard();
            });
        }
        
        const closeLeaderboardBtn = this.shadowRoot.querySelector('#close-leaderboard-btn');
        if (closeLeaderboardBtn) {
            closeLeaderboardBtn.addEventListener('click', () => {
                this.hideFullLeaderboard();
            });
        }
        
        const leaderboardModal = this.shadowRoot.querySelector('#full-leaderboard-modal');
        if (leaderboardModal) {
            leaderboardModal.addEventListener('click', (e) => {
                if (e.target === leaderboardModal) {
                    this.hideFullLeaderboard();
                }
            });
        }
    }
    
    async loadLeaderboardData() {
        try {
            if (window.leaderboardService) {
                const leaderboardData = await window.leaderboardService.getTopPlayers(5);
                this.leaderboardData = leaderboardData;
                this.renderLeaderboard();
            }
        } catch (error) {
            const leaderboardBody = this.shadowRoot.querySelector('#leaderboard-body');
            if (leaderboardBody) {
                leaderboardBody.innerHTML = '';
                try {
                    if (this.leaderboardData.length === 0) {
                        leaderboardBody.appendChild(this.createEmptyRow());
                    } else {
                        const rows = this.createLeaderboardRows(this.leaderboardData);
                        rows.forEach(row => leaderboardBody.appendChild(row));
                    }
                } catch (e) {
                    leaderboardBody.appendChild(this.createErrorRow());
                }
            }
        }
    }
    
    renderLeaderboard() {
        const leaderboardBody = this.shadowRoot.querySelector('#leaderboard-body');
        if (!leaderboardBody) return;

        leaderboardBody.innerHTML = '';
        try {
            if (!this.leaderboardData || this.leaderboardData.length === 0) {
                const emptyRow = this.createEmptyRow();
                leaderboardBody.appendChild(emptyRow);
            } else {
                const rows = this.createLeaderboardRows(this.leaderboardData);
                rows.forEach(row => leaderboardBody.appendChild(row));
            }
        } catch (e) {
            leaderboardBody.appendChild(this.createErrorRow());
        }
        return;
    }
    
    async showFullLeaderboard() {
        const leaderboardModal = this.shadowRoot.querySelector('#full-leaderboard-modal');
        const fullLeaderboardBody = this.shadowRoot.querySelector('#full-leaderboard-body');
        
        if (!leaderboardModal || !fullLeaderboardBody) return;
        
        leaderboardModal.classList.add('visible');
        
        try {
            if (window.leaderboardService) {
                this.fullLeaderboardData = await window.leaderboardService.getLeaderboard();
                fullLeaderboardBody.innerHTML = '';
                if (!this.fullLeaderboardData || this.fullLeaderboardData.length === 0) {
                    const emptyRow = this.createEmptyRow();
                    fullLeaderboardBody.appendChild(emptyRow);
                } else {
                    const rows = this.createLeaderboardRows(this.fullLeaderboardData);
                    rows.forEach(row => fullLeaderboardBody.appendChild(row));
                }
            }
        } catch (error) {
            fullLeaderboardBody.appendChild(this.createErrorRow());
        }
    }
    
    hideFullLeaderboard() {
        const leaderboardModal = this.shadowRoot.querySelector('#full-leaderboard-modal');
        if (leaderboardModal) {
            leaderboardModal.classList.remove('visible');
        }
    }
}

customElements.define('quiz-leaderboard', QuizLeaderboard);

export default QuizLeaderboard;
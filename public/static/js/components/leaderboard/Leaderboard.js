import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class Leaderboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.leaderboardData = [];
        this.fullLeaderboardData = [];
        this.individualRanking;
        this.styleSheet = new CSSStyleSheet();
    }

    async connectedCallback() {
        await this.loadStyles();
        await this.render();
        await this.loadLeaderboardData();
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
        clearDOM(shadow);

        const leaderboard = this.createLeaderboardSection();
        shadow.appendChild(leaderboard);
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
        title.textContent = "Leaderboard";

        header.appendChild(title);

        const rankingLabelContainer = document.createElement("section");
        rankingLabelContainer.id = "ranking-label-container";
        rankingLabelContainer.className = "ranking-label-container";

        const table = this.createLeaderboardTable(
            "full-leaderboard-body",
            "Loading leaderboard data..."
        );

        inner.appendChild(header);
        inner.appendChild(rankingLabelContainer);
        inner.appendChild(table);

        section.appendChild(inner);
        return section;
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

    createRankingLabel(ranking) {
        const article = document.createElement('article');
        article.className = 'user-ranking';
        const h3 = document.createElement('h3');
        h3.textContent = `Your Ranking: ${ranking}`;
        article.appendChild(h3);
        return article;
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

    clearElementContent(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    async loadLeaderboardData() {
        try {
            if (window.statsService) {
                const stats = await window.statsService.getProfileStats();
                this.individualRanking = stats.rank;

                const rankingLabelContainer = this.shadowRoot.querySelector('#ranking-label-container');
                if (rankingLabelContainer) {
                    clearDOM(rankingLabelContainer);
                    rankingLabelContainer.appendChild(this.createRankingLabel(this.individualRanking));
                }
            }

            if (window.leaderboardService) {
                this.fullLeaderboardData = await window.leaderboardService.getTopPlayers();
                this.renderFullLeaderboard();
            }
        } catch (error) {
            const leaderboardBody = this.shadowRoot.querySelector('#full-leaderboard-body');
            if (leaderboardBody) {
                clearDOM(leaderboardBody);
                leaderboardBody.appendChild(this.createErrorRow());
            }
        }
    }

    renderFullLeaderboard() {
        const fullLeaderboardBody = this.shadowRoot.querySelector('#full-leaderboard-body');
        if (!fullLeaderboardBody) return;

        clearDOM(fullLeaderboardBody);

        try {
            if (!this.fullLeaderboardData || this.fullLeaderboardData.length === 0) {
                const emptyRow = this.createEmptyRow();
                fullLeaderboardBody.appendChild(emptyRow);
            } else {
                const rows = this.createLeaderboardRows(this.fullLeaderboardData);
                rows.forEach(row => fullLeaderboardBody.appendChild(row));
            }
        } catch (e) {
            fullLeaderboardBody.appendChild(this.createErrorRow());
        }
    }
}

customElements.define('leaderboard-data', Leaderboard);
export default Leaderboard;

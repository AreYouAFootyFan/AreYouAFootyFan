class QuizLeaderboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.leaderboardData = [];
        this.fullLeaderboardData = [];
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadLeaderboardData();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .leaderboard {
                    background-color: white;
                    padding: 3rem 1rem;
                    margin-top: 2rem;
                }
                
                .leaderboard-inner {
                    max-width: var(--container-max-width, 75rem);
                    margin: 0 auto;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }
                
                .view-all {
                    color: var(--primary, #3b82f6);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.875rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                
                .view-all:hover {
                    text-decoration: underline;
                }
                
                .table-container {
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                th, td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 0.0625rem solid var(--gray-200, #e2e8f0);
                }
                
                th {
                    font-weight: 600;
                    color: var(--gray-600, #4b5563);
                    background-color: var(--gray-50, #f8fafc);
                }
                
                .rank {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 50%;
                    background-color: var(--gray-200, #e5e7eb);
                    font-weight: 600;
                    font-size: 0.75rem;
                    margin-right: 0.5rem;
                }
                
                .rank-1 {
                    background-color: #fcd34d;
                    color: #92400e;
                }
                
                .rank-2 {
                    background-color: #cbd5e1;
                    color: #334155;
                }
                
                .rank-3 {
                    background-color: #d8b4fe;
                    color: #6b21a8;
                }
                
                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    color: var(--gray-500, #64748b);
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 1.5rem;
                    height: 1.5rem;
                    border: 0.125rem solid currentColor;
                    border-right-color: transparent;
                    border-radius: 50%;
                    margin-right: 0.5rem;
                    animation: spin 0.75s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .empty-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    background-color: var(--gray-50, #f8fafc);
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                }
                
                .empty-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--gray-700, #334155);
                }
                
                .empty-message {
                    color: var(--gray-500, #64748b);
                    max-width: 24rem;
                    margin: 0 auto;
                }
                
                /* Modal styling */
                .modal {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                }
                
                .modal.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .modal-content {
                    background-color: white;
                    border-radius: 0.5rem;
                    width: 100%;
                    max-width: 40rem;
                    padding: 1.5rem;
                    position: relative;
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .close-btn {
                    position: sticky;
                    top: 0;
                    float: right;
                    border: none;
                    font-size: 1.5rem;
                    background: none;
                    cursor: pointer;
                    color: var(--gray-500, #64748b);
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                .close-btn:hover {
                    background-color: var(--gray-100, #f1f5f9);
                    color: var(--gray-900, #0f172a);
                }
            </style>
            
            <section class="leaderboard">
                <section class="leaderboard-inner">
                    <header class="section-header">
                        <h2 class="section-title">Top Players</h2>
                        <button class="view-all" id="view-full-leaderboard">View Full Leaderboard</button>
                    </header>
                    
                    <section class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Points</th>
                                    <th>Quizzes</th>
                                </tr>
                            </thead>
                            <tbody id="leaderboard-body">
                                <tr>
                                    <td colspan="4" class="loading">
                                        <span class="loading-spinner"></span>
                                        <span>Loading leaderboard data...</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </section>
            </section>
            
            <section id="full-leaderboard-modal" class="modal">
                <article class="modal-content">
                    <button id="close-leaderboard-btn" class="close-btn">&times;</button>
                    <h2 class="section-title">Football Quiz Leaderboard</h2>
                    
                    <section class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Points</th>
                                    <th>Quizzes</th>
                                </tr>
                            </thead>
                            <tbody id="full-leaderboard-body">
                                <tr>
                                    <td colspan="4" class="loading">
                                        <span class="loading-spinner"></span>
                                        <span>Loading full leaderboard data...</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </article>
            </section>
        `;
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
        
        // Handle modal background clicks
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
            console.error('Error loading leaderboard data:', error);
            const leaderboardBody = this.shadowRoot.querySelector('#leaderboard-body');
            if (leaderboardBody) {
                leaderboardBody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            <section class="empty-state">
                                <h3 class="empty-title">Error loading leaderboard</h3>
                                <p class="empty-message">There was a problem loading the leaderboard data. Please try again later.</p>
                            </section>
                        </td>
                    </tr>
                `;
            }
        }
    }
    
    renderLeaderboard() {
        const leaderboardBody = this.shadowRoot.querySelector('#leaderboard-body');
        if (!leaderboardBody) return;
        
        if (!this.leaderboardData || this.leaderboardData.length === 0) {
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <section class="empty-state">
                            <h3 class="empty-title">No leaderboard data</h3>
                            <p class="empty-message">There is no leaderboard data to display yet. Start playing quizzes to appear on the leaderboard!</p>
                        </section>
                    </td>
                </tr>
            `;
            return;
        }
        
        leaderboardBody.innerHTML = this.leaderboardData.map(player => `
            <tr>
                <td>
                    <span class="rank ${player.rank <= 3 ? `rank-${player.rank}` : ''}">${player.rank}</span>
                </td>
                <td>${player.username}</td>
                <td>${player.total_points}</td>
                <td>${player.quizzes_taken || 0}</td>
            </tr>
        `).join('');
    }
    
    async showFullLeaderboard() {
        const leaderboardModal = this.shadowRoot.querySelector('#full-leaderboard-modal');
        const fullLeaderboardBody = this.shadowRoot.querySelector('#full-leaderboard-body');
        
        if (!leaderboardModal || !fullLeaderboardBody) return;
        
        leaderboardModal.classList.add('visible');
        
        try {
            if (window.leaderboardService) {
                this.fullLeaderboardData = await window.leaderboardService.getLeaderboard();
                
                fullLeaderboardBody.innerHTML = this.fullLeaderboardData.map(player => `
                    <tr>
                        <td>
                            <span class="rank ${player.rank <= 3 ? `rank-${player.rank}` : ''}">${player.rank}</span>
                        </td>
                        <td>${player.username}</td>
                        <td>${player.total_points}</td>
                        <td>${player.quizzes_taken || 0}</td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading full leaderboard:', error);
            fullLeaderboardBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <section class="empty-state">
                            <h3 class="empty-title">Error loading leaderboard</h3>
                            <p class="empty-message">There was a problem loading the full leaderboard data. Please try again later.</p>
                        </section>
                    </td>
                </tr>
            `;
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
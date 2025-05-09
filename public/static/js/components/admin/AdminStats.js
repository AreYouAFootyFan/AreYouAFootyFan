class AdminStats extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.stats = {
            active_quizzes: 0,
            registered_players: 0,
            quizzes_completed: 0,
            questions_answered: 0
        };
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .admin-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .stat-card {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                    padding: 1.5rem;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-0.25rem);
                    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
                }
                
                .stat-value {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                
                .stat-label {
                    font-size: 0.875rem;
                    color: var(--gray-600);
                    margin: 0;
                }
            </style>
            
            <section class="admin-stats">
                <article class="stat-card">
                    <h2 class="stat-value" id="active-quizzes-stat">${this.stats.active_quizzes.toLocaleString()}</h2>
                    <p class="stat-label">Total Quizzes Created</p>
                </article>
                
                <article class="stat-card">
                    <h2 class="stat-value" id="registered-players-stat">${this.stats.registered_players.toLocaleString()}</h2>
                    <p class="stat-label">Registered Players</p>
                </article>
                
                <article class="stat-card">
                    <h2 class="stat-value" id="quizzes-completed-stat">${this.stats.quizzes_completed.toLocaleString()}</h2>
                    <p class="stat-label">Quizzes Completed</p>
                </article>
                
                <article class="stat-card">
                    <h2 class="stat-value" id="questions-answered-stat">${this.stats.questions_answered.toLocaleString()}</h2>
                    <p class="stat-label">Questions Answered</p>
                </article>
            </section>
        `;
    }
    
    setStats(stats) {
        this.stats = stats;
        this.render();
    }
    
    setError(error) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .error-message {
                    color: var(--error);
                    text-align: center;
                    margin: 2rem 0;
                }
            </style>
            
            <p class="error-message">Error loading statistics: ${error.message || 'Unknown error'}</p>
        `;
    }
}

customElements.define('admin-stats', AdminStats);

export default AdminStats;
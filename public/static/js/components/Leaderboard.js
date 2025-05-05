export default class LeaderboardComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .leaderboard-preview {
            padding: 3rem 0;
            background-color: white;
          }
  
          .leaderboard-table-container {
            overflow-x: auto;
          }
  
          .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
          }
  
          .leaderboard-table th,
          .leaderboard-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--gray-200);
          }
  
          .leaderboard-table th {
            font-weight: 600;
            color: var(--gray-700);
            background-color: var(--gray-50);
          }
  
          .player-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
  
          .rank {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background-color: var(--gray-200);
            font-weight: 600;
            font-size: 0.75rem;
          }
  
          .rank-1 {
            background-color: var(--accent);
            color: white;
          }
  
          .rank-2 {
            background-color: var(--gray-400);
            color: white;
          }
  
          .rank-3 {
            background-color: var(--secondary);
            color: white;
          }
  
          a.btn {
            text-decoration: none;
            color: var(--accent);
            font-weight: bold;
          }
  
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
        </style>
  
        <section class="leaderboard-preview">
          <div class="container">
            <header class="section-header">
              <h2>Top Players</h2>
              <a href="#/leaderboard" class="btn btn-text" data-page="leaderboard">View Full Leaderboard</a>
            </header>
            
            <div class="leaderboard-table-container">
              <table class="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>ELO</th>
                    <th>Quizzes</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody id="leaderboard-body">
                  <!-- Rows injected via JS -->
                </tbody>
              </table>
            </div>
          </div>
        </section>
      `;
    }
  
    setData(players = []) {
      const tbody = this.shadowRoot.getElementById("leaderboard-body");
      tbody.innerHTML = players.map((player, index) => `
        <tr>
          <td><span class="rank rank-${index + 1}">${index + 1}</span></td>
          <td class="player-info">${player.name}</td>
          <td>${player.elo}</td>
          <td>${player.quizzes}</td>
          <td>${player.accuracy}%</td>
        </tr>
      `).join("");
    }
  }
  
customElements.define('leader-board', LeaderboardComponent);
  
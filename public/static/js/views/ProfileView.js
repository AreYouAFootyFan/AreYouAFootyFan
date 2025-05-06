import AbstractView from "./AbstractView.js";

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile");
    }

    async getHtml(){
        return `
    <div class="profile-page">
      <div class="container">
        <div class="page-header">
          <h1>My Profile</h1>
        </div>

        <div class="profile-grid">
          <section class="profile-card">
            <div class="profile-header">
              <div class="profile-info">
                <h2 id="profile-username">Username</h2>
                <div class="profile-rank">Elite Tactician</div>
                <div class="profile-elo">ELO: 1580</div>
              </div>
            </div>

            <form id="profile-form" class="profile-form">
              <div class="form-group">
                <label for="edit-username">Username</label>
                <input type="text" id="edit-username" value="FootballFan22">
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </section>

          <section class="stats-card">
            <h2>My Statistics</h2>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Quizzes Taken</div>
                <div class="stat-value">24</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Questions Answered</div>
                <div class="stat-value">342</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Accuracy</div>
                <div class="stat-value">78%</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Best Streak</div>
                <div class="stat-value">14</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Avg. Time per Question</div>
                <div class="stat-value">18s</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Rank</div>
                <div class="stat-value">#42</div>
              </div>
            </div>
          </section>

          <section class="badges-card">
            <h2>My Badges</h2>
            <div class="badges-grid">
              <div class="badge">
                <div class="badge-icon">🏆</div>
                <div class="badge-info">
                  <div class="badge-name">Quiz Master</div>
                  <div class="badge-desc">Complete 10 quizzes with 80%+ accuracy</div>
                </div>
              </div>
              <div class="badge">
                <div class="badge-icon">⚡</div>
                <div class="badge-info">
                  <div class="badge-name">Speed Demon</div>
                  <div class="badge-desc">Answer 50 questions with 10+ seconds remaining</div>
                </div>
              </div>
              <div class="badge">
                <div class="badge-icon">🔥</div>
                <div class="badge-info">
                  <div class="badge-name">On Fire</div>
                  <div class="badge-desc">Achieve a streak of 10+ correct answers</div>
                </div>
              </div>
              <div class="badge">
                <div class="badge-icon">🧠</div>
                <div class="badge-info">
                  <div class="badge-name">Tactical Genius</div>
                  <div class="badge-desc">Reach 1500 ELO points</div>
                </div>
              </div>
              <div class="badge locked">
                <div class="badge-icon">👑</div>
                <div class="badge-info">
                  <div class="badge-name">Champion</div>
                  <div class="badge-desc">Reach the #1 spot on the leaderboard</div>
                </div>
              </div>
            </div>
          </section>

          <section class="recent-activity">
            <h2>Recent Activity</h2>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon quiz-complete">✓</div>
                <div class="activity-details">
                  <div class="activity-title">Completed "Premier League Legends" Quiz</div>
                  <div class="activity-meta">Score: 780 | Accuracy: 80% | +35 ELO</div>
                  <div class="activity-time">2 days ago</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon badge-earned">🏆</div>
                <div class="activity-details">
                  <div class="activity-title">Earned "Quiz Master" Badge</div>
                  <div class="activity-meta">Complete 10 quizzes with 80%+ accuracy</div>
                  <div class="activity-time">2 days ago</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon elo-gain">↑</div>
                <div class="activity-details">
                  <div class="activity-title">Reached Elite Tactician Rank</div>
                  <div class="activity-meta">ELO increased to 1580</div>
                  <div class="activity-time">1 week ago</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon quiz-complete">✓</div>
                <div class="activity-details">
                  <div class="activity-title">Completed "World Cup History" Quiz</div>
                  <div class="activity-meta">Score: 650 | Accuracy: 75% | +28 ELO</div>
                  <div class="activity-time">1 week ago</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
        `;
    }
}
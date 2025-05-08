class QuizHome extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.quizzes = [];
      this.categories = [];
      this.selectedCategory = '';
  }

  connectedCallback() {
      this.render();
      this.setupEventListeners();
      this.loadData();
      this.checkUserRole();
  }

  render() {
      this.shadowRoot.innerHTML = `
          <style>
              :host {
                  display: block;
                  width: 100%;
              }
              
              .hero {
                  background-color: var(--primary);
                  color: white;
                  text-align: center;
                  padding: 4rem 1rem;
                  margin-bottom: 2rem;
              }
              
              .hero-content {
                  max-width: var(--container-max-width);
                  margin: 0 auto;
              }
              
              .hero-title {
                  font-size: 2.5rem;
                  margin-bottom: 1rem;
                  font-weight: 700;
                  color: white;
              }
              
              .hero-subtitle {
                  font-size: 1.25rem;
                  opacity: 0.9;
                  max-width: 36rem;
                  margin: 0 auto;
              }
              
              .content-section {
                  max-width: var(--container-max-width);
                  margin: 0 auto 2rem auto;
                  padding: 0 1rem;
              }
              
              .section-title {
                  font-size: 1.5rem;
                  margin-bottom: 1rem;
                  font-weight: 600;
              }
              
              .section-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 1.5rem;
                  flex-wrap: wrap;
                  gap: 1rem;
              }
              
              .notification {
                  width: 100%;
                  max-width: var(--container-max-width);
                  margin: 0 auto 2rem auto;
                  background-color: #fff7ed;
                  border-left: 0.25rem solid #f97316;
                  padding: 1rem;
                  border-radius: 0 0.25rem 0.25rem 0;
                  display: none;
              }
              
              .notification-title {
                  color: #9a3412;
                  font-weight: 600;
                  margin-bottom: 0.25rem;
              }
              
              .notification-message {
                  color: #7c2d12;
                  font-size: 0.875rem;
              }
              
              .quiz-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
                  gap: 1.5rem;
                  margin-bottom: 2rem;
              }
              
              .empty-state {
                  text-align: center;
                  padding: 3rem 1rem;
                  background-color: var(--gray-50);
                  border-radius: 0.5rem;
                  margin-bottom: 2rem;
              }
              
              .empty-icon {
                  font-size: 3rem;
                  margin-bottom: 1rem;
                  color: var(--gray-400);
              }
              
              .empty-title {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin-bottom: 0.5rem;
                  color: var(--gray-700);
              }
              
              .empty-message {
                  color: var(--gray-500);
                  max-width: 24rem;
                  margin: 0 auto;
              }
              
              .loading {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 2rem;
                  color: var(--gray-500);
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
                  max-width: 28rem;
                  padding: 1.5rem;
                  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
              }
              
              .modal-title {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin-bottom: 1rem;
              }
              
              .modal-message {
                  margin-bottom: 1.5rem;
              }
              
              .modal-actions {
                  display: flex;
                  justify-content: flex-end;
                  gap: 0.75rem;
              }
              
              .secondary-btn {
                  padding: 0.5rem 1rem;
                  background-color: white;
                  color: var(--gray-600);
                  border: 0.0625rem solid var(--gray-300);
                  border-radius: 0.25rem;
                  font-weight: 500;
                  cursor: pointer;
                  font-family: inherit;
              }
              
              .secondary-btn:hover {
                  background-color: var(--gray-50);
              }
              
              .primary-btn {
                  padding: 0.5rem 1rem;
                  background-color: var(--primary);
                  color: white;
                  border: none;
                  border-radius: 0.25rem;
                  font-weight: 500;
                  cursor: pointer;
                  text-decoration: none;
                  display: inline-block;
                  font-family: inherit;
              }
              
              .primary-btn:hover {
                  background-color: var(--primary-dark);
              }
              
              .hidden {
                  display: none !important;
              }
          </style>
          
          <main>
              <section class="hero">
                  <section class="hero-content">
                      <h2 class="hero-title">Test Your Football Knowledge</h2>
                      <p class="hero-subtitle">Choose from a variety of quizzes and compete with players worldwide</p>
                  </section>
              </section>
              
              <section class="notification" id="quiz-maker-note">
                  <h3 class="notification-title">Quiz Master Account</h3>
                  <p class="notification-message">As a Quiz Master, you can create and manage quizzes but cannot participate in them. Use a Quiz Taker account to play quizzes.</p>
              </section>
              
              <section class="content-section">
                  <header class="section-header">
                      <h2 class="section-title">Available Quizzes</h2>
                      <quiz-category-filter id="category-filter"></quiz-category-filter>
                  </header>
                  
                  <section id="quiz-grid" class="quiz-grid">
                      <p class="loading">
                          <span class="loading-spinner"></span>
                          <span>Loading quizzes...</span>
                      </p>
                  </section>
              </section>
              
              <quiz-leaderboard id="leaderboard"></quiz-leaderboard>
              
              <section id="quiz-master-modal" class="modal">
                  <article class="modal-content">
                      <h3 class="modal-title">Quiz Master Account</h3>
                      <p class="modal-message">As a Quiz Master, you can create and manage quizzes but cannot participate in them. Would you like to go to the Admin dashboard instead?</p>
                      <footer class="modal-actions">
                          <button id="close-modal-btn" class="secondary-btn">Cancel</button>
                          <a href="/admin" class="primary-btn" data-link>Go to Admin</a>
                      </footer>
                  </article>
              </section>
          </main>
      `;
  }
  
  setupEventListeners() {
      const categoryFilter = this.shadowRoot.querySelector('#category-filter');
      if (categoryFilter) {
          categoryFilter.addEventListener('filter-change', (e) => {
              this.selectedCategory = e.detail.value;
              this.renderQuizzes();
          });
      }
      
      const leaderboard = this.shadowRoot.querySelector('#leaderboard');
      if (leaderboard) {
          leaderboard.addEventListener('view-full-leaderboard', () => {
              leaderboard.showFullLeaderboard();
          });
      }
      
      const closeModalBtn = this.shadowRoot.querySelector('#close-modal-btn');
      if (closeModalBtn) {
          closeModalBtn.addEventListener('click', () => {
              this.hideQuizMasterModal();
          });
      }
      
      const quizMasterModal = this.shadowRoot.querySelector('#quiz-master-modal');
      if (quizMasterModal) {
          quizMasterModal.addEventListener('click', (e) => {
              if (e.target === quizMasterModal) {
                  this.hideQuizMasterModal();
              }
          });
      }
  }
  
  async loadData() {
      try {
          const dataPromises = [];
          
          if (window.categoryService) {
              dataPromises.push(
                  window.categoryService.getAllCategories()
                      .then(categories => {
                          this.categories = categories;
                          this.populateCategoryFilter();
                      })
                      .catch(error => {
                          console.error('Error loading categories:', error);
                      })
              );
          }
          
          if (window.quizService) {
              dataPromises.push(
                  window.quizService.getValidQuizzes()
                      .then(quizzes => {
                          this.quizzes = quizzes;
                          this.renderQuizzes();
                      })
                      .catch(error => {
                          console.error('Error loading quizzes:', error);
                      })
              );
          }
          
          if (window.leaderboardService) {
              const leaderboard = this.shadowRoot.querySelector('#leaderboard');
              if (leaderboard) {
                  leaderboard.loadLeaderboardData();
              }
          }
          
          await Promise.all(dataPromises);
          
      } catch (error) {
          console.error('Error loading data:', error);
      }
  }
  
  populateCategoryFilter() {
      const categoryFilter = this.shadowRoot.querySelector('#category-filter');
      if (categoryFilter) {
          categoryFilter.categories = this.categories;
      }
  }
  
  renderQuizzes() {
      const quizGrid = this.shadowRoot.querySelector('#quiz-grid');
      if (!quizGrid) return;
      
      const filteredQuizzes = this.selectedCategory 
          ? this.quizzes.filter(quiz => quiz.category_id.toString() === this.selectedCategory)
          : this.quizzes;
      
      if (filteredQuizzes.length === 0) {
          quizGrid.innerHTML = `
              <article class="empty-state">
                  <p class="empty-icon">🔍</p>
                  <h3 class="empty-title">No quizzes found</h3>
                  <p class="empty-message">Try selecting a different category or check back later for new quizzes.</p>
              </article>
          `;
          return;
      }
      
      quizGrid.innerHTML = '';
      
      filteredQuizzes.forEach(quiz => {
          const quizCard = document.createElement('quiz-card');
          quizCard.quiz = quiz;
          quizCard.addEventListener('quiz-start', (e) => {
              this.handleStartQuiz(e, quiz.quiz_id);
          });
          quizGrid.appendChild(quizCard);
      });
  }
  
  checkUserRole() {
      const authService = window.authService;
      if (!authService) return;
      
      const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();
      
      const notification = this.shadowRoot.querySelector('#quiz-maker-note');
      if (notification && isQuizMaster) {
          notification.style.display = 'block';
      }
  }
  
  handleStartQuiz(event, quizId) {
      event.preventDefault();
      
      const authService = window.authService;
      if (!authService) return;
      
      const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();
      
      if (isQuizMaster) {
          this.showQuizMasterModal();
      } else {
          localStorage.setItem('selected_quiz_id', quizId);
          window.location.href = '/quiz';
      }
  }
  
  showQuizMasterModal() {
      const modal = this.shadowRoot.querySelector('#quiz-master-modal');
      if (modal) {
          modal.classList.add('visible');
      }
  }
  
  hideQuizMasterModal() {
      const modal = this.shadowRoot.querySelector('#quiz-master-modal');
      if (modal) {
          modal.classList.remove('visible');
      }
  }
}

customElements.define('quiz-home', QuizHome);

export default QuizHome;
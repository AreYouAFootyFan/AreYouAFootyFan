import { StyleLoader } from "../../utils/cssLoader.js";
class QuizHome extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.quizzes = [];
      this.categories = [];
      this.selectedCategory = '';
      this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
      await this.loadStyles();
      this.shadowRoot.innerHTML = '';
      await this.render();
      this.setupEventListeners();
      await this.loadData();
      this.checkUserRole();
  }

  async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/home/home.css'
        );
    }

  async render() {
     const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }
  

    buildMainContent() {
        const main = document.createElement('main');
    
        // Hero Section
        const hero = document.createElement('section');
        hero.className = 'hero';
    
        const heroContent = document.createElement('section');
        heroContent.className = 'hero-content';
    
        const heroTitle = document.createElement('h2');
        heroTitle.className = 'hero-title';
        heroTitle.textContent = 'Test Your Football Knowledge';
    
        const heroSubtitle = document.createElement('p');
        heroSubtitle.className = 'hero-subtitle';
        heroSubtitle.textContent = 'Choose from a variety of quizzes and compete with players worldwide';
    
        heroContent.appendChild(heroTitle);
        heroContent.appendChild(heroSubtitle);
        hero.appendChild(heroContent);
        main.appendChild(hero);
    
        // Notification
        const notification = document.createElement('section');
        notification.className = 'notification';
        notification.id = 'quiz-maker-note';
    
        const noteTitle = document.createElement('h3');
        noteTitle.className = 'notification-title';
        noteTitle.textContent = 'Quiz Master Account';
    
        const noteMessage = document.createElement('p');
        noteMessage.className = 'notification-message';
        noteMessage.textContent = 'As a Quiz Master, you can create and manage quizzes but cannot participate in them. Use a Quiz Taker account to play quizzes.';
    
        notification.appendChild(noteTitle);
        notification.appendChild(noteMessage);
        main.appendChild(notification);
    
        // Content Section
        const contentSection = document.createElement('section');
        contentSection.className = 'content-section';
    
        const sectionHeader = document.createElement('header');
        sectionHeader.className = 'section-header';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = 'Available Quizzes';
    
        const filter = document.createElement('quiz-category-filter');
        filter.id = 'category-filter';
    
        sectionHeader.appendChild(sectionTitle);
        sectionHeader.appendChild(filter);
        contentSection.appendChild(sectionHeader);
    
        // Quiz Grid
        const quizGrid = document.createElement('section');
        quizGrid.id = 'quiz-grid';
        quizGrid.className = 'quiz-grid';
    
        const loadingParagraph = document.createElement('p');
        loadingParagraph.className = 'loading';
    
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
    
        const loadingText = document.createElement('span');
        loadingText.textContent = 'Loading quizzes...';
    
        loadingParagraph.appendChild(spinner);
        loadingParagraph.appendChild(loadingText);
        quizGrid.appendChild(loadingParagraph);
        contentSection.appendChild(quizGrid);
    
        main.appendChild(contentSection);
    
        // Leaderboard
        const leaderboard = document.createElement('quiz-leaderboard');
        leaderboard.id = 'leaderboard';
        main.appendChild(leaderboard);
    
        // Modal
        const modal = document.createElement('section');
        modal.id = 'quiz-master-modal';
        modal.className = 'modal';
    
        const modalContent = document.createElement('article');
        modalContent.className = 'modal-content';
    
        const modalTitle = document.createElement('h3');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Quiz Master Account';
    
        const modalMessage = document.createElement('p');
        modalMessage.className = 'modal-message';
        modalMessage.textContent = 'As a Quiz Master, you can create and manage quizzes but cannot participate in them. Would you like to go to the Admin dashboard instead?';
    
        const modalFooter = document.createElement('footer');
        modalFooter.className = 'modal-actions';
    
        const cancelButton = document.createElement('button');
        cancelButton.id = 'close-modal-btn';
        cancelButton.className = 'secondary-btn';
        cancelButton.textContent = 'Cancel';
    
        const adminLink = document.createElement('a');
        adminLink.href = '/admin';
        adminLink.className = 'primary-btn';
        adminLink.dataset.link = '';
        adminLink.textContent = 'Go to Admin';
    
        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(adminLink);
    
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
    
        main.appendChild(modal);
    
        return main;
    }

    createEmptyQuizMessage() {
        const article = document.createElement('article');
        article.className = 'empty-state';
    
        const icon = document.createElement('p');
        icon.className = 'empty-icon';
        icon.textContent = '🔍';
    
        const title = document.createElement('h3');
        title.className = 'empty-title';
        title.textContent = 'No quizzes found';
    
        const message = document.createElement('p');
        message.className = 'empty-message';
        message.textContent = 'Try selecting a different category or check back later for new quizzes.';
    
        article.appendChild(icon);
        article.appendChild(title);
        article.appendChild(message);
    
        return article;
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
          quizGrid.innerHTML = '';
          const emptyQuiz = this.createEmptyQuizMessage()
          quizGrid.appendChild(emptyQuiz)
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
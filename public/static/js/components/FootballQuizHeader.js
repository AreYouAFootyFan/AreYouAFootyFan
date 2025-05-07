class FootballQuizHeader extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.addStyles();
      this.render();
      this.setupEventListeners();
      
      window.addEventListener('popstate', () => this.updateActiveNavLink());
      
      setTimeout(() => {
        this.updateUserUI();
      }, 50);
    }
    
    addStyles() {
      const styleId = 'football-quiz-header-styles';
      
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        
        styleElement.textContent = `
          football-quiz-header {
            display: block;
            width: 100%;
          }
          
          football-quiz-header .fq-header {
            background-color: white;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            width: 100%;
          }
          
          football-quiz-header .fq-header-top {
            border-bottom: 0.0625rem solid #e2e8f0;
            width: 100%;
          }
          
          football-quiz-header .fq-header-top-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 75rem;
            margin: 0 auto;
            height: 4rem;
            padding: 0 1rem;
          }
          
          football-quiz-header .fq-logo-section {
            display: flex;
            align-items: center;
          }
          
          football-quiz-header .fq-logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            gap: 0.5rem;
          }
          
          football-quiz-header .fq-logo-icon {
            font-size: 1.5rem;
          }
          
          football-quiz-header .fq-logo h1 {
            font-size: 1.25rem;
            margin: 0;
            color: #1a202c;
          }
          
          football-quiz-header .fq-header-nav {
            background-color: #f8fafc;
            width: 100%;
          }
          
          football-quiz-header .fq-nav-inner {
            display: flex;
            width: 100%;
            max-width: 75rem;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          football-quiz-header .fq-nav-list {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          football-quiz-header .fq-nav-item {
            position: relative;
          }
          
          football-quiz-header .fq-nav-link {
            color: #4a5568;
            font-weight: 500;
            padding: 1rem 1.25rem;
            display: block;
            text-decoration: none;
            transition: color 0.2s;
          }
          
          football-quiz-header .fq-nav-link:first-child {
            padding-left: 0;
          }
          
          football-quiz-header .fq-nav-link:hover {
            color: #1a202c;
          }
          
          football-quiz-header .fq-nav-link.active {
            color: #3b82f6;
            font-weight: 600;
          }
          
          football-quiz-header .fq-nav-link.active::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 70%;
            height: 0.125rem;
            background-color: #3b82f6;
          }
          
          football-quiz-header .fq-user-menu {
            display: flex;
            align-items: center;
          }
          
          football-quiz-header .fq-user-dropdown {
            position: relative;
          }
          
          football-quiz-header .fq-login-btn {
            display: inline-block;
            padding: 0.5rem 1rem;
            border: 0.0625rem solid #e2e8f0;
            border-radius: 0.25rem;
            text-decoration: none;
            color: #4a5568;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          football-quiz-header .fq-login-btn:hover {
            border-color: #cbd5e0;
            background-color: #f8fafc;
            color: #1a202c;
          }
          
          football-quiz-header .fq-username-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            font-weight: 500;
            background: none;
            border: none;
            cursor: pointer;
            color: #4a5568;
            position: relative;
          }
          
          football-quiz-header .fq-username-btn::after {
            content: "▼";
            font-size: 0.6rem;
            margin-left: 0.25rem;
          }
          
          football-quiz-header .fq-dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            border-radius: 0.25rem;
            box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
            min-width: 10rem;
            margin-top: 0.5rem;
            padding: 0.5rem;
            z-index: 100;
            display: none;
          }
          
          football-quiz-header .fq-dropdown-menu.visible {
            display: block;
          }
          
          football-quiz-header .fq-dropdown-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          
          football-quiz-header .fq-logout-btn {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.5rem 0.75rem;
            color: #4a5568;
            text-decoration: none;
            border-radius: 0.125rem;
            font-size: 0.9rem;
            line-height: 1.5;
            border: none;
            background: none;
            cursor: pointer;
          }
          
          
          football-quiz-header .fq-logout-btn:hover {
            background-color: #f8fafc;
            color: #1a202c;
          }
          
          football-quiz-header .fq-logout-btn {
            color: #e53e3e;
            font-weight: 500;
          }
          
          football-quiz-header .fq-hidden {
            display: none !important;
          }
        `;
        
        document.head.appendChild(styleElement);
      }
    }
    
    render() {
      this.innerHTML = `
        <header class="fq-header">
          <section class="fq-header-top">
            <div class="fq-header-top-inner">
              <div class="fq-logo-section">
                <a href="/" class="fq-logo" data-link>
                  <span class="fq-logo-icon" aria-hidden="true">⚽</span>
                  <h1>Football Quiz</h1>
                </a>
              </div>
          
              <div class="fq-user-menu">
                <a href="/login" class="fq-login-btn nav-link" data-link>Login</a>
                
                <div id="user-dropdown" class="fq-user-dropdown fq-hidden">
                  <button type="button" class="fq-username-btn" id="username-display">Username</button>
                  <nav class="fq-dropdown-menu" aria-label="User menu">
                    <ul class="fq-dropdown-list">
                      <li><button id="logout-button" type="button" class="fq-logout-btn">Log Out</button></li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          
          <section class="fq-header-nav">
            <nav class="fq-nav-inner">
              <ul class="fq-nav-list">
                <li class="fq-nav-item"><a href="/home" class="fq-nav-link nav-link" data-link>Home</a></li>
                <li class="fq-nav-item"><a href="/profile" class="fq-nav-link nav-link" data-link>Profile</a></li>
                <li class="fq-nav-item admin-item fq-hidden"><a href="/admin" class="fq-nav-link nav-link admin-link" data-link>Admin</a></li>
              </ul>
            </nav>
          </section>
        </header>
      `;
      
      this.updateActiveNavLink();
    }
    
    setupEventListeners() {
      const usernameButton = this.querySelector('.fq-username-btn');
      const userDropdown = this.querySelector('#user-dropdown');
      const dropdownMenu = this.querySelector('.fq-dropdown-menu');
      
      if (usernameButton && dropdownMenu) {
        usernameButton.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownMenu.classList.toggle('visible');
        });
      }
      
      const logoutButton = this.querySelector('#logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', () => this.handleLogout());
      }
      
      document.addEventListener('click', (event) => {
        const dropdownMenu = this.querySelector('.fq-dropdown-menu');
        if (dropdownMenu && dropdownMenu.classList.contains('visible')) {
          if (!userDropdown.contains(event.target)) {
            dropdownMenu.classList.remove('visible');
          }
        }
      });
    }
    
    updateActiveNavLink() {
      const currentPath = window.location.pathname;
      const navLinks = this.querySelectorAll('.nav-link');
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkPath = new URL(link.href).pathname;
        
        if (
          linkPath === currentPath || 
          (linkPath === '/home' && (currentPath === '/' || currentPath === '/home')) ||
          (linkPath !== '/home' && currentPath.startsWith(linkPath) && linkPath !== '/')
        ) {
          link.classList.add('active');
        }
      });
    }
    
    updateUserUI() {
      const authService = window.authService;
      
      if (!authService) {
        console.warn("Auth service not available");
        return;
      }
      
      const isAuthenticated = authService.isAuthenticated();
      const loginLink = this.querySelector('.fq-login-btn');
      const userDropdown = this.querySelector('#user-dropdown');
      const usernameDisplay = this.querySelector('#username-display');
      const adminItem = this.querySelector('.admin-item');
      
      if (isAuthenticated) {
        const user = authService.getUser();
        
        if (loginLink) loginLink.classList.add('fq-hidden');
        if (userDropdown) {
          userDropdown.classList.remove('fq-hidden');
          if (usernameDisplay && user) {
            usernameDisplay.textContent = user.username || 'User';
          }
        }
        
        if (adminItem) {
          if (authService.isQuizMaster && authService.isQuizMaster()) {
            adminItem.classList.remove('fq-hidden');
          } else {
            adminItem.classList.add('fq-hidden');
          }
        }
      } else {
        if (loginLink) loginLink.classList.remove('fq-hidden');
        if (userDropdown) userDropdown.classList.add('fq-hidden');
        if (adminItem) adminItem.classList.add('fq-hidden');
      }
    }
    
    handleLogout() {
      const authService = window.authService;
      
      if (authService && typeof authService.logout === 'function') {
        authService.logout();
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    
    disconnectedCallback() {
      const styleElement = document.getElementById('football-quiz-header-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }
  
  customElements.define('football-quiz-header', FootballQuizHeader);
  
  export default FootballQuizHeader;
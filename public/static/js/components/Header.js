class FootballQuizHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.user = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    window.addEventListener('popstate', () => this.updateActiveNavLink());
    
    setTimeout(() => {
      this.updateUserUI();
    }, 50);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        header {
          background-color: white;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
        }
        
        .header-top {
          border-bottom: 0.0625rem solid var(--gray-200);
          width: 100%;
        }
        
        .header-top-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: var(--container-max-width);
          margin: 0 auto;
          height: 4rem;
          padding: 0 1rem;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: 0.5rem;
        }
        
        .logo-icon {
          font-size: 1.5rem;
        }
        
        .logo h1 {
          font-size: 1.25rem;
          margin: 0;
          color: var(--gray-900);
        }
        
        .header-nav {
          background-color: var(--gray-50);
          width: 100%;
        }
        
        .nav-inner {
          display: flex;
          width: 100%;
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-link {
          color: var(--gray-600);
          font-weight: 500;
          padding: 1rem 1.25rem;
          display: block;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .nav-link:first-child {
          padding-left: 0;
        }
        
        .nav-link:hover {
          color: var(--gray-900);
        }
        
        .nav-link.active {
          color: var(--primary);
          font-weight: 600;
        }
        
        .nav-link.active::after {
          content: "";
          display: block;
          margin-top: 0.5rem;
          width: 70%;
          height: 0.125rem;
          background-color: var(--primary);
        }
        
        .user-menu {
          display: flex;
          align-items: center;
        }
        
        .user-dropdown {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .login-btn {
          display: inline-block;
          padding: 0.5rem 1rem;
          border: 0.0625rem solid var(--gray-200);
          border-radius: 0.25rem;
          text-decoration: none;
          color: var(--gray-600);
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .login-btn:hover {
          border-color: var(--gray-300);
          background-color: var(--gray-50);
          color: var(--gray-900);
        }
        
        .username-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-600);
        }
        
        .username-btn::after {
          content: "▼";
          font-size: 0.6rem;
          margin-left: 0.25rem;
        }
        
        .dropdown-menu {
          margin-top: 0.5rem;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          border-radius: 0.25rem;
          background-color: white;
          box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
          align-self: flex-end;
          min-width: 10rem;
        }
        
        .dropdown-menu.visible {
          max-height: 10rem; /* Enough height to show content */
        }
        
        .dropdown-list {
          list-style: none;
          margin: 0;
          padding: 0.5rem;
        }
        
        .logout-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          color: var(--error);
          text-decoration: none;
          border-radius: 0.125rem;
          font-size: 0.9rem;
          line-height: 1.5;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
        }
        
        .logout-btn:hover {
          background-color: var(--gray-50);
          color: var(--error-dark);
        }
        
        .hidden {
          display: none !important;
        }
      </style>
      
      <header>
        <section class="header-top">
          <section class="header-top-inner">
            <section class="logo-section">
              <a href="/" class="logo" data-link>
                <span class="logo-icon" aria-hidden="true">⚽</span>
                <h1>Football Quiz</h1>
              </a>
            </section>
        
            <section class="user-menu">
              <a href="/login" class="login-btn nav-link" data-link>Login</a>
              
              <section id="user-dropdown" class="user-dropdown hidden">
                <button type="button" class="username-btn" id="username-display">Username</button>
                <nav class="dropdown-menu" aria-label="User menu">
                  <ul class="dropdown-list">
                    <li><button id="logout-button" type="button" class="logout-btn">Log Out</button></li>
                  </ul>
                </nav>
              </section>
            </section>
          </section>
        </section>
        
        <section class="header-nav">
          <nav class="nav-inner">
            <ul class="nav-list">
              <li class="nav-item"><a href="/home" class="nav-link nav-link" data-link>Home</a></li>
              <li class="nav-item"><a href="/profile" class="nav-link nav-link" data-link>Profile</a></li>
              <li class="nav-item admin-item hidden"><a href="/admin" class="nav-link nav-link admin-link" data-link>Admin</a></li>
            </ul>
          </nav>
        </section>
      </header>
    `;
  }
  
  setupEventListeners() {
    const usernameButton = this.shadowRoot.querySelector('.username-btn');
    const dropdownMenu = this.shadowRoot.querySelector('.dropdown-menu');
    const userDropdown = this.shadowRoot.querySelector('#user-dropdown');
    
    if (usernameButton && dropdownMenu) {
      usernameButton.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.classList.toggle('visible');
      });
    }
    
    const logoutButton = this.shadowRoot.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.handleLogout());
    }
    
    document.addEventListener('click', (event) => {
      const dropdownMenu = this.shadowRoot.querySelector('.dropdown-menu');
      if (dropdownMenu && dropdownMenu.classList.contains('visible')) {
        // Need to check if click is outside of the component's shadow DOM
        const path = event.composedPath();
        if (!path.includes(userDropdown)) {
          dropdownMenu.classList.remove('visible');
        }
      }
    });

    this.shadowRoot.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState(null, null, href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });
  }
  
  updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
    
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
    const loginLink = this.shadowRoot.querySelector('.login-btn');
    const userDropdown = this.shadowRoot.querySelector('#user-dropdown');
    const usernameDisplay = this.shadowRoot.querySelector('#username-display');
    const adminItem = this.shadowRoot.querySelector('.admin-item');
    
    if (isAuthenticated) {
      const user = authService.getUser();
      
      if (loginLink) loginLink.classList.add('hidden');
      if (userDropdown) {
        userDropdown.classList.remove('hidden');
        if (usernameDisplay && user) {
          usernameDisplay.textContent = user.username || 'User';
        }
      }
      
      if (adminItem) {
        if (authService.isQuizMaster && authService.isQuizMaster()) {
          adminItem.classList.remove('hidden');
        } else {
          adminItem.classList.add('hidden');
        }
      }
    } else {
      if (loginLink) loginLink.classList.remove('hidden');
      if (userDropdown) userDropdown.classList.add('hidden');
      if (adminItem) adminItem.classList.add('hidden');
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
    // Clean up event listeners
    window.removeEventListener('popstate', this.updateActiveNavLink);
  }
}

customElements.define('football-quiz-header', FootballQuizHeader);

export default FootballQuizHeader;
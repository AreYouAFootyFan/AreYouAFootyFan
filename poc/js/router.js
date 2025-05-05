// router.js - Client-side router for the Football Arena SPA

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.contentArea = document.getElementById('app-content');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.templates = {};
        this.navHome = document.getElementById('nav-home');
        this.authSection = document.getElementById('auth-section');
        this.navSection = document.getElementById('nav-section');
        this.isAuthenticated = false; // For demo purposes, we'll toggle this

        // Setup click handler for the home logo
        if (this.navHome) {
            this.navHome.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate('/');
            });
        }

        // Initialize templates
        this.preloadTemplates();
        
        // Set up event listeners for navigation
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        window.addEventListener('DOMContentLoaded', this.handleRouteChange.bind(this));
        
        // Handle link clicks to use the router
        document.body.addEventListener('click', (e) => {
            // Find closest anchor tag if any in the event path
            const anchor = e.target.closest('a');
            if (anchor && anchor.getAttribute('href')?.startsWith('#/')) {
                e.preventDefault();
                const path = anchor.getAttribute('href').slice(1); // Remove the # character
                this.navigate(path);
            }
        });
    }

    // Register routes with their handling functions
    register(path, controller) {
        this.routes[path] = controller;
        return this;
    }

    // Navigate to a specific path
    navigate(path) {
        window.location.hash = path;
    }

    // Preload all HTML templates
    preloadTemplates() {
        // Get templates from index.html
        this.templates['home'] = document.getElementById('home-template');
        this.templates['game'] = document.getElementById('game-template');
        this.templates['profile'] = document.getElementById('profile-template');
        this.templates['leaderboard'] = document.getElementById('leaderboard-template');
    }

    // Show the loading indicator
    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'flex';
        }
        window.domUtils.clearElement(this.contentArea);
    }

    // Hide the loading indicator
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    // Update the UI based on authentication state
    updateAuthUI() {
        if (this.isAuthenticated) {
            this.authSection.style.display = 'none';
            this.navSection.style.display = 'flex';
        } else {
            this.authSection.style.display = 'flex';
            this.navSection.style.display = 'none';
        }
    }

    // Handle route changes (triggered by hashchange event or page load)
    async handleRouteChange() {
        this.showLoading();
        
        // Parse the path from the URL hash
        const path = window.location.hash.slice(1) || '/';
        this.currentRoute = path;
        
        // Find the matching route handler
        const route = this.routes[path] || this.routes['*'];
        
        if (route) {
            try {
                // Call the route handler
                await route(this);
            } catch (error) {
                console.error('Error handling route:', error);
                this.renderError('Error loading page content. Please try again.');
            }
        } else {
            console.error('No route handler found for path:', path);
            this.renderError('Page not found.');
        }
        
        this.hideLoading();
        
        // Reinitialize Lucide icons after content is loaded
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    // Render error message
    renderError(message) {
        window.domUtils.clearElement(this.contentArea);
        
        const errorContainer = window.domUtils.createElement('div', { className: 'error-container' }, [
            window.domUtils.createElement('h2', {}, 'Error'),
            window.domUtils.createElement('p', {}, message),
            window.domUtils.createButton('Return to Home', 'primary', {
                onclick: () => this.navigate('/')
            })
        ]);
        
        this.contentArea.appendChild(errorContainer);
    }
    
    // Render home page
    async renderHome() {
        const template = this.templates['home'];
        if (!template) {
            this.renderError('Home template not found.');
            return;
        }
        
        // Parse the template to DOM
        const content = window.domUtils.parseTemplate(template);
        
        // Clear content and append new page content
        window.domUtils.clearElement(this.contentArea);
        this.contentArea.appendChild(content);
        
        // Initialize home page-specific functionality
        const howItWorksBtn = document.getElementById('how-it-works-btn');
        if (howItWorksBtn) {
            howItWorksBtn.addEventListener('click', function() {
                alert('Football Arena tests your knowledge of football history, tactics, and trivia through engaging quizzes and challenges. Play to earn badges and climb the global leaderboard!');
            });
        }
        
        // Load leaderboard data for the preview section
        await window.loadLeaderboardPreview();
    }
    
    // Render game page
    async renderGame() {
        // Use template from preloaded templates
        const template = this.templates['game'];
        if (!template) {
            this.renderError('Game template not found.');
            return;
        }
        
        // Parse the template to DOM
        const content = window.domUtils.parseTemplate(template);
        
        // Clear content and append new page content
        window.domUtils.clearElement(this.contentArea);
        this.contentArea.appendChild(content);
        
        // Initialize game-specific functionality
        if (window.initializeGame) {
            window.initializeGame();
        } else {
            console.error('Game module not loaded');
        }
    }
    
    // Render profile page
    async renderProfile() {
        // Use template from preloaded templates
        const template = this.templates['profile'];
        if (!template) {
            this.renderError('Profile template not found.');
            return;
        }
        
        // Parse the template to DOM
        const content = window.domUtils.parseTemplate(template);
        
        // Clear content and append new page content
        window.domUtils.clearElement(this.contentArea);
        this.contentArea.appendChild(content);
        
        // For demo purposes, set isAuthenticated to true when profile is visited
        this.isAuthenticated = true;
        this.updateAuthUI();
        
        // Initialize profile-specific functionality
        if (window.initializeProfile) {
            window.initializeProfile();
        } else {
            console.error('Profile module not loaded');
        }
    }
    
    // Render leaderboard page
    async renderLeaderboard() {
        // Use template from preloaded templates
        const template = this.templates['leaderboard'];
        if (!template) {
            this.renderError('Leaderboard template not found.');
            return;
        }
        
        // Parse the template to DOM
        const content = window.domUtils.parseTemplate(template);
        
        // Clear content and append new page content
        window.domUtils.clearElement(this.contentArea);
        this.contentArea.appendChild(content);
        
        // Initialize leaderboard-specific functionality
        if (window.initializeLeaderboard) {
            window.initializeLeaderboard();
        } else {
            console.error('Leaderboard module not loaded');
        }
    }
    
    // Render 404 not found page
    renderNotFound() {
        window.domUtils.clearElement(this.contentArea);
        
        const notFoundContainer = window.domUtils.createElement('div', { className: 'error-container' }, [
            window.domUtils.createElement('h2', {}, 'Page Not Found'),
            window.domUtils.createElement('p', {}, 'The page you\'re looking for doesn\'t exist or has been moved.'),
            window.domUtils.createButton('Return to Home', 'primary', {
                onclick: () => this.navigate('/')
            })
        ]);
        
        this.contentArea.appendChild(notFoundContainer);
    }
}

// Initialize the router and register routes
const router = new Router();

// Register routes
router.register('/', (router) => router.renderHome())
      .register('/game', (router) => router.renderGame())
      .register('/profile', (router) => router.renderProfile())
      .register('/leaderboard', (router) => router.renderLeaderboard())
      .register('*', (router) => router.renderNotFound());

// Export the router for other modules to use
window.router = router;
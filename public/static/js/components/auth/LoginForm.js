import { StyleLoader } from "../../utils/cssLoader.js";

class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.errorMessage = '';
        this.showUsernameForm = false;
        this.styleSheet = new CSSStyleSheet();
    }

    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.checkAuthentication();
    }
    
    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/auth/loginform.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const loginPage = document.createElement('article');
        loginPage.className = 'login-page';
        
        const authMain = document.createElement('main');
        authMain.className = 'auth-main';
        
        const authContainer = document.createElement('section');
        authContainer.className = 'auth-container';
        
        const authHeader = document.createElement('header');
        authHeader.className = 'auth-header';
        
        const logoIcon = document.createElement('i');
        logoIcon.className = 'logo-icon';
        logoIcon.setAttribute('aria-hidden', 'true');
        logoIcon.textContent = '⚽';
        
        const h1 = document.createElement('h1');
        h1.textContent = 'Welcome to Footy Quiz';
        
        const introText = document.createElement('p');
        introText.textContent = 'Sign in to test your football knowledge';
        
        authHeader.appendChild(logoIcon);
        authHeader.appendChild(h1);
        authHeader.appendChild(introText);
        
        const googleSigninButton = document.createElement('section');
        googleSigninButton.id = 'google-signin-button';
        if (this.showUsernameForm) {
            googleSigninButton.classList.add('hidden');
        }
        
        const googleLoginLink = document.createElement('a');
        googleLoginLink.href = '#';
        googleLoginLink.id = 'google-login-link';
        
        const googleIcon = document.createElement('i');
        googleIcon.className = 'google-icon';
        googleIcon.textContent = 'G';
        
        googleLoginLink.appendChild(googleIcon);
        googleLoginLink.appendChild(document.createTextNode(' Sign in with Google'));
        
        if (window.authService) {
            googleLoginLink.href = window.authService.getAuthURL();
        }
        
        googleLoginLink.addEventListener('click', (e) => {
            if (!window.authService) {
                e.preventDefault();
                this.showError('Authentication service not available');
            }
        });
        
        googleSigninButton.appendChild(googleLoginLink);
        
        const usernameForm = document.createElement('form');
        usernameForm.id = 'username-container';

        if (!this.showUsernameForm) {
            usernameForm.classList.add('hidden');
        }
        
        const usernameTitle = document.createElement('h2');
        usernameTitle.textContent = 'Set Your Username';
        
        const usernameInfo = document.createElement('p');
        usernameInfo.textContent = 'Please choose a unique username to continue:';
        
        const usernameLabel = document.createElement('label');
        usernameLabel.setAttribute('for', 'username');
        usernameLabel.textContent = 'Username';
        
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.name = 'username';
        usernameInput.placeholder = 'Choose a username';
        usernameInput.minLength = 3;
        usernameInput.maxLength = 32;
        usernameInput.required = true;
        
        const usernameButton = document.createElement('button');
        usernameButton.type = 'submit';
        usernameButton.className = 'login-btn';
        usernameButton.textContent = 'Save Username';
        
        usernameForm.appendChild(usernameTitle);
        usernameForm.appendChild(usernameInfo);
        usernameForm.appendChild(usernameLabel);
        usernameForm.appendChild(usernameInput);
        usernameForm.appendChild(usernameButton);
        
        usernameForm.addEventListener('submit', this.handleUsernameSubmit.bind(this));
        
        const errorElement = document.createElement('p');
        errorElement.id = 'login-error';
        errorElement.className = 'error-message';

        if (!this.errorMessage) {
            errorElement.classList.add('hidden');
        }
        errorElement.textContent = this.errorMessage;
        
        authContainer.appendChild(authHeader);
        authContainer.appendChild(googleSigninButton);
        authContainer.appendChild(usernameForm);
        authContainer.appendChild(errorElement);
        
        authMain.appendChild(authContainer);
        
        const authFooter = document.createElement('footer');
        authFooter.className = 'auth-footer';
        
        const footerText = document.createElement('p');
        footerText.textContent = '© 2025 Football Quiz Platform. All rights reserved.';
        
        authFooter.appendChild(footerText);
        
        loginPage.appendChild(authMain);
        loginPage.appendChild(authFooter);
        
        this.shadowRoot.appendChild(loginPage);
        
        this.checkGoogleAuthCode();
    }
    
    checkGoogleAuthCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const googleCode = urlParams.get('code');
        
        if (googleCode) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.handleGoogleLogin(googleCode);
        }
    }
    
    async checkAuthentication() {
        if (!window.authService) return;
        
        try {
            const isAuthenticated = await window.authService.checkAuthentication();
            if (isAuthenticated) {
                if (window.authService.hasUsername()) {
                    window.location.href = '/home';
                } else {
                    this.displayUsernameForm();
                }
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
        }
    }
        
    async handleGoogleLogin(googleCode) {
        try {
            this.showLoadingState('Authenticating...');
            
            const result = await window.authService.loginWithGoogle(googleCode);
            
            if (result.requiresUsername) {
                this.displayUsernameForm();
            } else {
                window.location.href = '/home';
            }
        } catch (error) {
            this.hideLoadingState();
            this.showError('Login failed. Please try again.');
        }
    }
    
    showLoadingState(message = 'Loading...') {
        this.hideError();
        
        let loadingElement = this.shadowRoot.querySelector('.loading-indicator');
        
        if (!loadingElement) {
            loadingElement = document.createElement('section');
            loadingElement.className = 'loading-indicator';
            
            const container = this.shadowRoot.querySelector('.auth-container');
            if (container) {
                container.appendChild(loadingElement);
            }
        }
        
        loadingElement.textContent = message;
        
        const googleLoginLink = this.shadowRoot.querySelector('#google-login-link');
        if (googleLoginLink) {
            googleLoginLink.style.pointerEvents = 'none';
            googleLoginLink.style.opacity = '0.7';
        }
        
        const usernameForm = this.shadowRoot.querySelector('#username-container');
        if (usernameForm) {
            const inputs = usernameForm.querySelectorAll('input, button');
            inputs.forEach(input => {
                input.disabled = true;
            });
        }
    }
    
    hideLoadingState() {
        const loadingElement = this.shadowRoot.querySelector('.loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
        
        const googleLoginLink = this.shadowRoot.querySelector('#google-login-link');
        if (googleLoginLink) {
            googleLoginLink.style.pointerEvents = '';
            googleLoginLink.style.opacity = '';
        }
        const usernameForm = this.shadowRoot.querySelector('#username-container');
        if (usernameForm) {
            const inputs = usernameForm.querySelectorAll('input, button');
            inputs.forEach(input => {
                input.disabled = false;
            });
        }
    }
    
    async handleUsernameSubmit(event) {
        event.preventDefault();
        const usernameInput = this.shadowRoot.querySelector('#username');
        if (!usernameInput) return;
        
        const username = usernameInput.value.trim();
        
        if (username.length < 3 || username.length > 32) {
            this.showError('Username must be between 3 and 32 characters.');
            return;
        }
        
        try {
            this.showLoadingState('Setting username...');
            await window.authService.setUsername(username);
            window.location.href = '/home';
        } catch (error) {
            console.error('Set username error:', error);
            this.hideLoadingState();
            this.showError('Failed to set username. It might already be taken.');
        }
    }
    
    displayUsernameForm() {
        this.showUsernameForm = true;
        
        const usernameForm = this.shadowRoot.querySelector('#username-container');
        if (usernameForm) {
            usernameForm.classList.remove('hidden');
        }
        
        const googleSigninButton = this.shadowRoot.querySelector('#google-signin-button');
        if (googleSigninButton) {
            googleSigninButton.classList.add('hidden');
        }

        this.hideLoadingState();
    }
    
    showError(message) {
        console.error('Login error:', message);
        this.errorMessage = message;
        
        const errorElement = this.shadowRoot.querySelector('#login-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        this.hideLoadingState();
    }
    
    hideError() {
        this.errorMessage = '';
        
        const errorElement = this.shadowRoot.querySelector('#login-error');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }
}

customElements.define('auth-login', LoginForm);

export default LoginForm;
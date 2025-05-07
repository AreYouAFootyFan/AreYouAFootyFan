import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";

export default class LoginView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
    }

    async getHtml() {
        return `
        <style>
          .login-page {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            font-family: var(--font-sans, 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
          }
          
          .auth-main {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            background: linear-gradient(to right, #f8fbff, #e9f1ff);
            padding: 2rem;
          }
          
          .auth-container {
            background: #fff;
            padding: 2.5rem 2rem;
            max-width: 25rem;
            width: 100%;
            border-radius: 1rem;
            box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.05);
            text-align: center;
          }
          
          .auth-header {
            margin-bottom: 2rem;
          }
          
          .logo-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
          }
          
          h1 {
            font-size: 1.8rem;
            margin: 0.5rem 0;
            color: #333;
          }
          
          p {
            color: #666;
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }
          
          #google-signin-button {
            margin-bottom: 2rem;
          }
          
          #username-container {
            display: none;
            text-align: left;
          }
          
          #username-container h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: center;
          }
          
          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          
          input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .login-btn {
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s;
          }
          
          .login-btn:hover {
            background-color: #2563eb;
          }
          
          .error-message {
            color: #ef4444;
            margin-top: 1rem;
            font-size: 0.875rem;
          }
          
          .auth-footer {
            padding: 1.5rem;
            text-align: center;
            background-color: #1e293b;
            color: #cbd5e1;
          }
        </style>
        <div class="login-page">
          <main class="auth-main">
              <section class="auth-container">
                  <header class="auth-header">
                  <span class="logo-icon" aria-hidden="true">⚽</span>
                  <h1>Welcome to Footy Quiz</h1>
                  <p>Sign in to test your football knowledge</p>
                  </header>
      
                  <section id="google-signin-button"></section>
      
                  <form id="username-container">
                  <h2>Set Your Username</h2>
                  <p>Please choose a unique username to continue:</p>
                  <label for="username">Username</label>
                  <input 
                      type="text" 
                      id="username" 
                      name="username" 
                      placeholder="Choose a username" 
                      minlength="3"
                      maxlength="32"
                      required
                  />
                  <button type="submit" class="login-btn">Save Username</button>
                  </form>
                  
                  <div id="login-error" class="error-message" style="display: none;"></div>
              </section>
          </main>
          
          <footer class="auth-footer">
            <p>&copy; 2025 Football Quiz Platform. All rights reserved.</p>
          </footer>
        </div>
      `;
    }

    async mount() {
        const siteHeader = document.querySelector('.site-header');
        const siteFooter = document.querySelector('.site-footer');
        
        if (siteHeader) siteHeader.style.display = 'none';
        if (siteFooter) siteFooter.style.display = 'none';
        
        this.setupGoogleSignIn();
        
        const usernameForm = document.getElementById('username-container');
        if (usernameForm) {
            usernameForm.addEventListener('submit', this.handleUsernameSubmit.bind(this));
        }
        
        const isAuthenticated = await authService.checkAuthentication();
        if (isAuthenticated) {
            if (authService.hasUsername()) {
                window.location.href = '/home';
            } else {
                this.showUsernameForm();
            }
        }
    }

    setupGoogleSignIn() {
        authService.initGoogleSignIn(this.handleGoogleLogin.bind(this));
        
        const googleSigninButton = document.getElementById('google-signin-button');
        if (googleSigninButton) {
            googleSigninButton.innerHTML = `
                <div id="g_id_onload"
                    data-client_id="${authService.googleClientId}"
                    data-callback="handleCredentialResponse">
                </div>
                <div class="g_id_signin" data-type="standard"></div>
            `;
            
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }

    async handleGoogleLogin(googleToken) {
        try {
            const result = await authService.loginWithGoogle(googleToken);
            
            if (result.requiresUsername) {
                this.showUsernameForm();
            } else {
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.showLoginError('Login failed. Please try again.');
        }
    }

    async handleUsernameSubmit(event) {
        event.preventDefault();
        
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        
        if (username.length < 3 || username.length > 32) {
            this.showLoginError('Username must be between 3 and 32 characters.');
            return;
        }
        
        try {
            await authService.setUsername(username);
            window.location.href = '/home';
        } catch (error) {
            console.error('Set username error:', error);
            this.showLoginError('Failed to set username. It might already be taken.');
        }
    }

    showUsernameForm() {
        const usernameContainer = document.getElementById('username-container');
        const googleSigninButton = document.getElementById('google-signin-button');
        
        if (usernameContainer && googleSigninButton) {
            usernameContainer.style.display = 'block';
            googleSigninButton.style.display = 'none';
        }
    }

    showLoginError(message) {
        let errorElement = document.getElementById('login-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'login-error';
            errorElement.className = 'error-message';
            
            const authContainer = document.querySelector('.auth-container');
            authContainer.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    cleanup() {
        const siteHeader = document.querySelector('.site-header');
        const siteFooter = document.querySelector('.site-footer');
        
        if (siteHeader) siteHeader.style.display = '';
        if (siteFooter) siteFooter.style.display = '';
    }
}
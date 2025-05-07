// Updated index.js with web component support
import AdminDashboardView from "./views/AdminDashBoardView.js";
import HomeView from "./views/HomeView.js";
import ProfileView from "./views/ProfileView.js";
import QuizView from "./views/QuizView.js";
import CreateQuizView from "./views/CreateQuizView.js";
import LoginView from "./views/LoginView.js";
import authService from "./services/auth.service.js";
import categoryService from "./services/category.service.js";
import quizService from "./services/quiz.service.js";
import leaderboardService from "./services/leaderboard.service.js"

import "./services/api.service.js";
import "./services/category.service.js";
import "./services/difficulty.service.js";
import "./services/quiz.service.js";
import "./services/question.service.js";
import "./services/answer.service.js";
import "./services/quiz-attempt.service.js";

window.authService = authService;
window.categoryService = categoryService;
window.quizService = quizService;
window.leaderboardService = leaderboardService

let currentView = null;

const navigator = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
  if (currentView && typeof currentView.cleanup === 'function') {
    currentView.cleanup();
  }

  const routes = [
    { path: '/', view: LoginView },
    { path: '/home', view: HomeView },
    { path: '/profile', view: ProfileView },
    { path: '/quiz', view: QuizView },
    { path: '/admin', view: AdminDashboardView },
    { path: '/create-quiz', view: CreateQuizView },
    { path: '/login', view: LoginView },
  ];

  const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
  
  const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    
    return Object.fromEntries(keys.map((key, i) => {
      return [key, values[i]];
    }));
  };

  const possibleRoutes = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path))
    }
  });

  let currentRoute = possibleRoutes.find(possibleRoute => possibleRoute.result !== null);

  if(!currentRoute){
    currentRoute = {
      route: routes[0], //redirect to login
      result: [location.pathname]
    };
  }
  
  const view = new currentRoute.route.view(getParams(currentRoute));
  currentView = view;

  const isLoginPage = currentRoute.route.view === LoginView;
  const header = document.querySelector('football-quiz-header');
  const footer = document.querySelector('football-quiz-footer');
  
  if (header) {
    header.style.display = isLoginPage ? 'none' : 'block';
    // Update header UI after view is loaded
    if (!isLoginPage) {
      // We need to update the header UI twice:
      // 1. Immediately to catch the current auth state
      // 2. After a short delay to ensure everything is loaded
      updateHeaderUI();
      setTimeout(updateHeaderUI, 100);
    }
  }
  
  if (footer) {
    footer.style.display = isLoginPage ? 'none' : 'block';
  }

  document.querySelector("#app").innerHTML = await view.getHtml();
  
  if (typeof view.mount === 'function') {
    view.mount();
  }
};

// Global function to update header UI - can be called from anywhere
function updateHeaderUI() {
  const header = document.querySelector('football-quiz-header');
  if (header && typeof header.updateUserUI === 'function') {
    header.updateUserUI();
  }
  if (header && typeof header.updateActiveNavLink === 'function') {
    header.updateActiveNavLink();
  }
}

// Make updateHeaderUI accessible globally
window.updateHeaderUI = updateHeaderUI;

// Listen for auth state changes in the authService
const originalLoginWithGoogle = authService.loginWithGoogle;
if (originalLoginWithGoogle) {
  authService.loginWithGoogle = async function(...args) {
    const result = await originalLoginWithGoogle.apply(this, args);
    updateHeaderUI();
    return result;
  };
}

const originalLogout = authService.logout;
if (originalLogout) {
  authService.logout = function(...args) {
    const result = originalLogout.apply(this, args);
    updateHeaderUI();
    return result;
  };
}

window.addEventListener("popstate", router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if(event.target.matches('[data-link]')){
            event.preventDefault();
            navigator(event.target.href);
        }
    });

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    router();
});
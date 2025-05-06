import AdminDashboardView from "./views/AdminDashBoardView.js";
import HomeView from "./views/HomeView.js";
import ProfileView from "./views/ProfileView.js";
import QuizView from "./views/QuizView.js";
import CreateQuizView from "./views/CreateQuizView.js";
import LoginView from "./views/LoginView.js";
import authService from "./services/auth.service.js";

// Import all required services
import "./services/auth.service.js";
import "./services/api.service.js";
import "./services/category.service.js";
import "./services/difficulty.service.js";
import "./services/quiz.service.js";
import "./services/question.service.js";
import "./services/answer.service.js";
import "./services/quiz-attempt.service.js";

// Keep track of the current view instance to handle cleanup
let currentView = null;

const navigator = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
  // Clean up previous view if it exists
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

  // pathToRegex function to handle routes with parameters
  const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
  
  // Get params from match
  const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    
    return Object.fromEntries(keys.map((key, i) => {
      return [key, values[i]];
    }));
  };

  // Find the matching route
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
  };
  
  // Create the view instance
  const view = new currentRoute.route.view(getParams(currentRoute));
  currentView = view;

  // Check if we're on login page and hide header/footer if so
  const isLoginPage = currentRoute.route.view === LoginView;
  const header = document.querySelector('header.site-header');
  const footer = document.querySelector('footer.site-footer');
  
  if (header) {
    header.style.display = isLoginPage ? 'none' : 'flex';
  }
  
  if (footer) {
    footer.style.display = isLoginPage ? 'none' : 'flex';
  }

  // Render the view
  document.querySelector("#app").innerHTML = await view.getHtml();
  
  // Mount the view if it has a mount method
  if (typeof view.mount === 'function') {
    view.mount();
  }
};

window.addEventListener("popstate", router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if(event.target.matches('[data-link]')){
            event.preventDefault();
            navigator(event.target.href);
        }
    });

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize router
    router();
});
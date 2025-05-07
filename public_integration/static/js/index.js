import AdminDashboardView from "./views/AdminDashBoardView.js";
import HomeView from "./views/HomeView.js";
import ProfileView from "./views/ProfileView.js";
import QuizView from "./views/QuizView.js";
import CreateQuizView from "./views/CreateQuizView.js";
import LoginView from "./views/LoginView.js";
import authService from "./services/auth.service.js";

import "./services/auth.service.js";
import "./services/api.service.js";
import "./services/category.service.js";
import "./services/difficulty.service.js";
import "./services/quiz.service.js";
import "./services/question.service.js";
import "./services/answer.service.js";
import "./services/quiz-attempt.service.js";

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
  };
  
  const view = new currentRoute.route.view(getParams(currentRoute));
  currentView = view;

  const isLoginPage = currentRoute.route.view === LoginView;
  const header = document.querySelector('header.site-header');
  const footer = document.querySelector('footer.site-footer');
  
  if (header) {
    header.style.display = isLoginPage ? 'none' : 'flex';
  }
  
  if (footer) {
    footer.style.display = isLoginPage ? 'none' : 'flex';
  }

  document.querySelector("#app").innerHTML = await view.getHtml();
  
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

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    router();
});
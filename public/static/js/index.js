import AdminDashboardView from "./views/AdminDashBoardView.js";
import HomeView from "./views/HomeView.js";
import ProfileView from "./views/ProfileView.js";
import QuizView from "./views/QuizView.js";
import CreateQuizView from "./views/CreateQuizView.js";
import LoginView from "./views/LoginView.js";
import authService from "./services/auth.service.js";
import categoryService from "./services/category.service.js";
import quizService from "./services/quiz.service.js";
import leaderboardService from "./services/leaderboard.service.js";
import quizAttemptService from "./services/quiz-attempt.service.js";
import quizValidatorService from "./services/quiz-validator.service.js";
import statsService from "./services/stats.service.js";
import answerService from "./services/answer.service.js";
import difficultyService from "./services/difficulty.service.js";
import questionService from "./services/question.service.js";
import GameModeView from "./views/GameModeView.js";
import PlayQuizView from "./views/PlayQuizVuew.js";
import LeaderBoardView from "./views/LeaderboardView.js";

import "./services/FootballService.js";

window.authService = authService;
window.categoryService = categoryService;
window.quizService = quizService;
window.leaderboardService = leaderboardService;
window.quizAttemptService = quizAttemptService;
window.quizValidatorService = quizValidatorService;
window.statsService = statsService;
window.answerService = answerService;
window.difficultyService = difficultyService;
window.questionService = questionService;
window.footballService = footballService;

footballService.setApiKey("53aaedf27c25807e38c5e99b22a319ab");

let currentView = null;

export const navigator = (url) => {
  history.pushState(null, null, url);
  router();
};

export const router = async () => {
  if (currentView && typeof currentView.cleanup === "function") {
    currentView.cleanup();
  }

  const routes = [
    { path: "/", view: LoginView },
    { path: "/home", view: HomeView },
    { path: "/game-modes", view: GameModeView },
    { path: "/play-quiz", view: PlayQuizView },
    { path: "/profile", view: ProfileView },
    { path: "/leaderboard", view: LeaderBoardView },
    { path: "/quiz", view: QuizView },
    { path: "/admin", view: AdminDashboardView },
    { path: "/create-quiz", view: CreateQuizView },
    { path: "/login", view: LoginView },
  ];

  const pathToRegex = (path) =>
    new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

  const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1]
    );

    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  };

  const possibleRoutes = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let currentRoute = possibleRoutes.find(
    (possibleRoute) => possibleRoute.result !== null
  );

  if (!currentRoute) {
    currentRoute = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const view = new currentRoute.route.view(getParams(currentRoute));
  currentView = view;

  const isLoginPage = currentRoute.route.view === LoginView;
  const header = document.querySelector("football-quiz-header");
  const footer = document.querySelector("football-quiz-footer");

  if (header) {
    header.style.display = isLoginPage ? "none" : "block";
    if (!isLoginPage) {
      setTimeout(updateHeaderUI, 100);
    }
  }

  if (footer) {
    footer.style.display = isLoginPage ? "none" : "block";
  }

  const app = document.querySelector("#app");
  const htmlContent = await view.getHtml();
  app.replaceChildren(htmlContent);

  if (typeof view.mount === "function") {
    view.mount();
  }
};

function updateHeaderUI() {
  const header = document.querySelector("football-quiz-header");
  if (header && typeof header.updateUserUI === "function") {
    header.updateUserUI();
  }
  if (header && typeof header.updateActiveNavLink === "function") {
    header.updateActiveNavLink();
  }
}

window.updateHeaderUI = updateHeaderUI;

const originalLoginWithGoogle = authService.loginWithGoogle;
if (originalLoginWithGoogle) {
  authService.loginWithGoogle = async function (...args) {
    const result = await originalLoginWithGoogle.apply(this, args);
    updateHeaderUI();
    return result;
  };
}

const originalLogout = authService.logout;
if (originalLogout) {
  authService.logout = function (...args) {
    const result = originalLogout.apply(this, args);
    updateHeaderUI();
    return result;
  };
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.matches("[data-link]")) {
      event.preventDefault();
      navigator(event.target.href);
    }
  });

  router();
});

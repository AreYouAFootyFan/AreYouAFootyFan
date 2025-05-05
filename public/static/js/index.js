import AdminView from "./views/AdminView.js";
import HomeView from "./views/HomeView.js";
import ProfileView
 from "./views/ProfileView.js";import QuizView from "./views/QuizView.js";

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
        { path: '/home', view:  HomeView},
        { path: '/admin', view: AdminView },
        { path: '/profile', view: ProfileView },
        { path: '/quiz', view: QuizView }
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
            route: routes[0], //need custom 404
            result: [location.pathname]
        };
    };
    
    // Create the view instance
    const view = new currentRoute.route.view(getParams(currentRoute));
    currentView = view;

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

    router();
});

export const appState = {
  currentUser: null,
  isLoggedIn: false,
  currentPage: "home",
  currentAdminPage: "dashboard",
  quizzes: [
    {
      id: 1,
      title: "World Cup History",
      category: "world-cup",
      description: "Test your knowledge about World Cup history with these beginner-friendly questions.",
      questions: 10,
      timeEstimate: "5 min",
    },
    {
      id: 2,
      title: "Premier League Legends",
      category: "premier-league",
      description: "How well do you know the greatest players in Premier League history?",
      questions: 15,
      timeEstimate: "10 min",
    },
    {
      id: 3,
      title: "Champions League Trivia",
      category: "champions-league",
      description: "Only true football experts will ace this challenging Champions League quiz.",
      questions: 20,
      timeEstimate: "15 min",
    },
    {
      id: 4,
      title: "Football Stars",
      category: "players",
      description: "Test your knowledge about the biggest football stars of all time.",
      questions: 15,
      timeEstimate: "8 min",
    },
    {
      id: 5,
      title: "Premier League Basics",
      category: "premier-league",
      description: "New to football? Start with these basic Premier League questions.",
      questions: 10,
      timeEstimate: "5 min",
    },
    {
      id: 6,
      title: "World Cup Deep Dive",
      category: "world-cup",
      description: "Only the most dedicated football historians will know these World Cup facts.",
      questions: 20,
      timeEstimate: "15 min",
    },
  ],
  categories: [
    { id: "world-cup", name: "World Cup" },
    { id: "premier-league", name: "Premier League" },
    { id: "champions-league", name: "Champions League" },
    { id: "players", name: "Players" },
    { id: "teams", name: "Teams" },
    { id: "history", name: "History" },
    { id: "tactics", name: "Tactics" },
    { id: "referees", name: "Referees" },
    { id: "stadiums", name: "Stadiums" },
  ],
  leaderboardData: [
    {
      rank: 1,
      name: "FootballMaster",
      elo: 1845,
      quizzes: 42,
      accuracy: 94
    },
    {
      rank: 2,
      name: "SoccerQueen",
      elo: 1788,
      quizzes: 38,
      accuracy: 91
    },
    {
      rank: 3,
      name: "GoalMachine",
      elo: 1756,
      quizzes: 45,
      accuracy: 89
    },
    {
      rank: 4,
      name: "FootballFan22",
      elo: 1702,
      quizzes: 36,
      accuracy: 87
    },
    {
      rank: 5,
      name: "KickingKing",
      elo: 1689,
      quizzes: 31,
      accuracy: 85
    }
  ],
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  quizTimer: null,
  questionTimer: null,
  timeLeft: 30,
  score: 0,
  streak: 0,
}
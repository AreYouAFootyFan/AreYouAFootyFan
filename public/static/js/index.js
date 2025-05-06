import AdminView from "./views/AdminView.js";
import HomeView from "./views/HomeView.js";
import QuizView from "./views/QuizView.js";

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
        { path: '/', view:  HomeView},
        { path: '/admin', view: AdminView },
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
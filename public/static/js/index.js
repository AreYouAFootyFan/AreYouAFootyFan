import AdminView from "./views/AdminView.js";
import HomeView from "./views/HomeView.js";

const navigator = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: '/', view:  HomeView},
        { path: '/admin', view: AdminView }
    ];

    const possibleRoutes = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    });

    let currentRoute = possibleRoutes.find(possibleRoute => possibleRoute.isMatch);

    if(!currentRoute){
        currentRoute = {
            route: routes[0], //need custom 404
            isMatch: true
        };
    };
    
    const view = new currentRoute.route.view();

    document.querySelector("#app").innerHTML = await view.getHtml();
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
import AbstractView from "./AbstractView.js";
import "../components/Homepage/QuizHome.js";
import "../components/Homepage/QuizCard.js";
import "../components/Homepage/QuizLeaderboard.js";
import "../components/Homepage/QuizCategoryFilter.js"

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home - Football Quiz");
    }

    async getHtml() {
        return document.createElement('quiz-home');
    }

    async mount() {
    }
}
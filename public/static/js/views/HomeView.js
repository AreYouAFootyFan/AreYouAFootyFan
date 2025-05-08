import AbstractView from "./AbstractView.js";
import "../components/QuizHome.js";
import "../components/QuizCard.js";
import "../components/QuizLeaderboard.js";
import "../components/QuizCategoryFilter.js"

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home - Football Quiz");
    }

    async getHtml() {
        return `
           <quiz-home></quiz-home>
        `;
    }

    async mount() {
    }
}
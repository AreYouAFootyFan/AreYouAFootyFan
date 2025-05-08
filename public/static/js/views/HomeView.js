import AbstractView from "./AbstractView.js";
import "../components/homepage/QuizHome.js";
import "../components/homepage/QuizCard.js";
import "../components/homepage/QuizLeaderboard.js";
import "../components/homepage/QuizCategoryFilter.js"

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
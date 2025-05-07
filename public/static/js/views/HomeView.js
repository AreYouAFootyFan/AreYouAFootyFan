import AbstractView from "./AbstractView.js";
import "../components/FootballQuizHome.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home - Football Quiz");
    }

    async getHtml() {
        return `
            <football-quiz-home></football-quiz-home>
        `;
    }

    async mount() {
    }
}
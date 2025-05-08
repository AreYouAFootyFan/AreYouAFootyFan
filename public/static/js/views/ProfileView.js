import AbstractView from "./AbstractView.js";
import "../components/profile/FootballQuizProfile.js";

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile - Football Quiz");
    }

    async getHtml() {
        return `
            <football-quiz-profile></football-quiz-profile>
        `;
    }

    async mount() {
    }
    
    cleanup() {
    }
}
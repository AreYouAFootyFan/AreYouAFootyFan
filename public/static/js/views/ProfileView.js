import AbstractView from "./AbstractView.js";
import "../components/profile/UserProfile.js";

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile - Football Quiz");
    }

    async getHtml() {
        document.createElement('user-profile');
    }

    async mount() {
    }
    
    cleanup() {
    }
}
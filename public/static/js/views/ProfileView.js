import AbstractView from "./AbstractView.js";
import "../components/shared/StatsCard.js";
import "../components/profile/UserProfile.js";
import { Message } from "../enums/index.js";

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle(Message.View.Title.PROFILE);
    }

    async getHtml() {
       return document.createElement('user-profile');
    }

    async mount() {
    }
    
    cleanup() {
    }
}
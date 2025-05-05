import AbstractView from "./AbstractView.js";

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile");
    }

    async getHtml(){
        return `
            <h1>You are an Admin</h1>
        `;
    }
}
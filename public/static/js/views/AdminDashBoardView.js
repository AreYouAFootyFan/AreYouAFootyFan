import AbstractView from "./AbstractView.js";
import "../components/admin/AdminDashboard.js";

export default class AdminDashboardView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Admin Dashboard");
    }

    async getHtml() {
       return document.createElement('admin-dashboard');
    }

    async mount() {
    }
    
    cleanup() {
    }
}
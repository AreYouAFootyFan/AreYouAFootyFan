import AbstractView from "./AbstractView.js";
import "../components/admin/AdminDashboard.js";
import { Role } from "../enums/index.js";

export default class AdminDashboardView extends AbstractView {
  constructor() {
    super();
    this.setTitle(`${Role.Manager} Dashboard`);
  }

  async getHtml() {
    return document.createElement("admin-dashboard");
  }

  async mount() {}

  cleanup() {}
}

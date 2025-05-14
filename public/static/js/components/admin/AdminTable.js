import { StyleLoaderStatic } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class AdminTable extends HTMLElement {
  static {
    this.styleSheet = null;
    this.stylesLoaded = this.loadStylesOnce();
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._columns = [];
    this._data = [];
  }

  async connectedCallback() {
    await AdminTable.stylesLoaded;
    this.shadowRoot.adoptedStyleSheets = AdminTable.styleSheet;
    this.render();
  }

  set columns(value) {
    this._columns = value;
    this.render();
  }

  get columns() {
    return this._columns;
  }

  set data(value) {
    this._data = value;
    this.render();
  }

  get data() {
    return this._data;
  }

  static async loadStylesOnce() {
    try {
      if (!this.styleSheet) {
        this.styleSheet = await StyleLoaderStatic(
          "./static/css/styles.css",
          "./static/css/admin/shared.css",
          "./static/css/admin/adminTable.css"
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  render() {
    clearDOM(this.shadowRoot);

    const table = document.createElement("table");
    table.className = "admin-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    this._columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column.title;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    if (this._data.length === 0) {
      const emptyRow = document.createElement("tr");
      const emptyCell = document.createElement("td");
      emptyCell.colSpan = this._columns.length;
      emptyCell.className = "empty-message";
      emptyCell.textContent = "No data available";
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      this._data.forEach((row) => {
        const tr = this.createTableRow(row);
        tbody.appendChild(tr);
      });
    }

    table.appendChild(tbody);

    this.shadowRoot.appendChild(table);

    this.setupEventListeners();
  }

  createTableRow(row) {
    const tr = document.createElement("tr");

    this._columns.forEach((column) => {
      const cell = row[column.key];
      const td = this.createTableCell(cell, column.key);
      tr.appendChild(td);
    });

    return tr;
  }

  createTableCell(cell, columnKey) {
    const td = document.createElement("td");

    if (!cell) {
      return td;
    }

    if (typeof cell === "object") {
      switch (cell.type) {
        case "badge":
          const badge = document.createElement("p");
          badge.className = `status-badge ${cell.class}`;
          badge.textContent = cell.value;
          td.appendChild(badge);
          break;

        case "actions":
          const actionsSection = document.createElement("section");
          actionsSection.className = "table-actions";

          cell.items.forEach((item) => {
            const button = document.createElement("button");
            button.className = "action-btn";
            button.title = item.title;
            button.dataset.action = item.action;
            button.dataset.id = item.data.id;
            button.dataset.title = item.data.title || "";
            button.dataset.name = item.data.name || "";

            const icon = document.createElement("i");
            icon.className = "action-icon";
            icon.textContent = item.icon;

            button.appendChild(icon);
            actionsSection.appendChild(button);
          });

          td.appendChild(actionsSection);
          break;

        default:
          td.textContent = cell.value;
      }
    } else {
      td.textContent = cell;
    }

    return td;
  }

  setupEventListeners() {
    const actionButtons = this.shadowRoot.querySelectorAll(".action-btn");
    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        const data = {
          id: button.dataset.id,
          title: button.dataset.title,
          name: button.dataset.name,
        };

        this.dispatchEvent(
          new CustomEvent("action", {
            detail: { action, data },
            bubbles: true,
            composed: true,
          })
        );
      });
    });
  }
}

customElements.define("admin-table", AdminTable);

export default AdminTable;

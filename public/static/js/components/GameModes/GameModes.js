import categoryService from "../../services/category.service.js";
import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class GameModes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.gameModes;
  }

  async connectedCallback() {
    await this.loadStyles();
    clearDOM(this.shadowRoot);
    await this.render();
    this.setupEventListeners();
  }


  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/home/home.css",
      "./static/css/gameModes/gameModeStyles.css"
    );
  }

  async render() {
    const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }

  buildMainContent() {
    const main = document.createElement("main");

    const hero = document.createElement("section");
    hero.className = "hero";

    const heroContent = document.createElement("section");
    heroContent.className = "hero-content";

    const heroTitle = document.createElement("h2");
    heroTitle.className = "hero-title";
    heroTitle.textContent =
      "Choose from a variety of game modes and challenge yourself";

    heroContent.appendChild(heroTitle);
    hero.appendChild(heroContent);
    main.appendChild(hero);

    const contentSection = document.createElement("section");
    contentSection.className = "content-section";

    const sectionHeader = document.createElement("header");
    sectionHeader.className = "section-header";

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = "Available Game Modes";

    sectionHeader.appendChild(sectionTitle);
    contentSection.appendChild(sectionHeader);

    const gameModeGrid = document.createElement("section");
    gameModeGrid.id = "game-mode-grid";
    gameModeGrid.className = "game-mode-grid";

    this.renderGameModeCards(gameModeGrid);
    contentSection.appendChild(gameModeGrid);

    main.appendChild(contentSection);

    return main;
  }

  async renderGameModeCards(container) {
    this.gameModes = await categoryService.getAllCategories();
    this.gameModes.forEach((gameMode) => {
      const card = this.createGameModeCard(gameMode);
      container.appendChild(card);
    });
  }

  createGameModeCard(gameMode) {
    const card = document.createElement("article");
    card.className = "game-mode-card";
    card.dataset.modeId = gameMode.category_id;

    const iconContainer = document.createElement("section");
    iconContainer.className = "mode-icon";
    iconContainer.textContent = gameMode.icon;

    const content = document.createElement("section");
    content.className = "mode-content";

    const title = document.createElement("h3");
    title.className = "mode-title";
    title.textContent = gameMode.category_name;

    const description = document.createElement("p");
    description.className = "mode-description";
    description.textContent = gameMode.category_description;

    const playButton = document.createElement("button");
    playButton.className = "mode-play-button";
    playButton.textContent = "Play Now";

    content.appendChild(title);
    content.appendChild(description);

    card.appendChild(content);
    card.appendChild(playButton);

    return card;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (event) => {
      const playButton = event.target.closest(".mode-play-button");
      const card = event.target.closest(".game-mode-card");

      if (playButton && card) {
        const modeId = card.dataset.modeId;
        this.handleGameModeSelection(modeId);
      }
    });
  }

  handleGameModeSelection(modeId) {
    window.location.href = `/play-quiz?modeId=${encodeURIComponent(modeId)}`;
  }
}

customElements.define("game-modes", GameModes);

export default GameModes;

import { StyleLoader } from "../../utils/cssLoader.js";

/**
 * GameModes component displays available game modes for selection
 */
class GameModes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.gameModes = [
        {
            id: "quiz",
            title: "Quizzes",
            description: "Test your knowledge across various categories",
            icon: "🧠"
        },
        {
            id: "fill-in-the-blank",
            title: "Fill In The Blank",
            description: "Complete the sentences with the correct words",
            icon: "✏️"
        },
        {
            id: "true-false",
            title: "True Or False",
            description: "Challenge yourself in a true or false quiz",
            icon: "✅"
        },
        {
            id: "higher-lower",
            title: "Higher Or Lower",
            description: "Guess if the next answer is higher or lower",
            icon: "📊"
        },
        {
            id:"football-personality",
            title: "Football Personality",
            description: "Discover your football personality",
            icon: "⚽"
        },
    ];
  }

  /**
   * Lifecycle callback when element is added to DOM
   */
  async connectedCallback() {
    await this.loadStyles();
    this.clearDOM(this.shadowRoot);
    await this.render();
    this.setupEventListeners();
  }

  /**
   * Clear all child nodes from a DOM element
   * @param {HTMLElement} element - Element to clear
   */
  clearDOM(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Load component stylesheets
   */
  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/home/home.css",
      "./static/css/gameModes/gameModeStyles.css"
    );
  }

  /**
   * Render component content
   */
  async render() {
    const shadow = this.shadowRoot;
    const homeContent = this.buildMainContent();
    shadow.appendChild(homeContent);
  }

  /**
   * Build main content structure
   * @returns {HTMLElement} Main content element
   */
  buildMainContent() {
    const main = document.createElement("main");

    // Hero Section
    const hero = document.createElement("section");
    hero.className = "hero";

    const heroContent = document.createElement("section");
    heroContent.className = "hero-content";

    const heroTitle = document.createElement("h2");
    heroTitle.className = "hero-title";
    heroTitle.textContent = "Select Game Mode";

    const heroSubtitle = document.createElement("p");
    heroSubtitle.className = "hero-subtitle";
    heroSubtitle.textContent =
      "Choose from a variety of game modes and challenge yourself";

    heroContent.appendChild(heroTitle);
    heroContent.appendChild(heroSubtitle);
    hero.appendChild(heroContent);
    main.appendChild(hero);

    // Content Section
    const contentSection = document.createElement("section");
    contentSection.className = "content-section";

    const sectionHeader = document.createElement("header");
    sectionHeader.className = "section-header";

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = "Available Game Modes";

    sectionHeader.appendChild(sectionTitle);
    contentSection.appendChild(sectionHeader);

    // Game Modes Grid
    const gameModeGrid = document.createElement("section");
    gameModeGrid.id = "game-mode-grid";
    gameModeGrid.className = "game-mode-grid";

    this.renderGameModeCards(gameModeGrid);
    contentSection.appendChild(gameModeGrid);

    main.appendChild(contentSection);
    
    return main;
  }

  /**
   * Render game mode cards
   * @param {HTMLElement} container - Container element for cards
   */
  renderGameModeCards(container) {
    this.gameModes.forEach(gameMode => {
      const card = this.createGameModeCard(gameMode);
      container.appendChild(card);
    });
  }

  /**
   * Create a game mode card
   * @param {Object} gameMode - Game mode data
   * @returns {HTMLElement} Game mode card element
   */
  createGameModeCard(gameMode) {
    const card = document.createElement("article");
    card.className = "game-mode-card";
    card.dataset.modeId = gameMode.id;

    const iconContainer = document.createElement("div");
    iconContainer.className = "mode-icon";
    iconContainer.textContent = gameMode.icon;
    
    const content = document.createElement("div");
    content.className = "mode-content";
    
    const title = document.createElement("h3");
    title.className = "mode-title";
    title.textContent = gameMode.title;
    
    const description = document.createElement("p");
    description.className = "mode-description";
    description.textContent = gameMode.description;
    
    const playButton = document.createElement("button");
    playButton.className = "mode-play-button";
    playButton.textContent = "Play Now";
    
    content.appendChild(title);
    content.appendChild(description);
    
    card.appendChild(iconContainer);
    card.appendChild(content);
    card.appendChild(playButton);
    
    return card;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (event) => {
      // Check if clicked element is a play button or inside a game mode card
      const playButton = event.target.closest(".mode-play-button");
      const card = event.target.closest(".game-mode-card");
      
      if (playButton && card) {
        const modeId = card.dataset.modeId;
        this.handleGameModeSelection(modeId);
      }
    });
  }

  /**
   * Handle game mode selection
   * @param {string} modeId - Selected game mode ID
   */
  handleGameModeSelection(modeId) {
    // Store the selected game mode in localStorage if needed
    localStorage.setItem("selected_game_mode", modeId);
    
    // Redirect to the game modes page
    window.location.href = "/play-quiz";
  }
}

// Register the component with the correct name
customElements.define("game-modes", GameModes);

export default GameModes;
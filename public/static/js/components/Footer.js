import { StyleLoader } from "../utils/cssLoader.js";
import { clearDOM } from "../utils/domHelpers.js";
class FootballQuizFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
        await this.loadStyles();
    this.render();
  }
  
  async loadStyles() {
      await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/footer/footer.css'
        );
  }

  render() {
    clearDOM(this.shadowRoot);
    
    const footer = document.createElement('footer');
    
    const footerContainer = document.createElement('section');
    footerContainer.className = 'footer-container';
    
    const copyright = document.createElement('p');
    copyright.className = 'copyright';
    copyright.textContent = '© 2025 Football Quiz. All rights reserved.';
    
    const nav = document.createElement('nav');
    const navList = document.createElement('ul');
    
    nav.appendChild(navList);
    
    footerContainer.appendChild(copyright);
    footerContainer.appendChild(nav);
    footer.appendChild(footerContainer);
    
    this.shadowRoot.appendChild(footer);
  }
}

customElements.define('football-quiz-footer', FootballQuizFooter);

export default FootballQuizFooter;
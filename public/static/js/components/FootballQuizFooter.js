class FootballQuizFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        footer {
          background-color: var(--gray-800);
          color: var(--gray-300);
          padding: var(--spacing-6, 1.5rem) var(--spacing-4);
          margin-top: auto;
          width: 100%;
        }
        
        .footer-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-4, 1rem);
          width: 100%;
          max-width: var(--container-max-width);
          margin: 0 auto;
        }
        
        .copyright {
          margin: 0;
          font-size: var(--font-size-sm);
        }
        
        nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: var(--spacing-6, 1.5rem);
        }
        
        nav a {
          color: var(--gray-400);
          text-decoration: none;
          font-size: var(--font-size-sm);
          transition: var(--transition-normal, color 0.2s);
        }
        
        nav a:hover {
          color: white;
        }
      </style>
      
      <footer>
        <section class="footer-container">
          <p class="copyright">&copy; 2025 Football Quiz. All rights reserved.</p>
          <nav>
            <ul>
              <li><a href="#/privacy">Privacy</a></li>
              <li><a href="#/terms">Terms</a></li>
            </ul>
          </nav>
        </section>
      </footer>
    `;
  }
}

customElements.define('football-quiz-footer', FootballQuizFooter);

export default FootballQuizFooter;
class FootballQuizFooter extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.addStyles();
      this.render();
    }
    
    addStyles() {
      const styleId = 'football-quiz-footer-styles';
      
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        
        styleElement.textContent = `
          /* Self-contained footer styles */
          football-quiz-footer {
            display: block;
            width: 100%;
          }
          
          football-quiz-footer .fq-footer {
            background-color: #1e293b;
            color: #cbd5e1;
            padding: 1.5rem 1rem;
            margin-top: auto;
            width: 100%;
          }
          
          football-quiz-footer .fq-footer-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            width: 100%;
            max-width: 75rem;
            margin: 0 auto;
          }
          
          football-quiz-footer .fq-footer-copyright {
            margin: 0;
            font-size: 0.875rem;
          }
          
          football-quiz-footer .fq-footer-nav ul {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 1.5rem;
          }
          
          football-quiz-footer .fq-footer-link {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.875rem;
            transition: color 0.2s;
          }
          
          football-quiz-footer .fq-footer-link:hover {
            color: white;
          }
        `;
        
        document.head.appendChild(styleElement);
      }
    }
    
    render() {
      this.innerHTML = `
        <footer class="fq-footer">
          <div class="fq-footer-inner">
            <p class="fq-footer-copyright">&copy; 2025 Football Quiz. All rights reserved.</p>
            <nav class="fq-footer-nav">
              <ul>
                <li><a href="#/privacy" class="fq-footer-link">Privacy</a></li>
                <li><a href="#/terms" class="fq-footer-link">Terms</a></li>
              </ul>
            </nav>
          </div>
        </footer>
      `;
    }
    
    disconnectedCallback() {
      const styleElement = document.getElementById('football-quiz-footer-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }
  
  customElements.define('football-quiz-footer', FootballQuizFooter);
  
  export default FootballQuizFooter;
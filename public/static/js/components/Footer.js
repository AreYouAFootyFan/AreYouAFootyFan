class FootballQuizFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.styleSheet = new CSSStyleSheet();
  }

  connectedCallback() {
    this.loadStyles();
    this.render();
  }
  
  async loadStyles() {
    try {
      const cssText = await fetch('./static/css/footer/footer.css').then(r => r.text());
      this.styleSheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [this.styleSheet];
    } catch (error) {
      console.error('Error loading styles:', error);
    }
  }

  render() {
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    
    const footer = document.createElement('footer');
    
    const footerContainer = document.createElement('section');
    footerContainer.className = 'footer-container';
    
    const copyright = document.createElement('p');
    copyright.className = 'copyright';
    copyright.textContent = '© 2025 Football Quiz. All rights reserved.';
    
    const nav = document.createElement('nav');
    const navList = document.createElement('ul');
    
    const privacyItem = document.createElement('li');
    const privacyLink = document.createElement('a');
    privacyLink.href = '#/privacy';
    privacyLink.textContent = 'Privacy';
    privacyItem.appendChild(privacyLink);
    
    const termsItem = document.createElement('li');
    const termsLink = document.createElement('a');
    termsLink.href = '#/terms';
    termsLink.textContent = 'Terms';
    termsItem.appendChild(termsLink);
    
    navList.appendChild(privacyItem);
    navList.appendChild(termsItem);
    nav.appendChild(navList);
    
    footerContainer.appendChild(copyright);
    footerContainer.appendChild(nav);
    footer.appendChild(footerContainer);
    
    this.shadowRoot.appendChild(footer);
  }
}

customElements.define('football-quiz-footer', FootballQuizFooter);

export default FootballQuizFooter;
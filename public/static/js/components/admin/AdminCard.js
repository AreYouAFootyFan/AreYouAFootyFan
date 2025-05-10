import { StyleLoader } from "../../utils/cssLoader.js";
class AdminCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'action', 'action-view', 'full-width'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.setupEventListeners();
        this.updateFullWidthStyle();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected) {
            this.render();
        }
    }
    
    async loadStyles() {
          await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/admin/shared.css',
            './static/css/admin/adminCard.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const title = this.getAttribute('title') || '';
        const action = this.getAttribute('action') || '';
        const actionView = this.getAttribute('action-view') || '';
        const fullWidth = this.hasAttribute('full-width');

        const card = document.createElement('article');
        card.className = 'admin-card';
        
        if (title) {
            const header = document.createElement('header');
            header.className = 'card-header';
            
            const heading = document.createElement('h2');
            heading.textContent = title;
            header.appendChild(heading);
            
            if (action) {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'text-btn';
                actionBtn.dataset.view = actionView;
                actionBtn.textContent = action;
                header.appendChild(actionBtn);
            }
            
            card.appendChild(header);
        }
        
        const content = document.createElement('section');
        content.className = 'card-content';
        
        const slot = document.createElement('slot');
        slot.name = 'content';
        content.appendChild(slot);
        
        card.appendChild(content);
        
        this.shadowRoot.appendChild(card);
    }

    updateFullWidthStyle() {
        const isFullWidth = this.hasAttribute('full-width');
        
        if (isFullWidth) {
            this.classList.add('full-width');
        } else {
            this.classList.remove('full-width');
        }
    }
    
    setupEventListeners() {
        const actionButton = this.shadowRoot.querySelector('.text-btn');
        if (actionButton) {
            actionButton.addEventListener('click', () => {
                const view = actionButton.dataset.view;
                this.dispatchEvent(new CustomEvent('action-click', {
                    detail: { view },
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }
}

customElements.define('admin-card', AdminCard);

export default AdminCard;
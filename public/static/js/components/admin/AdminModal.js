class AdminModal extends HTMLElement {
    static get observedAttributes() {
        return ['title'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isVisible = false;
        this.styleSheet = new CSSStyleSheet();
    }
    
    connectedCallback() {
        this.loadStyles();
        this.render();
        this.setupEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected) {
            this.render();
        }
    }
    
    async loadStyles() {
         try {
            const globalStylesResponse = await fetch('./static/css/styles.css');
            const globalStyles = await globalStylesResponse.text();
            const globalStyleSheet = new CSSStyleSheet();
            globalStyleSheet.replaceSync(globalStyles);
            
            const adminSharedStylesResponse = await fetch('./static/css/admin/shared.css');
            const adminSharedStyles = await adminSharedStylesResponse.text();
            const adminSharedStyleSheet = new CSSStyleSheet();
            adminSharedStyleSheet.replaceSync(adminSharedStyles);
            
            const componentStylesResponse = await fetch('./static/css/admin/adminmodal.css');
            const componentStyles = await componentStylesResponse.text();
            const componentStyleSheet = new CSSStyleSheet();
            componentStyleSheet.replaceSync(componentStyles);
            
            this.shadowRoot.adoptedStyleSheets = [
                globalStyleSheet, 
                adminSharedStyleSheet, 
                componentStyleSheet
            ];
        } catch (error) {
            console.error('Error loading styles:', error);
        }
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const title = this.getAttribute('title') || 'Modal';
        
        const modal = document.createElement('section');
        modal.className = 'modal';
        modal.id = 'modal';
        
        const modalContent = document.createElement('article');
        modalContent.className = 'modal-content';
        
        const modalHeader = document.createElement('header');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-modal';
        closeButton.id = 'close-btn';
        closeButton.innerHTML = '&times;';
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const modalBody = document.createElement('section');
        modalBody.className = 'modal-body';
        
        const contentSlot = document.createElement('slot');
        contentSlot.name = 'content';
        modalBody.appendChild(contentSlot);
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        
        this.shadowRoot.appendChild(modal);
    }
    
    setupEventListeners() {
        const modal = this.shadowRoot.querySelector('#modal');
        const closeBtn = this.shadowRoot.querySelector('#close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide();
                }
            });
        }
    }
    
    show() {
        const modal = this.shadowRoot.querySelector('#modal');
        if (modal) {
            modal.classList.add('visible');
            this.isVisible = true;
        }
    }
    
    hide() {
        const modal = this.shadowRoot.querySelector('#modal');
        if (modal) {
            modal.classList.remove('visible');
            this.isVisible = false;
        }
    }
}

customElements.define('admin-modal', AdminModal);

export default AdminModal;
class AdminNotification extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.message = '';
        this.type = 'success';
        this.timeout = null;
        this.styleSheet = new CSSStyleSheet();
    }
    
    connectedCallback() {
        this.loadStyles();
        this.render();
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
            
            const componentStylesResponse = await fetch('./static/css/admin/adminnotification.css');
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
        
        const toast = document.createElement('article');
        toast.className = `toast hidden ${this.type}`;
        toast.id = 'toast';
        
        const message = document.createElement('p');
        message.id = 'message';
        message.textContent = this.message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-toast';
        closeBtn.id = 'close-btn';
        closeBtn.innerHTML = '&times;';
        
        toast.appendChild(message);
        toast.appendChild(closeBtn);
        
        this.shadowRoot.appendChild(toast);
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const closeBtn = this.shadowRoot.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }
    }
    
    show(message, type = 'success') {
        this.message = message;
        this.type = type;
        
        this.render();
        
        const toast = this.shadowRoot.querySelector('#toast');
        if (toast) {
            toast.classList.remove('hidden');
            
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            
            this.timeout = setTimeout(() => {
                this.hide();
            }, 3000);
        }
    }
    
    hide() {
        const toast = this.shadowRoot.querySelector('#toast');
        if (toast) {
            toast.classList.add('hidden');
        }
        
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

customElements.define('admin-notification', AdminNotification);

export default AdminNotification;
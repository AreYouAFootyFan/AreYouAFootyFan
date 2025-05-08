class AdminNotification extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.message = '';
        this.type = 'success';
        this.timeout = null;
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 1001;
                }
                
                .toast {
                    padding: 1rem 1.5rem;
                    border-radius: 0.25rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.15);
                    min-width: 20rem;
                    max-width: 25rem;
                    transition: opacity 0.3s, transform 0.3s;
                    transform: translateY(0);
                    opacity: 1;
                }
                
                .toast.hidden {
                    transform: translateY(2rem);
                    opacity: 0;
                    pointer-events: none;
                }
                
                .toast.success {
                    background-color: var(--success);
                }
                
                .toast.error {
                    background-color: var(--error);
                }
                
                .toast.info {
                    background-color: var(--info);
                }
                
                .close-toast {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.25rem;
                    cursor: pointer;
                    width: 1.5rem;
                    height: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 1rem;
                }
            </style>
            
            <article class="toast hidden ${this.type}" id="toast">
                <p id="message">${this.message}</p>
                <button class="close-toast" id="close-btn">&times;</button>
            </article>
        `;
        
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
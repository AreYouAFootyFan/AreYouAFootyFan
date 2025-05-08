class AdminCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'action', 'action-view', 'full-width'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected) {
            this.render();
        }
    }
    
    render() {
        const title = this.getAttribute('title') || '';
        const action = this.getAttribute('action') || '';
        const actionView = this.getAttribute('action-view') || '';
        const fullWidth = this.hasAttribute('full-width');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    ${fullWidth ? 'grid-column: 1 / -1;' : ''}
                }
                
                .admin-card {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                }
                
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 0.0625rem solid var(--gray-200);
                }
                
                .card-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .text-btn {
                    background: none;
                    border: none;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem;
                    color: var(--primary);
                    cursor: pointer;
                    font-family: inherit;
                }
                
                .text-btn:hover {
                    text-decoration: underline;
                }
                
                .card-content {
                    padding: 1.5rem;
                }
            </style>
            
            <article class="admin-card">
                ${title ? `
                    <header class="card-header">
                        <h2>${title}</h2>
                        ${action ? `<button class="text-btn" data-view="${actionView}">${action}</button>` : ''}
                    </header>
                ` : ''}
                
                <section class="card-content">
                    <slot name="content"></slot>
                </section>
            </article>
        `;
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
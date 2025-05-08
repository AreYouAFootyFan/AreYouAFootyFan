class AdminModal extends HTMLElement {
    static get observedAttributes() {
        return ['title'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isVisible = false;
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
        const title = this.getAttribute('title') || 'Modal';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .modal {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                    padding: 1rem;
                }
                
                .modal.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .modal-content {
                    background-color: white;
                    border-radius: 0.5rem;
                    width: 100%;
                    max-width: 30rem;
                    overflow: hidden;
                    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.15);
                }
                
                .modal-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 0.0625rem solid var(--gray-200);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .close-modal {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--gray-500);
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                .close-modal:hover {
                    background-color: var(--gray-200);
                    color: var(--gray-800);
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                /* Form styles for the modal */
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--gray-700);
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 0.0625rem solid var(--gray-300);
                    border-radius: 0.25rem;
                    font-size: 1rem;
                    background-color: white;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 0.125rem rgba(59, 130, 246, 0.2);
                }
                
                .form-help {
                    font-size: 0.75rem;
                    color: var(--gray-500);
                    margin-top: 0.25rem;
                }
                
                .form-check {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .form-check input[type="checkbox"] {
                    width: auto;
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
            </style>
            
            <section class="modal" id="modal">
                <article class="modal-content">
                    <header class="modal-header">
                        <h2>${title}</h2>
                        <button class="close-modal" id="close-btn">&times;</button>
                    </header>
                    <section class="modal-body">
                        <slot name="content"></slot>
                    </section>
                </article>
            </section>
        `;
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
class AdminTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._columns = [];
        this._data = [];
    }
    
    connectedCallback() {
        this.render();
    }
    
    set columns(value) {
        this._columns = value;
        this.render();
    }
    
    get columns() {
        return this._columns;
    }
    
    set data(value) {
        this._data = value;
        this.render();
    }
    
    get data() {
        return this._data;
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .admin-table th,
                .admin-table td {
                    padding: 0.75rem;
                    text-align: left;
                    border-bottom: 0.0625rem solid var(--gray-200);
                }
                
                .admin-table th {
                    font-weight: 600;
                    color: var(--gray-700);
                    background-color: var(--gray-50);
                }
                
                .table-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease;
                }
                
                .action-btn:hover {
                    background-color: var(--gray-200);
                }
                
                .action-icon {
                    font-size: 1rem;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .valid-status {
                    background-color: var(--success-light);
                    color: var(--success-dark);
                }
                
                .invalid-status {
                    background-color: var(--error-light);
                    color: var(--error-dark);
                }
                
                .empty-message {
                    text-align: center;
                    padding: 2rem;
                    color: var(--gray-600);
                }
            </style>
            
            <table class="admin-table">
                <thead>
                    <tr>
                        ${this._columns.map(column => `<th>${column.title}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${this._data.length === 0 ? `
                        <tr>
                            <td colspan="${this._columns.length}" class="empty-message">No data available</td>
                        </tr>
                    ` : this._data.map(row => this.renderRow(row)).join('')}
                </tbody>
            </table>
        `;
        
        this.setupEventListeners();
    }
    
    renderRow(row) {
        return `
            <tr>
                ${this._columns.map(column => this.renderCell(row[column.key], column.key)).join('')}
            </tr>
        `;
    }
    
    renderCell(cell, columnKey) {
        if (!cell) {
            return `<td></td>`;
        }
        
        if (typeof cell === 'object') {
            switch (cell.type) {
                case 'badge':
                    return `<td><p class="status-badge ${cell.class}">${cell.value}</p></td>`;
                
                case 'actions':
                    return `<td>
                        <section class="table-actions">
                            ${cell.items.map(item => `
                                <button 
                                    class="action-btn" 
                                    title="${item.title}" 
                                    data-action="${item.action}" 
                                    data-id="${item.data.id}" 
                                    data-title="${item.data.title || ''}" 
                                    data-name="${item.data.name || ''}"
                                >
                                    <em class="action-icon">${item.icon}</em>
                                </button>
                            `).join('')}
                        </section>
                    </td>`;
                
                default:
                    return `<td>${cell.value}</td>`;
            }
        }
        
        return `<td>${cell}</td>`;
    }
    
    setupEventListeners() {
        const actionButtons = this.shadowRoot.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const data = {
                    id: button.dataset.id,
                    title: button.dataset.title,
                    name: button.dataset.name
                };
                
                this.dispatchEvent(new CustomEvent('action', {
                    detail: { action, data },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

customElements.define('admin-table', AdminTable);

export default AdminTable;
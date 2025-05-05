// dom-utils.js - Safe DOM manipulation utilities for the Football Arena SPA

/**
 * Creates an element with attributes and children
 * @param {string} tagName - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|Node|string} children - Child elements, text, or array of elements
 * @returns {HTMLElement} The created element
 */
function createElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    
    // Add attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key === 'style' && typeof value === 'object') {
            Object.entries(value).forEach(([styleKey, styleValue]) => {
                element.style[styleKey] = styleValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add children
    if (children) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                appendToElement(element, child);
            });
        } else {
            appendToElement(element, children);
        }
    }
    
    return element;
}

/**
 * Append a child to an element
 * @param {HTMLElement} element - Parent element
 * @param {Node|string} child - Child element or text
 */
function appendToElement(element, child) {
    if (child === null || child === undefined) return;
    
    if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child));
    } else {
        element.appendChild(child);
    }
}

/**
 * Clears all children from an element
 * @param {HTMLElement} element - Element to clear
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Creates an icon element using Lucide icons
 * @param {string} name - Icon name
 * @param {Object} attributes - Additional attributes for the icon
 * @returns {HTMLElement} Icon element
 */
function createIcon(name, attributes = {}) {
    const iconElement = createElement('i', {
        ...attributes,
        'data-lucide': name
    });
    
    // Schedule icon creation on next tick to ensure element is in DOM
    setTimeout(() => {
        if (window.lucide) {
            window.lucide.createIcons({
                icons: {
                    [name]: true
                },
                elements: [iconElement]
            });
        }
    }, 0);
    
    return iconElement;
}

/**
 * Creates a button element with standard attributes
 * @param {string} text - Button text
 * @param {string} type - Button type (primary, outline, etc)
 * @param {Object} attributes - Additional attributes
 * @param {function} onClick - Click handler
 * @returns {HTMLElement} Button element
 */
function createButton(text, type = 'primary', attributes = {}, onClick = null) {
    const buttonClasses = `btn btn-${type}`;
    
    return createElement('button', {
        className: attributes.className 
            ? `${buttonClasses} ${attributes.className}` 
            : buttonClasses,
        ...attributes,
        ...(onClick ? { onclick: onClick } : {})
    }, text);
}

/**
 * Parses a given template and converts it to DOM elements
 * @param {HTMLTemplateElement} template - Template to parse
 * @returns {DocumentFragment} Document fragment with parsed content
 */
function parseTemplate(template) {
    if (template instanceof HTMLTemplateElement) {
        return document.importNode(template.content, true);
    }
    
    if (template instanceof DocumentFragment) {
        return document.importNode(template, true);
    }
    
    throw new Error('Invalid template format');
}

// Export utilities
window.domUtils = {
    createElement,
    clearElement,
    createIcon,
    createButton,
    parseTemplate
};
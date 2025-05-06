window.modules = window.modules || {};

/**
 * Make an API request
 * @param {string} url - The URL to request
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} The response data
 */
export async function apiRequest(url, options = {}) {
  try {
    const auth = window.modules.auth;
    
    if (auth && auth.isAuthenticated()) {
      if (!options.headers) {
        options.headers = auth.getAuthHeaders();
      } else {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${auth.getToken()}`
        };
      }
    } else if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json'
      };
    }
    
    const response = await fetch(url, options);
    
    if (response.status === 401 && auth) {
      auth.logout();
      throw new Error('Your session has expired. Please login again.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Show an element and hide others
 * @param {HTMLElement} elementToShow - Element to show
 * @param {HTMLElement[]} elementsToHide - Elements to hide
 */
export function showElement(elementToShow, elementsToHide = []) {
  elementToShow.style.display = 'block';
  
  elementsToHide.forEach(element => {
    if (element) {
      element.style.display = 'none';
    }
  });
}

/**
 * Create a DOM element from HTML string
 * @param {string} html - HTML string
 * @returns {DocumentFragment} DOM fragment
 */
export function createElementFromHTML(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
}
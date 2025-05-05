import { apiRequest, createElementFromHTML } from './utils.js';

window.modules = window.modules || {};

let elements = {};
let publicMethods = {};

/**
 * Initialize the category management module
 */
export function initCategoryManagement() {
  elements = {
    getCategoriesButton: document.getElementById('get-categories'),
    categoriesResult: document.getElementById('categories-result'),
    categoryForm: document.getElementById('category-form'),
    categoryNameInput: document.getElementById('category-name'),
    categoryDescriptionInput: document.getElementById('category-description'),
    quizCategorySelect: document.getElementById('quiz-category')
  };

  elements.getCategoriesButton.addEventListener('click', fetchCategories);
  elements.categoryForm.addEventListener('submit', handleCategorySubmit);
  
  publicMethods = {
    fetchCategories,
    populateCategoryDropdown
  };
  
  window.modules.categories = publicMethods;
  
  return publicMethods;
}

/**
 * Fetch and display all categories
 */
async function fetchCategories() {
  try {
    elements.categoriesResult.innerHTML = 'Loading...';
    
    const data = await apiRequest('/api/categories');
    
    if (Array.isArray(data)) {
      if (data.length === 0) {
        elements.categoriesResult.innerHTML = '<p>No categories found.</p>';
      } else {
        const categoriesList = data.map(category => 
          `<li data-id="${category.category_id}">
            <strong>${category.category_name}</strong>: 
            ${category.category_description || 'No description'}
            <button class="delete-category" data-id="${category.category_id}">Delete</button>
          </li>`
        ).join('');
        
        elements.categoriesResult.innerHTML = `<ul>${categoriesList}</ul>`;
        
        Array.from(document.getElementsByClassName('delete-category')).forEach(button => {
          button.addEventListener('click', handleDeleteCategory);
        });
        
        populateCategoryDropdown(data);
      }
    } else {
      elements.categoriesResult.innerHTML = `<p>Error: Unexpected response format</p>`;
    }
  } catch (error) {
    elements.categoriesResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

/**
 * Populate the category dropdown in the quiz form
 */
function populateCategoryDropdown(categories) {
  if (!elements.quizCategorySelect) return;
  
  while (elements.quizCategorySelect.options.length > 1) {
    elements.quizCategorySelect.remove(1);
  }
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.category_id;
    option.textContent = category.category_name;
    elements.quizCategorySelect.appendChild(option);
  });
}

/**
 * Handle form submission to create a new category
 */
async function handleCategorySubmit(event) {
  event.preventDefault();
  
  const name = elements.categoryNameInput.value.trim();
  const description = elements.categoryDescriptionInput.value.trim();
  
  if (!name) {
    alert('Category name is required!');
    return;
  }
  
  try {
    await apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        category_name: name,
        category_description: description || undefined
      })
    });
    
    alert('Category created successfully!');
    elements.categoryNameInput.value = '';
    elements.categoryDescriptionInput.value = '';
    fetchCategories();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

/**
 * Handle delete button click for category
 */
async function handleDeleteCategory(event) {
  const categoryId = event.target.getAttribute('data-id');
  
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await apiRequest(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      alert('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}
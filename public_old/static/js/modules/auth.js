window.modules = window.modules || {};

let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

export const auth = {
  isAuthenticated: () => !!authToken,
  getToken: () => authToken,
  getCurrentUser: () => currentUser,
  hasUsername: () => currentUser && !!currentUser.username,
  isQuizMaster: () => currentUser && currentUser.role_id === 2,
  
  getAuthHeaders: () => {
    return {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };
  },
  
  handleLogin: (token) => {
    return fetch('/api/auth/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Login failed');
      }
      return res.json();
    })
    .then(data => {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(currentUser));
      return {
        requiresUsername: data.requiresUsername,
        user: data.user
      };
    });
  },
  
  setUsername: (username) => {
    return fetch('/api/users/username', {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ username })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to set username');
      }
      return res.json();
    })
    .then(user => {
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      return user;
    });
  },
  
  logout: () => {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.reload();
  },
  
  refreshUserData: () => {
    if (!authToken) return Promise.reject('Not authenticated');
    
    return fetch('/api/users/me', {
      headers: auth.getAuthHeaders()
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          auth.logout();
          return Promise.reject('Session expired');
        }
        throw new Error('Failed to get user data');
      }
      return res.json();
    })
    .then(user => {
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      return user;
    });
  }
};

export function initAuth() {
  if (authToken) {
    auth.refreshUserData()
      .then(() => {
        if (!auth.hasUsername()) {
          showUsernameForm();
        } else {
          initializeApp();
        }
      })
      .catch(() => {
        showLoginForm();
      });
  } else {
    showLoginForm();
  }
  
  document.getElementById('username-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    
    auth.setUsername(username)
      .then(() => {
        initializeApp();
      })
      .catch(error => {
        alert(`Error setting username: ${error.message || 'Username might already be taken'}`);
      });
  });
  
  document.getElementById('logout-btn')?.addEventListener('click', function() {
    auth.logout();
  });
}

window.handleCredentialResponse = (response) => {
  auth.handleLogin(response.credential)
    .then(data => {
      if (data.requiresUsername) {
        showUsernameForm();
      } else {
        initializeApp();
      }
    })
    .catch(error => {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    });
};

function showLoginForm() {
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('username-container').style.display = 'none';
  document.getElementById('app').style.display = 'none';
}

function showUsernameForm() {
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('username-container').style.display = 'block';
  document.getElementById('app').style.display = 'none';
}

function initializeApp() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  if (currentUser) {
    const userDisplay = document.createElement('div');
    userDisplay.className = 'header';
    userDisplay.innerHTML = `
      <div class="user-info">
        <span id="user-display">${currentUser.username || 'Unnamed User'}</span>
        <span id="user-role">(${currentUser.role_name || (currentUser.role_id === 2 ? 'Quiz Master' : 'Quiz Taker')})</span>
      </div>
      <button id="logout-btn">Logout</button>
    `;
    
    const appDiv = document.getElementById('app');
    appDiv.insertBefore(userDisplay, appDiv.firstChild);
    
    document.getElementById('logout-btn').addEventListener('click', function() {
      auth.logout();
    });
  }

  if (window.modules && window.modules.categories) {
    window.modules.categories.fetchCategories();
  }
  if (window.modules && window.modules.difficulties) {
    window.modules.difficulties.fetchDifficultyLevels();
  }
  if (window.modules && window.modules.quizzes) {
    window.modules.quizzes.fetchQuizzes();
  }
  if (window.modules && window.modules.quizTaking) {
    window.modules.quizTaking.loadAvailableQuizzes();
  }
}

window.modules.auth = auth;
document.addEventListener('DOMContentLoaded', initAuth);
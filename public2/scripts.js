// App State
const appState = {
  currentUser: null,
  isLoggedIn: false,
  currentPage: "home",
  currentAdminPage: "dashboard",
  quizzes: [
    {
      id: 1,
      title: "World Cup History",
      category: "world-cup",
      description: "Test your knowledge about World Cup history with these beginner-friendly questions.",
      questions: 10,
      timeEstimate: "5 min",
    },
    {
      id: 2,
      title: "Premier League Legends",
      category: "premier-league",
      description: "How well do you know the greatest players in Premier League history?",
      questions: 15,
      timeEstimate: "10 min",
    },
    {
      id: 3,
      title: "Champions League Trivia",
      category: "champions-league",
      description: "Only true football experts will ace this challenging Champions League quiz.",
      questions: 20,
      timeEstimate: "15 min",
    },
    {
      id: 4,
      title: "Football Stars",
      category: "players",
      description: "Test your knowledge about the biggest football stars of all time.",
      questions: 15,
      timeEstimate: "8 min",
    },
    {
      id: 5,
      title: "Premier League Basics",
      category: "premier-league",
      description: "New to football? Start with these basic Premier League questions.",
      questions: 10,
      timeEstimate: "5 min",
    },
    {
      id: 6,
      title: "World Cup Deep Dive",
      category: "world-cup",
      description: "Only the most dedicated football historians will know these World Cup facts.",
      questions: 20,
      timeEstimate: "15 min",
    },
  ],
  categories: [
    { id: "world-cup", name: "World Cup" },
    { id: "premier-league", name: "Premier League" },
    { id: "champions-league", name: "Champions League" },
    { id: "players", name: "Players" },
    { id: "teams", name: "Teams" },
    { id: "history", name: "History" },
    { id: "tactics", name: "Tactics" },
    { id: "referees", name: "Referees" },
    { id: "stadiums", name: "Stadiums" },
  ],
  leaderboardData: [
    {
      rank: 1,
      name: "FootballMaster",
      elo: 1845,
      quizzes: 42,
      accuracy: 94
    },
    {
      rank: 2,
      name: "SoccerQueen",
      elo: 1788,
      quizzes: 38,
      accuracy: 91
    },
    {
      rank: 3,
      name: "GoalMachine",
      elo: 1756,
      quizzes: 45,
      accuracy: 89
    },
    {
      rank: 4,
      name: "FootballFan22",
      elo: 1702,
      quizzes: 36,
      accuracy: 87
    },
    {
      rank: 5,
      name: "KickingKing",
      elo: 1689,
      quizzes: 31,
      accuracy: 85
    }
  ],
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  quizTimer: null,
  questionTimer: null,
  timeLeft: 30,
  score: 0,
  streak: 0,
}

// DOM Elements
const elements = {
  appContainer: document.getElementById("app-container"),
  navLinks: document.querySelectorAll(".nav-link"),
  loginButton: document.getElementById("login-button"),
  userDropdown: document.getElementById("user-dropdown"),
  usernameDisplay: document.getElementById("username-display"),
  logoutButton: document.getElementById("logout-button"),
  loginModal: document.getElementById("login-modal"),
  closeModalButtons: document.querySelectorAll(".close-modal"),
  tabs: document.querySelectorAll(".tab"),
  loginForm: document.getElementById("login-form"),
  signupForm: document.getElementById("signup-form"),
  resultModal: document.getElementById("result-modal"),
  nextQuestionButton: document.getElementById("next-question"),
  quizCompleteModal: document.getElementById("quiz-complete-modal"),
}

// Templates
const templates = {
  home: document.getElementById("home-template"),
  quiz: document.getElementById("quiz-template"),
  profile: document.getElementById("profile-template"),
  admin: document.getElementById("admin-template"),
  adminCreateQuiz: document.getElementById("admin-create-quiz-template"),
}

// Initialize the app
function init() {
  // Load user data from localStorage if available
  loadUserData()

  // Set up event listeners
  setupEventListeners()

  // Handle initial route
  handleRoute()

  // Update UI based on login state
  updateUIForLoginState()

  renderLeaderboard()

  renderQuizCards();

  populateCategoryFilter();
}

function populateCategoryFilter() {
  const categoryFilter = document.getElementById('category-filter');
  
  // Clear any existing options
  while (categoryFilter.firstChild) {
    categoryFilter.removeChild(categoryFilter.firstChild);
  }
  
  // Add the "All Categories" option first
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.appendChild(allOption);
  
  // Add each category from the categories array
  appState.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });
}
function createQuizCard(quiz) {
  // Create the main card element
  const quizCard = document.createElement('article');
  quizCard.className = 'quiz-card';
  quizCard.setAttribute('data-category', quiz.category);
  
  // Create card header
  const cardHeader = document.createElement('div');
  cardHeader.className = 'quiz-card-header';
  
  const categorySpan = document.createElement('span');
  categorySpan.className = 'category';
  categorySpan.textContent = quiz.categoryDisplay;
  
  cardHeader.appendChild(categorySpan);
  
  // Create card body
  const cardBody = document.createElement('div');
  cardBody.className = 'quiz-card-body';
  
  const title = document.createElement('h3');
  title.textContent = quiz.title;
  
  const description = document.createElement('p');
  description.textContent = quiz.description;
  
  const quizMeta = document.createElement('div');
  quizMeta.className = 'quiz-meta';
  
  const questionCount = document.createElement('span');
  questionCount.textContent = `${quiz.questions} questions`;
  
  const duration = document.createElement('span');
  duration.textContent = quiz.timeEstimate;
  
  quizMeta.appendChild(questionCount);
  quizMeta.appendChild(duration);
  
  cardBody.appendChild(title);
  cardBody.appendChild(description);
  cardBody.appendChild(quizMeta);
  
  // Create card footer
  const cardFooter = document.createElement('div');
  cardFooter.className = 'quiz-card-footer';
  
  const startButton = document.createElement('a');
  startButton.className = 'btn btn-primary';
  startButton.href = `#/quiz/${quiz.id}`;
  startButton.setAttribute('data-quiz-id', quiz.id);
  startButton.textContent = 'Start Quiz';
  
  cardFooter.appendChild(startButton);
  
  // Assemble the card
  quizCard.appendChild(cardHeader);
  quizCard.appendChild(cardBody);
  quizCard.appendChild(cardFooter);
  
  return quizCard;
}

// Function to render all quiz cards
function renderQuizCards() {
  const quizGrid = document.getElementById('quiz-grid');
  
  // Clear existing content
  while (quizGrid.firstChild) {
    quizGrid.removeChild(quizGrid.firstChild);
  }
  
  // Get the selected category
  const categoryFilter = document.getElementById('category-filter');
  const selectedCategory = categoryFilter.value;
  console.log(selectedCategory)
  
  // Filter and display quizzes
  appState.quizzes.forEach(quiz => {
    console.log(quiz.category)

    if (selectedCategory === '' || quiz.category === selectedCategory) {
      quizGrid.appendChild(createQuizCard(quiz));
    }
  });
}


function renderLeaderboard() {
  const tableBody = document.getElementById('leaderboard-body');
  
  // Clear any existing content
  tableBody.innerHTML = '';
  
  // Populate table with data from the JSON array
  appState.leaderboardData.forEach(player => {
    const row = document.createElement('tr');
    
    // Create rank cell
    const rankCell = document.createElement('td');
    const rankSpan = document.createElement('span');
    rankSpan.className = `rank ${player.rank <= 3 ? 'rank-' + player.rank : ''}`;
    rankSpan.textContent = player.rank;
    rankCell.appendChild(rankSpan);
    
    // Create player name cell
    const nameCell = document.createElement('td');
    const playerInfo = document.createElement('div');
    playerInfo.className = 'player-info';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = player.name;
    playerInfo.appendChild(nameSpan);
    nameCell.appendChild(playerInfo);
    
    // Create ELO cell
    const eloCell = document.createElement('td');
    eloCell.textContent = player.elo;
    
    // Create quizzes cell
    const quizzesCell = document.createElement('td');
    quizzesCell.textContent = player.quizzes;
    
    // Create accuracy cell
    const accuracyCell = document.createElement('td');
    accuracyCell.textContent = player.accuracy + '%';
    
    // Append all cells to the row
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(eloCell);
    row.appendChild(quizzesCell);
    row.appendChild(accuracyCell);
    
    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Load user data from localStorage
function loadUserData() {
  const userData = localStorage.getItem("footballQuizUser")
  if (userData) {
    appState.currentUser = JSON.parse(userData)
    appState.isLoggedIn = true
  }
}

// Save user data to localStorage
function saveUserData() {
  if (appState.currentUser) {
    localStorage.setItem("footballQuizUser", JSON.stringify(appState.currentUser))
  } else {
    localStorage.removeItem("footballQuizUser")
  }
}

// Set up event listeners
function setupEventListeners() {
  // Navigation links
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = link.dataset.page
      navigateTo(page)
    })
  })

  // Login button
  elements.loginButton.addEventListener("click", () => {
    elements.loginModal.classList.remove("hidden")
  })

  // Close modal buttons
  elements.closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.add("hidden")
      })
    })
  })

  // Tab switching
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab

      // Update active tab
      elements.tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Show corresponding tab content
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.add("hidden")
      })
      document.getElementById(`${tabName}-tab`).classList.remove("hidden")
    })
  })

  // Login form submission
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("login-username").value
    const password = document.getElementById("login-password").value

    // Mock login - in a real app, this would validate against a server
    login(username, password)
  })

  // Signup form submission
  elements.signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("signup-username").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value

    // Mock signup - in a real app, this would send data to a server
    signup(username, email, password)
  })

  // Logout button
  elements.logoutButton.addEventListener("click", logout)

  
  // Next question button
  elements.nextQuestionButton.addEventListener("click", () => {
    elements.resultModal.classList.add("hidden")
    loadNextQuestion()
  })

  // Handle hash changes for routing
  window.addEventListener("hashchange", handleRoute)
}

// Handle routing based on URL hash
function handleRoute() {
  const hash = window.location.hash || "#/"
  const route = hash.substring(1) // Remove the # character

  // Parse the route
  const parts = route.split("/").filter((part) => part !== "")
  const mainRoute = parts[0] || "home"

  // Handle different main routes
  switch (mainRoute) {
    case "quiz":
      if (parts.length > 1) {
        const quizId = Number.parseInt(parts[1])
        loadQuiz(quizId)
      }
      break
    case "admin":
      if (!appState.isLoggedIn) {
        navigateTo("home")
        elements.loginModal.classList.remove("hidden")
        return
      }

      const adminPage = parts.length > 1 ? parts[1] : "dashboard"
      loadAdminPage(adminPage)
      break
    default:
      loadPage(mainRoute)
      break
  }
}

// Navigate to a specific page
function navigateTo(page) {
  window.location.hash = `#/${page}`
}

// Load a specific page
function loadPage(page) {
  // Update current page in state
  appState.currentPage = page

  // Update active nav link
  elements.navLinks.forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  // Clear app container
  elements.appContainer.innerHTML = ""

  // Load appropriate template
  switch (page) {
    case "home":
      elements.appContainer.appendChild(templates.home.content.cloneNode(true))
      setupHomePageEvents()
      break
    case "profile":
      if (!appState.isLoggedIn) {
        navigateTo("home")
        elements.loginModal.classList.remove("hidden")
        return
      }
      elements.appContainer.appendChild(templates.profile.content.cloneNode(true))
      setupProfilePageEvents()
      updateProfileUI()
      break
    case "admin":
      if (!appState.isLoggedIn) {
        navigateTo("home")
        elements.loginModal.classList.remove("hidden")
        return
      }
      elements.appContainer.appendChild(templates.admin.content.cloneNode(true))
      setupAdminPageEvents()
      break
    default:
      // 404 page or redirect to home
      navigateTo("home")
      break
  }
}

// Load a specific quiz
function loadQuiz(quizId) {
  // Find the quiz by ID
  const quiz = appState.quizzes.find((q) => q.id === quizId)

  if (!quiz) {
    navigateTo("home")
    return
  }

  // Set current quiz in state
  appState.currentQuiz = quiz
  appState.currentQuestion = 0
  appState.userAnswers = []
  appState.score = 0
  appState.streak = 0

  // Update current page in state
  appState.currentPage = "quiz"

  // Clear app container
  elements.appContainer.innerHTML = ""

  // Load quiz template
  elements.appContainer.appendChild(templates.quiz.content.cloneNode(true))

  // Update quiz UI
  updateQuizUI()

  // Setup quiz events
  setupQuizEvents()

  // Start quiz timer
  startQuizTimer()
}

// Load a specific admin page
function loadAdminPage(adminPage) {
  // Update current admin page in state
  appState.currentAdminPage = adminPage

  // Clear app container
  elements.appContainer.innerHTML = ""

  // Load appropriate admin template
  switch (adminPage) {
    case "create-quiz":
      elements.appContainer.appendChild(templates.adminCreateQuiz.content.cloneNode(true))
      setupAdminCreateQuizEvents()
      break
    default:
      elements.appContainer.appendChild(templates.admin.content.cloneNode(true))
      setupAdminPageEvents()
      break
  }

  // Update active admin nav link
  const adminNavLinks = document.querySelectorAll(".admin-nav-link")
  adminNavLinks.forEach((link) => {
    if (link.dataset.adminPage === adminPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// Setup events for the home page
function setupHomePageEvents() {
  // Filter functionality
  const categoryFilter = document.getElementById("category-filter")

  if (categoryFilter) {
    const filterQuizzes = () => {
      const category = categoryFilter.value

      const quizCards = document.querySelectorAll(".quiz-card")
      quizCards.forEach((card) => {
        const cardCategory = card.dataset.category

        const categoryMatch = category === "all" || cardCategory === category

        if (categoryMatch) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    }

    categoryFilter.addEventListener("change", filterQuizzes)
  }

  // Quiz start buttons
  const quizButtons = document.querySelectorAll("[data-quiz-id]")
  quizButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const quizId = Number.parseInt(button.dataset.quizId)
      navigateTo(`quiz/${quizId}`)
    })
  })
}

// Setup events for the profile page
function setupProfilePageEvents() {
  // Profile form submission
  const profileForm = document.getElementById("profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (appState.currentUser) {
        appState.currentUser.username = document.getElementById("edit-username").value
        appState.currentUser.email = document.getElementById("edit-email").value

        const newPassword = document.getElementById("edit-password").value
        if (newPassword) {
          appState.currentUser.password = newPassword
        }

        appState.currentUser.bio = document.getElementById("edit-bio").value

        saveUserData()
        updateUIForLoginState()

        // Show success message
        alert("Profile updated successfully!")
      }
    })
  }
}

// Setup events for the admin page
function setupAdminPageEvents() {
  // Admin navigation links
  const adminNavLinks = document.querySelectorAll(".admin-nav-link")
  adminNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const adminPage = link.dataset.adminPage
      window.location.hash = `#/admin/${adminPage}`
    })
  })
}

// Setup events for the admin create quiz page
function setupAdminCreateQuizEvents() {
  // Add question button
  const addQuestionBtn = document.getElementById("add-question")
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", () => {
      const questionsContainer = document.getElementById("questions-container")
      const questionCount = questionsContainer.children.length + 1

      const questionCard = document.createElement("div")
      questionCard.className = "question-card"
      questionCard.dataset.questionId = questionCount

      questionCard.innerHTML = `
        <div class="question-header">
          <h3>Question ${questionCount}</h3>
          <button type="button" class="btn btn-icon remove-question" title="Remove Question">🗑️</button>
        </div>
        <div class="form-group">
          <label for="question-${questionCount}-text">Question Text</label>
          <textarea id="question-${questionCount}-text" class="question-text" rows="2" required placeholder="Enter your question"></textarea>
        </div>
        <div class="options-container">
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-0" value="0" checked>
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-0">Option A</label>
              <input type="text" id="option-${questionCount}-0" class="option-text" required placeholder="Option text">
            </div>
          </div>
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-1" value="1">
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-1">Option B</label>
              <input type="text" id="option-${questionCount}-1" class="option-text" required placeholder="Option text">
            </div>
          </div>
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-2" value="2">
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-2">Option C</label>
              <input type="text" id="option-${questionCount}-2" class="option-text" required placeholder="Option text">
            </div>
          </div>
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-3" value="3">
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-3">Option D</label>
              <input type="text" id="option-${questionCount}-3" class="option-text" required placeholder="Option text">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="explanation-${questionCount}">Explanation (Optional)</label>
          <textarea id="explanation-${questionCount}" class="explanation-text" rows="2" placeholder="Explain the correct answer"></textarea>
        </div>
      `

      questionsContainer.appendChild(questionCard)

      // Add event listener to the remove question button
      const removeBtn = questionCard.querySelector(".remove-question")
      removeBtn.addEventListener("click", () => {
        questionCard.remove()
        // Renumber the questions
        const questionCards = questionsContainer.querySelectorAll(".question-card")
        questionCards.forEach((card, index) => {
          const questionNum = index + 1
          card.dataset.questionId = questionNum
          card.querySelector("h3").textContent = `Question ${questionNum}`
        })
      })
    })
  }

  // Create quiz form submission
  const createQuizForm = document.getElementById("create-quiz-form")
  if (createQuizForm) {
    createQuizForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // In a real app, this would send the quiz data to a server
      alert("Quiz created successfully!")
      navigateTo("admin")
    })
  }
}

// Setup events for the quiz page
function setupQuizEvents() {
  // Option buttons
  const optionButtons = document.querySelectorAll(".option-btn")
  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (appState.questionTimer) {
        clearInterval(appState.questionTimer)
      }

      const selectedIndex = Number.parseInt(button.dataset.index)

      // In a real app, this would check against the correct answer from the server
      const isCorrect = selectedIndex === 1 // Mock correct answer (B)

      // Update score and streak
      if (isCorrect) {
        appState.score += 100 + appState.timeLeft * 5
        appState.elo += appState.score
        appState.streak++
      } else {
        appState.streak = 0
      }

      // Store user answer
      appState.userAnswers.push({
        questionIndex: appState.currentQuestion,
        selectedIndex,
        isCorrect,
      })

      // Show result modal
      const resultIcon = document.getElementById("result-icon")
      const resultMessage = document.getElementById("result-message")
      const eloChange = document.getElementById("elo-change")

      if (isCorrect) {
        resultIcon.textContent = "✓"
        resultIcon.className = "result-icon correct"
        resultMessage.textContent = "Correct!"
        eloChange.textContent = "+24 ELO"
      } else {
        resultIcon.textContent = "✗"
        resultIcon.className = "result-icon incorrect"
        resultMessage.textContent = "Incorrect!"
        eloChange.textContent = "-10 ELO"
      }

      elements.resultModal.classList.remove("hidden")
    })
  })
}

// Start the quiz timer
function startQuizTimer() {
  // Reset time left
  appState.timeLeft = 30

  // Update timer display
  const timerDisplay = document.getElementById("timer-display")
  const timerBar = document.getElementById("timer-bar")

  if (timerDisplay && timerBar) {
    timerDisplay.textContent = formatTime(appState.timeLeft)
    timerBar.style.width = "100%"

    // Start countdown
    appState.questionTimer = setInterval(() => {
      appState.timeLeft--

      // Update timer display
      timerDisplay.textContent = formatTime(appState.timeLeft)

      // Update timer bar
      const percentage = (appState.timeLeft / 30) * 100
      timerBar.style.width = `${percentage}%`

      // Change color based on time left
      if (appState.timeLeft <= 5) {
        timerBar.style.backgroundColor = "var(--error)"
      } else if (appState.timeLeft <= 10) {
        timerBar.style.backgroundColor = "var(--warning)"
      }

      // Time's up
      if (appState.timeLeft <= 0) {
        clearInterval(appState.questionTimer)
        handleTimeUp()
      }
    }, 1000)
  }
}

// Handle time up
function handleTimeUp() {
  // In a real app, this would handle the time up scenario
  // For now, just show the result modal with incorrect answer
  const resultIcon = document.getElementById("result-icon")
  const resultMessage = document.getElementById("result-message")
  const eloChange = document.getElementById("elo-change")

  resultIcon.textContent = "⏱️"
  resultIcon.className = "result-icon incorrect"
  resultMessage.textContent = "Time's Up!"
  eloChange.textContent = "-5 ELO"

  elements.resultModal.classList.remove("hidden")

  // Reset streak
  appState.streak = 0

  // Store user answer as timeout
  appState.userAnswers.push({
    questionIndex: appState.currentQuestion,
    selectedIndex: -1,
    isCorrect: false,
    timedOut: true,
  })
}

// Load the next question
function loadNextQuestion() {
  appState.currentQuestion++

  // Check if quiz is complete
  if (appState.currentQuestion >= 15) {
    // Mock quiz length
    showQuizComplete()
    return
  }

  // Update question number
  const currentQuestionEl = document.getElementById("current-question")
  if (currentQuestionEl) {
    currentQuestionEl.textContent = appState.currentQuestion + 1
  }

  // Update progress bar
  const progressBar = document.querySelector(".progress")
  if (progressBar) {
    const percentage = ((appState.currentQuestion + 1) / 15) * 100
    progressBar.style.width = `${percentage}%`
  }

  // In a real app, this would load the next question from the quiz data
  // For now, just reset the timer
  startQuizTimer()

  // Update streak display
  const currentStreak = document.getElementById("current-streak")
  if (currentStreak) {
    currentStreak.textContent = appState.streak > 0 ? `${appState.streak} 🔥` : "0"
  }

  // Update score display
  const currentScore = document.getElementById("current-score")
  if (currentScore) {
    currentScore.textContent = appState.score
    eloCell.textContent = appState.elo + currentScore.textContent
  }
}

// Show quiz complete modal
function showQuizComplete() {
  // Calculate stats
  const totalQuestions = 15 // Mock quiz length
  const correctAnswers = appState.userAnswers.filter((answer) => answer.isCorrect).length
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  // Update quiz complete modal
  const scoreValue = document.querySelector(".quiz-complete-modal .score-value")
  if (scoreValue) {
    scoreValue.textContent = appState.score
  }

  const statValues = document.querySelectorAll(".quiz-complete-modal .stat-value")
  if (statValues.length >= 4) {
    statValues[0].textContent = `${correctAnswers}/${totalQuestions}`
    statValues[1].textContent = `${accuracy}%`
    statValues[2].textContent = "8:24" // Mock time
    statValues[3].textContent = "+45" // Mock ELO gain
  }

  // Show the modal
  elements.quizCompleteModal.classList.remove("hidden")

  // In a real app, this would save the quiz results to the user's profile
}

// Update the quiz UI
function updateQuizUI() {
  if (!appState.currentQuiz) return

  // Update quiz title and meta
  const quizTitle = document.getElementById("quiz-title")
  const questionsCount = document.querySelector(".quiz-meta .questions-count")
  const timeEstimate = document.querySelector(".quiz-meta .time-estimate")

  if (quizTitle) quizTitle.textContent = appState.currentQuiz.title
 
  if (questionsCount) questionsCount.textContent = `${appState.currentQuiz.questions} Questions`
  if (timeEstimate) timeEstimate.textContent = appState.currentQuiz.timeEstimate

  // Update question number and total
  const currentQuestionEl = document.getElementById("current-question")
  const totalQuestionsEl = document.getElementById("total-questions")

  if (currentQuestionEl) currentQuestionEl.textContent = appState.currentQuestion + 1
  if (totalQuestionsEl) totalQuestionsEl.textContent = appState.currentQuiz.questions

  // Update progress bar
  const progressBar = document.querySelector(".progress")
  if (progressBar) {
    const percentage = ((appState.currentQuestion + 1) / appState.currentQuiz.questions) * 100
    progressBar.style.width = `${percentage}%`
  }
}

// Update the profile UI
function updateProfileUI() {
  if (!appState.currentUser) return

  // Update profile info
  const profileUsername = document.getElementById("profile-username")
  const editUsername = document.getElementById("edit-username")
  const editEmail = document.getElementById("edit-email")
  const editBio = document.getElementById("edit-bio")

  if (profileUsername) profileUsername.textContent = appState.currentUser.username
  if (editUsername) editUsername.value = appState.currentUser.username
  if (editEmail) editEmail.value = appState.currentUser.email || ""
  if (editBio) editBio.value = appState.currentUser.bio || ""
}

// Update UI based on login state
function updateUIForLoginState() {
  if (appState.isLoggedIn) {
    elements.loginButton.classList.add("hidden")
    elements.userDropdown.classList.remove("hidden")
    elements.usernameDisplay.textContent = appState.currentUser.username

   
  } else {
    elements.loginButton.classList.remove("hidden")
    elements.userDropdown.classList.add("hidden")
  }
}

// Mock login function
function login(username, password) {
  // In a real app, this would validate against a server
  appState.currentUser = {
    username,
    password,
    elo: 1000,
    quizzesTaken: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  }

  appState.isLoggedIn = true
  saveUserData()
  updateUIForLoginState()
  elements.loginModal.classList.add("hidden")
}

// Mock signup function
function signup(username, email, password) {
  // In a real app, this would send data to a server
  appState.currentUser = {
    username,
    email,
    password,
    elo: 0,
    quizzesTaken: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  }

  appState.isLoggedIn = true
  saveUserData()
  updateUIForLoginState()
  elements.loginModal.classList.add("hidden")
}

// Logout function
function logout() {
  appState.currentUser = null
  appState.isLoggedIn = false
  saveUserData()
  updateUIForLoginState()
  navigateTo("home")
}

// Format time (seconds) to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", init)

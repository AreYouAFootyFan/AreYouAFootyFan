// profile.js - Profile page functionality

// Initialize function in global scope so it can be called by the router
window.initializeProfile = function() {
    console.log('Initializing profile module');
    
    // Load user profile data
    loadUserProfile();
    
    // Set up tab switching functionality
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');
    const badgesTabTrigger = document.querySelector('.badges-tab-trigger');
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Update active tab trigger
        tabTriggers.forEach(trigger => {
            if (trigger.dataset.tab === tabId) {
                trigger.classList.add('active');
            } else {
                trigger.classList.remove('active');
            }
        });
        
        // Update visible tab content
        tabContents.forEach(content => {
            if (content.id === tabId + '-tab') {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // Add click event listeners to tab triggers
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Add click event listener to the sidebar badges link
    if (badgesTabTrigger) {
        badgesTabTrigger.addEventListener('click', function() {
            switchTab('badges');
        });
    }
    
    // Add hover effects to interactive elements
    function addHoverEffects() {
        const interactiveItems = document.querySelectorAll('.game-item, .badge-item');
        interactiveItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Function to load user profile data
    function loadUserProfile() {
        fetch('data/profile.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(profileData => {
                // Update user information in sidebar
                updateUserSidebar(profileData);
                
                // Update overview tab content
                updateOverviewTab(profileData);
                
                // Update badges tab content
                updateBadgesTab(profileData);
                
                // Add hover effects after DOM updates
                addHoverEffects();
                
                // Update app state with user data if available
                if (window.appState) {
                    window.appState.setUser(profileData);
                }
                
                // Reinitialize Lucide icons after content update
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            })
            .catch(error => {
                console.error('Error loading profile data:', error);
                // Fallback to show error message
                const profileContent = document.querySelector('.profile-content');
                if (profileContent) {
                    window.domUtils.clearElement(profileContent);
                    
                    const errorMessage = window.domUtils.createElement('div', 
                        { className: 'error-message' },
                        window.domUtils.createElement('p', {}, 
                            'Unable to load profile data. Please try again later.'
                        )
                    );
                    
                    profileContent.appendChild(errorMessage);
                }
            });
    }
    
    // Update user sidebar with profile data
    function updateUserSidebar(data) {
        // Update username and title
        const usernameElem = document.querySelector('.username');
        const userTitleElem = document.querySelector('.user-title');
        
        if (usernameElem) usernameElem.textContent = data.username;
        if (userTitleElem) userTitleElem.textContent = data.title;
        
        // Update level progress
        const levelInfoSpans = document.querySelectorAll('.level-info span');
        if (levelInfoSpans && levelInfoSpans.length >= 2) {
            levelInfoSpans[0].textContent = `Level ${data.level}`;
            levelInfoSpans[1].textContent = `${data.xp}/${data.maxXp} XP`;
        }
        
        // Calculate progress percentage
        const progressPercent = (data.xp / data.maxXp) * 100;
        const progressBar = document.querySelector('.profile-sidebar .progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
        
        // Update stats
        const statValues = document.querySelectorAll('.stats-grid .stat-value');
        if (statValues && statValues.length >= 2) {
            statValues[0].textContent = data.stats.gamesPlayed;
            statValues[1].textContent = `${data.stats.winRate}%`;
        }
    }
    
    // Update overview tab content
    function updateOverviewTab(data) {
        // Update next badge info
        const nextBadge = data.nextBadge;
        const nextBadgeElement = document.querySelector('.next-badge');
        if (nextBadgeElement) {
            window.domUtils.clearElement(nextBadgeElement);
            
            // Create badge icon
            const badgeIcon = window.domUtils.createElement('div', { className: 'badge-icon' });
            badgeIcon.appendChild(window.domUtils.createIcon(nextBadge.icon));
            nextBadgeElement.appendChild(badgeIcon);
            
            // Create badge info container
            const badgeInfo = window.domUtils.createElement('div', { className: 'badge-info' });
            
            // Badge title and description
            badgeInfo.appendChild(window.domUtils.createElement('h3', {}, nextBadge.name));
            badgeInfo.appendChild(window.domUtils.createElement('p', {}, nextBadge.description));
            
            // Badge progress section
            const badgeProgress = window.domUtils.createElement('div', { className: 'badge-progress' });
            
            // Progress metadata
            const progressMeta = window.domUtils.createElement('div', { className: 'progress-meta' });
            progressMeta.appendChild(window.domUtils.createElement('span', {}, `${nextBadge.currentPoints} points`));
            progressMeta.appendChild(window.domUtils.createElement('span', {}, `${nextBadge.requiredPoints} points needed`));
            badgeProgress.appendChild(progressMeta);
            
            // Progress bar
            const progressContainer = window.domUtils.createElement('div', { className: 'progress-container' });
            const progressBarWidth = (nextBadge.currentPoints / nextBadge.requiredPoints) * 100;
            progressContainer.appendChild(window.domUtils.createElement('div', { 
                className: 'progress-bar',
                style: { width: `${progressBarWidth}%` }
            }));
            badgeProgress.appendChild(progressContainer);
            
            // Progress text
            const pointsNeeded = nextBadge.requiredPoints - nextBadge.currentPoints;
            badgeProgress.appendChild(window.domUtils.createElement('div', 
                { className: 'progress-text' }, 
                `${pointsNeeded} more points needed to unlock`
            ));
            
            // Add progress to badge info
            badgeInfo.appendChild(badgeProgress);
            nextBadgeElement.appendChild(badgeInfo);
        }
        
        // Update recent games
        const recentGamesElement = document.querySelector('.games-list');
        if (recentGamesElement) {
            window.domUtils.clearElement(recentGamesElement);
            
            data.recentGames.forEach(game => {
                const gameItem = window.domUtils.createElement('div', { className: 'game-item' });
                
                // Game icon
                const gameIcon = window.domUtils.createElement('div', { className: 'game-icon' });
                gameIcon.appendChild(window.domUtils.createIcon('trophy'));
                gameItem.appendChild(gameIcon);
                
                // Game info (name and date)
                const gameInfo = window.domUtils.createElement('div', { className: 'game-info' });
                gameInfo.appendChild(window.domUtils.createElement('div', { className: 'game-name' }, game.name));
                gameInfo.appendChild(window.domUtils.createElement('div', { className: 'game-date' }, game.date));
                gameItem.appendChild(gameInfo);
                
                // Game stats (score and rank)
                const gameStats = window.domUtils.createElement('div', { className: 'game-stats' });
                gameStats.appendChild(window.domUtils.createElement('div', { className: 'game-score' }, game.score.toString()));
                gameStats.appendChild(window.domUtils.createElement('div', { className: 'game-rank' }, `Rank #${game.rank}`));
                gameItem.appendChild(gameStats);
                
                recentGamesElement.appendChild(gameItem);
            });
        }
        
        // Update featured badges
        const featuredBadges = document.querySelector('.badges-grid');
        if (featuredBadges) {
            window.domUtils.clearElement(featuredBadges);
            
            // Filter only acquired badges for the featured section
            const acquiredBadges = data.badges.filter(badge => badge.acquired).slice(0, 3);
            
            acquiredBadges.forEach(badge => {
                const badgeItem = window.domUtils.createElement('div', { className: 'badge-item' });
                
                // Badge icon
                const badgeIcon = window.domUtils.createElement('div', { className: 'badge-icon' });
                badgeIcon.appendChild(window.domUtils.createIcon(badge.icon));
                badgeItem.appendChild(badgeIcon);
                
                // Badge info (name and description)
                const badgeInfo = window.domUtils.createElement('div', { className: 'badge-info' });
                badgeInfo.appendChild(window.domUtils.createElement('div', { className: 'badge-name' }, badge.name));
                badgeInfo.appendChild(window.domUtils.createElement('div', { className: 'badge-description' }, badge.description));
                badgeItem.appendChild(badgeInfo);
                
                featuredBadges.appendChild(badgeItem);
            });
        }
    }
    
    // Update badges tab content
    function updateBadgesTab(data) {
        // Update all badges list
        const allBadgesElement = document.querySelector('.full-badges-list');
        if (allBadgesElement) {
            window.domUtils.clearElement(allBadgesElement);
            
            data.badges.forEach(badge => {
                const badgeRow = window.domUtils.createElement('div', { 
                    className: badge.acquired ? 'badge-row' : 'badge-row locked' 
                });
                
                if (badge.acquired) {
                    // Badge icon (acquired)
                    const badgeIcon = window.domUtils.createElement('div', { className: 'badge-large-icon acquired' });
                    badgeIcon.appendChild(window.domUtils.createIcon(badge.icon));
                    badgeRow.appendChild(badgeIcon);
                    
                    // Badge details
                    const badgeDetails = window.domUtils.createElement('div', { className: 'badge-details' });
                    badgeDetails.appendChild(window.domUtils.createElement('h3', {}, badge.name));
                    badgeDetails.appendChild(window.domUtils.createElement('p', {}, badge.description));
                    badgeDetails.appendChild(window.domUtils.createElement('div', 
                        { className: 'acquisition-date' }, 
                        `Unlocked on ${badge.date}`
                    ));
                    badgeRow.appendChild(badgeDetails);
                    
                    // Badge status
                    badgeRow.appendChild(window.domUtils.createElement('div', 
                        { className: 'badge-status' }, 
                        'UNLOCKED'
                    ));
                } else {
                    // Badge icon (locked)
                    const badgeIcon = window.domUtils.createElement('div', { className: 'badge-large-icon' });
                    badgeIcon.appendChild(window.domUtils.createIcon(badge.icon));
                    badgeRow.appendChild(badgeIcon);
                    
                    // Badge details with progress
                    const badgeDetails = window.domUtils.createElement('div', { className: 'badge-details' });
                    badgeDetails.appendChild(window.domUtils.createElement('h3', {}, badge.name));
                    badgeDetails.appendChild(window.domUtils.createElement('p', {}, badge.description));
                    
                    // Progress section for locked badge
                    const badgeProgress = window.domUtils.createElement('div', { className: 'badge-progress' });
                    
                    const progressMeta = window.domUtils.createElement('div', { className: 'progress-meta' });
                    progressMeta.appendChild(window.domUtils.createElement('span', {}, `${badge.currentPoints} points`));
                    progressMeta.appendChild(window.domUtils.createElement('span', {}, `${badge.requiredPoints} points needed`));
                    badgeProgress.appendChild(progressMeta);
                    
                    const progressContainer = window.domUtils.createElement('div', { className: 'progress-container' });
                    const progressBarWidth = (badge.currentPoints / badge.requiredPoints) * 100;
                    progressContainer.appendChild(window.domUtils.createElement('div', {
                        className: 'progress-bar',
                        style: { width: `${progressBarWidth}%` }
                    }));
                    badgeProgress.appendChild(progressContainer);
                    
                    badgeDetails.appendChild(badgeProgress);
                    badgeRow.appendChild(badgeDetails);
                }
                
                allBadgesElement.appendChild(badgeRow);
            });
        }
        
        // Update badge timeline
        const timelineElement = document.querySelector('.timeline');
        if (timelineElement) {
            window.domUtils.clearElement(timelineElement);
            
            // Filter only acquired badges for timeline, and sort by date (most recent first)
            const acquiredBadges = data.badges
                .filter(badge => badge.acquired)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            acquiredBadges.forEach(badge => {
                const timelineItem = window.domUtils.createElement('div', { className: 'timeline-item' });
                
                // Timeline icon
                const timelineIcon = window.domUtils.createElement('div', { className: 'timeline-icon' });
                timelineIcon.appendChild(window.domUtils.createIcon(badge.icon));
                timelineItem.appendChild(timelineIcon);
                
                // Timeline content
                const timelineContent = window.domUtils.createElement('div', { className: 'timeline-content' });
                timelineContent.appendChild(window.domUtils.createElement('div', { className: 'timeline-date' }, badge.date));
                timelineContent.appendChild(window.domUtils.createElement('h4', {}, `${badge.name} Badge Unlocked`));
                timelineContent.appendChild(window.domUtils.createElement('p', {}, badge.description));
                timelineItem.appendChild(timelineContent);
                
                timelineElement.appendChild(timelineItem);
            });
        }
    }
};

// Handle both direct page load and SPA routing
document.addEventListener('DOMContentLoaded', function() {
    // Only auto-initialize if we're directly on profile.html
    if (window.location.pathname.includes('profile.html')) {
        window.initializeProfile();
    }
    
    // Otherwise, the router will call initializeProfile when needed
});
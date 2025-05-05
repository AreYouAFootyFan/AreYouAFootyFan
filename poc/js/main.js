// main.js - Core functionality for Football Arena SPA

document.addEventListener('DOMContentLoaded', function() {
    console.log('Football Arena SPA initialized');
    
    // Add hover effects for interactive elements - this will work across all SPA pages
    document.body.addEventListener('mouseenter', function(e) {
        const interactiveItem = e.target.closest('.feature-item, .progression-item');
        if (interactiveItem) {
            interactiveItem.style.transform = 'translateY(-5px)';
        }
    }, true);
    
    document.body.addEventListener('mouseleave', function(e) {
        const interactiveItem = e.target.closest('.feature-item, .progression-item');
        if (interactiveItem) {
            interactiveItem.style.transform = 'translateY(0)';
        }
    }, true);
    
    // Handle placeholder images
    document.body.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' && e.target.src.includes('placeholder')) {
            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Ccircle cx="12" cy="8" r="5"%3E%3C/circle%3E%3Cpath d="M20 21a8 8 0 1 0-16 0"%3E%3C/path%3E%3C/svg%3E';
            e.target.style.backgroundColor = '#065f46';
        }
    }, true);
    
    // Add logout functionality
    document.addEventListener('click', function(e) {
        // Find logout button by its icon
        const logoutButton = e.target.closest('.btn-ghost i[data-lucide="log-out"]');
        if (logoutButton) {
            e.preventDefault();
            
            // Reset authentication state
            if (window.appState) {
                window.appState.setUser(null);
            }
            
            // Navigate to home page
            if (window.router) {
                window.router.navigate('/');
            }
        }
    });
});

// Function to load and display leaderboard preview on homepage
// We define this in the global scope so it can be called by the router
window.loadLeaderboardPreview = async function() {
    try {
        const leaderboardPreview = document.querySelector('.leaderboard-preview');
        if (!leaderboardPreview) return;
        
        const response = await fetch('data/leaderboard.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Clear existing content
        window.domUtils.clearElement(leaderboardPreview);
        
        // Get the top 3 players
        const topPlayers = data.slice(0, 3);
        
        topPlayers.forEach(player => {
            // Create player element using our DOM utilities
            const playerElement = window.domUtils.createElement('div', { className: 'leaderboard-item' }, [
                window.domUtils.createElement('div', { className: 'rank' }, player.rank),
                window.domUtils.createElement('div', { className: 'avatar' }, 
                    window.domUtils.createElement('img', { 
                        src: player.avatar, 
                        alt: player.username 
                    })
                ),
                window.domUtils.createElement('div', { className: 'player-info' }, [
                    window.domUtils.createElement('div', { className: 'player-name' }, player.username),
                    window.domUtils.createElement('div', { className: 'player-rank' }, player.title)
                ]),
                window.domUtils.createElement('div', { className: 'player-points' }, [
                    window.domUtils.createElement('div', { className: 'points' }, player.score.toLocaleString()),
                    window.domUtils.createElement('div', { className: 'points-label' }, 'points')
                ])
            ]);
            
            leaderboardPreview.appendChild(playerElement);
        });
        
        // Reinit icons if needed
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading leaderboard data:', error);
        // If there's an error, provide a fallback message
        const leaderboardPreview = document.querySelector('.leaderboard-preview');
        if (leaderboardPreview) {
            window.domUtils.clearElement(leaderboardPreview);
            
            const errorMessage = window.domUtils.createElement('div', { className: 'error-message' }, 
                window.domUtils.createElement('p', {}, 'Unable to load leaderboard data. Please try again later.')
            );
            
            leaderboardPreview.appendChild(errorMessage);
        }
    }
}

// State management (simplified version for demo)
window.appState = {
    user: null,
    isAuthenticated: false,
    score: 0,
    badges: [],
    
    // Toggle authentication state (for demo purposes)
    toggleAuth() {
        this.isAuthenticated = !this.isAuthenticated;
        if (window.router) {
            window.router.isAuthenticated = this.isAuthenticated;
            window.router.updateAuthUI();
        }
    },
    
    // Set user data
    setUser(userData) {
        this.user = userData;
        this.isAuthenticated = !!userData;
        if (window.router) {
            window.router.isAuthenticated = this.isAuthenticated;
            window.router.updateAuthUI();
        }
    }
};
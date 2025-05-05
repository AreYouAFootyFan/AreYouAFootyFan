// leaderboard.js - Leaderboard functionality for SPA

// Create initialization function in global scope for router access
window.initializeLeaderboard = function() {
    console.log('Initializing leaderboard module');
    
    // Leaderboard state
    let leaderboardData = [];
    let searchQuery = "";
    let sortOrder = "desc"; // "desc" or "asc"
    let timeFilter = "all-time";
    let gameMode = "all";
    
    // Load the leaderboard data
    loadLeaderboardData();
    
    // Set up event listeners - we use delegation for dynamically loaded content
    document.addEventListener('input', function(e) {
        if (e.target.id === 'search-input') {
            searchQuery = e.target.value;
            renderLeaderboard();
        }
    });
    
    document.addEventListener('change', function(e) {
        if (e.target.id === 'time-filter') {
            timeFilter = e.target.value;
            renderLeaderboard();
        } else if (e.target.id === 'game-mode-filter') {
            gameMode = e.target.value;
            renderLeaderboard();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('#sort-button')) {
            sortOrder = sortOrder === "desc" ? "asc" : "desc";
            renderLeaderboard();
        }
    });
    
    // Function to load leaderboard data
    function loadLeaderboardData() {
        fetch('data/leaderboard.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                leaderboardData = data;
                renderLeaderboard();
            })
            .catch(error => {
                console.error('Error loading leaderboard data:', error);
                const leaderboardRows = document.getElementById('leaderboard-rows');
                if (leaderboardRows) {
                    window.domUtils.clearElement(leaderboardRows);
                    
                    const errorMessage = window.domUtils.createElement('div', 
                        { className: 'error-message' },
                        window.domUtils.createElement('p', {}, 
                            'Unable to load leaderboard data. Please try again later.'
                        )
                    );
                    
                    leaderboardRows.appendChild(errorMessage);
                }
            });
    }
    
    // Render the leaderboard with current filters
    function renderLeaderboard() {
        const leaderboardRows = document.getElementById('leaderboard-rows');
        if (!leaderboardRows) {
            console.error('Leaderboard rows container not found');
            return;
        }
        
        window.domUtils.clearElement(leaderboardRows);
        
        // Filter and sort the data
        const filteredData = leaderboardData
            .filter(player => player.username.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                if (sortOrder === "desc") {
                    return b.score - a.score;
                } else {
                    return a.score - b.score;
                }
            });
        
        // Create rows for each player
        filteredData.forEach(player => {
            const row = window.domUtils.createElement('div', { className: 'leaderboard-row' });
            
            // Column: Rank
            const colRank = window.domUtils.createElement('div', { className: 'col-rank' });
            
            // Determine rank display (trophy for top 3)
            if (player.rank <= 3) {
                const trophyClass = player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : 'bronze';
                const rankTrophy = window.domUtils.createElement('div', { className: `rank-trophy ${trophyClass}` });
                rankTrophy.appendChild(window.domUtils.createIcon('trophy'));
                colRank.appendChild(rankTrophy);
            } else {
                const rankNumber = window.domUtils.createElement('div', { className: 'rank-number' });
                rankNumber.appendChild(window.domUtils.createElement('span', {}, player.rank.toString()));
                
                // Add change icon if available
                if (player.change === "up") {
                    rankNumber.appendChild(window.domUtils.createIcon('chevron-up', { className: 'change-icon up' }));
                } else if (player.change === "down") {
                    rankNumber.appendChild(window.domUtils.createIcon('chevron-down', { className: 'change-icon down' }));
                }
                
                colRank.appendChild(rankNumber);
            }
            
            row.appendChild(colRank);
            
            // Column: Player
            const colPlayer = window.domUtils.createElement('div', { className: 'col-player' });
            
            // Player avatar
            const playerAvatar = window.domUtils.createElement('div', { className: 'player-avatar' });
            playerAvatar.appendChild(window.domUtils.createElement('img', {
                src: player.avatar,
                alt: player.username
            }));
            colPlayer.appendChild(playerAvatar);
            
            // Player name
            colPlayer.appendChild(window.domUtils.createElement('span', 
                { className: 'player-name' }, 
                player.username
            ));
            
            row.appendChild(colPlayer);
            
            // Column: Title
            row.appendChild(window.domUtils.createElement('div', 
                { className: 'col-title' }, 
                player.title
            ));
            
            // Column: Country
            row.appendChild(window.domUtils.createElement('div', 
                { className: 'col-country' }, 
                player.country
            ));
            
            // Column: Score
            row.appendChild(window.domUtils.createElement('div', 
                { className: 'col-score' }, 
                player.score.toLocaleString()
            ));
            
            leaderboardRows.appendChild(row);
        });
        
        // If no results found
        if (filteredData.length === 0) {
            const emptyRow = window.domUtils.createElement('div', { className: 'leaderboard-row' });
            const emptyMessage = window.domUtils.createElement('div', {
                className: 'col-span-full',
                style: {
                    textAlign: 'center',
                    gridColumn: '1 / -1',
                    padding: '2rem 0'
                }
            }, 'No players found matching your search.');
            
            emptyRow.appendChild(emptyMessage);
            leaderboardRows.appendChild(emptyRow);
        }
        
        // Re-initialize Lucide icons for the new content
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Update rank badge with current user rank (simulated)
        const rankBadge = document.querySelector('.rank-badge');
        if (rankBadge && window.appState && window.appState.user) {
            // In a real app, this would be derived from actual user data
            window.domUtils.clearElement(rankBadge);
            rankBadge.appendChild(window.domUtils.createIcon('trophy'));
            rankBadge.appendChild(document.createTextNode(' Your Rank: #42'));
            
            // Reinit icon
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }
};

// Handle both direct page load and SPA routing
document.addEventListener('DOMContentLoaded', function() {
    // Only auto-initialize if we're directly on leaderboard.html
    if (window.location.pathname.includes('leaderboard.html')) {
        window.initializeLeaderboard();
    }
    
    // Otherwise, the router will call initializeLeaderboard when needed
});
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
    });
    
    // Handle URL input
    const urlInput = document.querySelector('.url-input');
    const refreshBtn = document.querySelector('.refresh-btn'); 
    
    function handleUrlSubmit() {
        const prompt = urlInput.value.trim();
        if (prompt) {
            console.log('Generating simulation for:', prompt);
            // TODO: Implement simulation generation
        }
    }
    
    if (refreshBtn) { 
        refreshBtn.addEventListener('click', handleUrlSubmit);
    }
    
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleUrlSubmit();
        }
    });
    
    // Add click handlers for sim cards
    const simCards = document.querySelectorAll('.sim-card');
    simCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = card.querySelector('.card-title').textContent;
            console.log('Opening simulation:', title);
            // TODO: Implement simulation opening
        });
    });
    
    // Add click handlers for sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = item.querySelector('h5').textContent;
            console.log('Opening sidebar item:', title);
            // TODO: Implement sidebar item opening
        });
    });

    // Function to load user avatars
    async function loadUserAvatars() {
        try {
            const user = await window.websim.getUser();
            
            const addressAvatarImg = document.getElementById('userAvatarAddressBar');
            
            if (user && user.username) {
                const avatarSrc = `https://images.websim.com/avatar/${user.username}`;
                const avatarAlt = `${user.username}'s avatar`;

                if (addressAvatarImg) {
                    addressAvatarImg.src = avatarSrc;
                    addressAvatarImg.alt = avatarAlt;
                }
            } else {
                console.warn('WebSim user not found or username is missing. Avatars will use default placeholders.');
            }
        } catch (error) {
            console.error('Error loading user data for avatars:', error);
        }
    }

    loadUserAvatars();
});
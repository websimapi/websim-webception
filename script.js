document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarProjectTitle = document.getElementById('sidebarProjectTitle');
    
    const ICONS = {
        open: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path><path d="m10 15-3-3 3-3"></path></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
    };

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        if (sidebar.classList.contains('hidden')) {
            sidebarToggle.innerHTML = ICONS.open;
        } else {
            sidebarToggle.innerHTML = ICONS.close;
        }
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
    
    // Add click handlers for sidebar items (now history items)
    const historyItems = document.querySelectorAll('.sidebar-history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = item.querySelector('.history-text').textContent;
            console.log('Opening history item:', text);
            // TODO: Implement history item opening
        });
    });

    // Function to load user avatars and project info
    async function loadUserDataAndProjectInfo() {
        try {
            const user = await window.websim.getUser();
            const project = await window.websim.getCurrentProject();

            if (project && project.title && sidebarProjectTitle) {
                sidebarProjectTitle.textContent = project.title;
            } else if (sidebarProjectTitle) {
                sidebarProjectTitle.textContent = document.title || "Project Details"; // Fallback to page title or generic
            }
            
            const addressAvatarImg = document.getElementById('userAvatarAddressBar');
            const sidebarAvatarImg = document.getElementById('userAvatarSidebar');
            
            if (user && user.username) {
                const avatarSrc = `https://images.websim.com/avatar/${user.username}`;
                const avatarAlt = `${user.username}'s avatar`;

                if (addressAvatarImg) {
                    addressAvatarImg.src = avatarSrc;
                    addressAvatarImg.alt = avatarAlt;
                }
                if (sidebarAvatarImg) {
                    sidebarAvatarImg.src = avatarSrc;
                    sidebarAvatarImg.alt = avatarAlt;
                }

            } else {
                console.warn('WebSim user not found or username is missing. Avatars will use default placeholders.');
                 // Keep default src if user not found
                if (addressAvatarImg) addressAvatarImg.alt = 'User Avatar';
                if (sidebarAvatarImg) sidebarAvatarImg.alt = 'User Avatar';
            }
        } catch (error) {
            console.error('Error loading user/project data:', error);
            if (sidebarProjectTitle) {
                 sidebarProjectTitle.textContent = document.title || "Project Details";
            }
        }
    }

    loadUserDataAndProjectInfo();
});
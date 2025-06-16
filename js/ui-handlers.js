import { ICONS } from './utils.js';

export function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainHeaderLogoWrapper = document.getElementById('mainHeaderLogoWrapper');
    const sidebar = document.getElementById('sidebar');
    const sidebarInternalControls = document.getElementById('sidebarInternalControls');
    const sidebarInternalCloseBtn = document.getElementById('sidebarInternalCloseBtn');

    // Set initial icon for the main header toggle button
    if (sidebarToggle) {
        sidebarToggle.innerHTML = ICONS.open;
    }

    // Event listener for the main header toggle button (to open sidebar)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('hidden');

            // Trigger refresh of history when sidebar opens
            const event = new CustomEvent('sidebarOpened');
            document.dispatchEvent(event);

            if (mainHeaderLogoWrapper) {
                mainHeaderLogoWrapper.style.display = 'none';
            }

            if (sidebarInternalControls) {
                sidebarInternalControls.style.display = 'inline-flex';
                if (sidebarInternalCloseBtn) {
                    sidebarInternalCloseBtn.innerHTML = ICONS.closeSidebar;
                }
            }
        });
    }
    
    // Event listener for the sidebar's internal close button
    if (sidebarInternalCloseBtn) {
        sidebarInternalCloseBtn.addEventListener('click', function() {
            sidebar.classList.add('hidden');

            if (sidebarInternalControls) {
                sidebarInternalControls.style.display = 'none';
            }

            if (mainHeaderLogoWrapper) {
                mainHeaderLogoWrapper.style.display = 'inline-flex';
            }
        });
    }
}

export function setupSidebarTabs() {
    const remixViewBtn = document.getElementById('remixViewBtn');
    const projectsViewBtn = document.getElementById('projectsViewBtn');
    const remixView = document.getElementById('remix-view');
    const projectsView = document.getElementById('projects-view');
    const sidebarActionButtons = document.querySelectorAll('.sidebar-nav-controls-left .sidebar-action-btn');

    sidebarActionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
             if (btn.id === 'remixViewBtn' || btn.id === 'projectsViewBtn') {
                sidebarActionButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    if (remixViewBtn && projectsViewBtn && remixView && projectsView) {
        remixViewBtn.addEventListener('click', () => {
            if(remixView) remixView.style.display = 'flex';
            if(projectsView) projectsView.style.display = 'none';
        });

        projectsViewBtn.addEventListener('click', () => {
            if(remixView) remixView.style.display = 'none';
            if(projectsView) projectsView.style.display = 'flex';
            
            // Trigger projects load if needed
            const event = new CustomEvent('projectsViewOpened');
            document.dispatchEvent(event);
        });
    }
}

export function setupProjectDescription() {
    const descriptionP = document.getElementById('sidebarProjectDescription');
    const descriptionTextarea = document.getElementById('sidebarProjectDescriptionInput');

    if (descriptionP && descriptionTextarea) {
        descriptionP.classList.add('is-placeholder');

        descriptionP.addEventListener('click', () => {
            descriptionP.style.display = 'none';
            descriptionTextarea.style.display = 'block';
            
            const fullText = descriptionP.dataset.fullText;
            descriptionTextarea.value = fullText || '';
            descriptionTextarea.focus();
            
            descriptionTextarea.style.height = 'auto';
            descriptionTextarea.style.height = (descriptionTextarea.scrollHeight) + 'px';
        });

        descriptionTextarea.addEventListener('blur', () => {
            const newText = descriptionTextarea.value.trim();
            
            descriptionTextarea.style.display = 'none';
            descriptionP.style.display = 'block';

            if (newText === '') {
                descriptionP.textContent = 'Add a description...';
                descriptionP.classList.add('is-placeholder');
                delete descriptionP.dataset.fullText;
            } else {
                descriptionP.dataset.fullText = newText;
                descriptionP.classList.remove('is-placeholder');
                
                if (newText.length > 100) {
                    descriptionP.textContent = newText.substring(0, 100) + '...';
                } else {
                    descriptionP.textContent = newText;
                }
            }
        });

        descriptionTextarea.addEventListener('input', () => {
            descriptionTextarea.style.height = 'auto';
            descriptionTextarea.style.height = (descriptionTextarea.scrollHeight) + 'px';

            if (descriptionTextarea.value.length > descriptionTextarea.maxLength) {
                descriptionTextarea.value = descriptionTextarea.value.slice(0, descriptionTextarea.maxLength);
            }
        });
    }
}

export function setupChatInput() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });
    }
}

export function setupAddressBar() {
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
}
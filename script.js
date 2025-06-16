document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle'); // Button in main header
    const mainHeaderLogoWrapper = document.getElementById('mainHeaderLogoWrapper'); // Wrapper in main header for logo + toggle

    const sidebar = document.getElementById('sidebar');
    const sidebarInternalControls = document.getElementById('sidebarInternalControls'); // Wrapper in sidebar top nav
    const sidebarInternalCloseBtn = document.getElementById('sidebarInternalCloseBtn'); // Button in sidebar top nav

    const sidebarProjectTitle = document.getElementById('sidebarProjectTitle');

    const ICONS = {
        open: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path><path d="m10 15-3-3 3-3"></path></svg>`,
        closeSidebar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
    };

    let currentProject = null; // To store current project details

    // Set initial icon for the main header toggle button
    if (sidebarToggle) {
        sidebarToggle.innerHTML = ICONS.open;
    }

    // Event listener for the main header toggle button (to open sidebar)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('hidden'); // Show the sidebar

            if (mainHeaderLogoWrapper) {
                mainHeaderLogoWrapper.style.display = 'none'; // Hide the logo and toggle button in the main header
            }

            if (sidebarInternalControls) {
                sidebarInternalControls.style.display = 'inline-flex'; // Show the logo and toggle button in the sidebar's top nav
                if (sidebarInternalCloseBtn) {
                    // When sidebar is open, its close button shows the "flipped" icon.
                    sidebarInternalCloseBtn.innerHTML = ICONS.closeSidebar;
                }
            }
        });
    }
    
    // Event listener for the sidebar's internal close button (now using the "open" icon)
    if (sidebarInternalCloseBtn) {
        sidebarInternalCloseBtn.addEventListener('click', function() {
            sidebar.classList.add('hidden'); // Hide the sidebar

            if (sidebarInternalControls) {
                sidebarInternalControls.style.display = 'none'; // Hide the logo and toggle button in the sidebar's top nav
            }

            if (mainHeaderLogoWrapper) {
                mainHeaderLogoWrapper.style.display = 'inline-flex'; // Show the logo and toggle button back in the main header
            }
            // The sidebarToggle button in mainHeaderLogoWrapper will inherently show ICONS.open
            // as its content was never changed from the initial setup.
        });
    }
    
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

    // Sidebar project description handler
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

    function timeAgo(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return `0m ago`;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    function getIconForPromptType(type) {
        switch (type) {
            case 'get':
            case 'plaintext':
            case 'continue':
                return 'fas fa-magic'; // Generation
            case 'fix':
                return 'fas fa-wrench'; // Fixing
            case 'refactor':
                return 'fas fa-palette'; // Styling, refactoring
            case 'edit':
            case 'tweak-edit':
                return 'fas fa-mouse-pointer'; // Direct interaction
            case 'manual-edit':
                return 'fas fa-keyboard'; // Manual code editing
            default:
                return 'fas fa-code-branch'; // Default/unknown
        }
    }

    function createHistoryItemElement({ project_revision, site }) {
        const li = document.createElement('li');
        li.className = 'sidebar-history-item';
        li.dataset.versionId = project_revision.id;

        const version = project_revision.version || '??';
        const promptText = site?.prompt?.text || 'Project version created';
        const model = site?.model;

        const isCurrentVersion = currentProject && project_revision.version === currentProject.current_version;

        // Placeholders for stats not available in the revisions API
        const views = '13k';
        const likes = '+69';
        const dislikes = '-2';

        const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.com/v1/site/${site.id}/600` : '');
        const altText = site?.prompt?.text ? `Thumbnail for: ${site.prompt.text.substring(0, 50)}...` : 'Project version thumbnail';

        // Using innerHTML for a more complex structure
        li.innerHTML = `
            <div class="history-item-left">
                <div class="history-item-avatar">
                    <div class="history-version-tag ${!isCurrentVersion ? 'is-old-version' : ''}">
                        <span>V${version}</span>
                        ${isCurrentVersion ? '<i class="far fa-bookmark"></i>' : ''}
                    </div>
                    <img src="${thumbnailUrl}" alt="${altText}">
                </div>
            </div>
            <div class="history-item-center">
                <div class="history-prompt-text">
                    ${promptText}
                </div>
                <div class="history-meta-stats">
                    <span class="stat-views"><i class="far fa-eye"></i> ${views}</span>
                    <span class="stat-positive">${likes}</span>
                    <span class="stat-negative">${dislikes}</span>
                    <span class="stat-model">${model || 'gemini-pro'}</span>
                </div>
            </div>
            <div class="history-item-right">
                <button class="history-action-btn" title="More options"><i class="fas fa-ellipsis-v"></i></button>
                <div class="history-item-right-bottom-actions">
                    <button class="history-action-btn" title="Retry Prompt"><i class="fas fa-redo-alt"></i></button>
                    <button class="history-action-btn history-delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        
        const img = li.querySelector('.history-item-avatar img');
        const avatarContainer = img.parentElement;

        const setFailedState = () => {
            if (avatarContainer) {
                img.remove();
                avatarContainer.classList.add('loading-failed');
            }
        };

        img.onerror = setFailedState;

        if (!thumbnailUrl) {
            setFailedState();
        }
        
        // Add click handler for navigation
        if (!isCurrentVersion && site) {
            li.addEventListener('click', (e) => {
                // Prevent navigation if a button inside the item was clicked
                if (e.target.closest('.history-action-btn')) {
                    return;
                }
                const versionedUrl = `/p/${project_revision.project_id}/v/${project_revision.version}`;
                window.location.href = versionedUrl;
            });
        } else {
            // If it's the current version or there's no link, make it non-interactive
            li.classList.add('non-interactive');
        }
        
        return li;
    }

    async function loadProjectHistory(projectId) {
        const historyList = document.querySelector('.sidebar-history-list');
        if (!historyList) {
            console.error('Sidebar history list element not found.');
            return;
        }
        const sidebarContent = historyList.parentElement;
    
        // Static state for pagination, reset only when project ID changes.
        // Using a static variable inside the function scope.
        if (!loadProjectHistory.state || loadProjectHistory.state.projectId !== projectId) {
            loadProjectHistory.state = {
                projectId: projectId,
                isLoading: false,
                nextCursor: null,
                hasMore: true,
                limit: 25,
            };
            historyList.innerHTML = ''; // Clear old project data
            sidebarContent.scrollTop = 0; // Reset scroll
    
            // Setup scroll listener only once per sidebar content element
            if (!sidebarContent.dataset.historyListener) {
                sidebarContent.addEventListener('scroll', () => {
                    // When scrolled near the top, load more.
                    if (sidebarContent.scrollTop < 200 && loadProjectHistory.state && loadProjectHistory.state.projectId) {
                        loadProjectHistory(loadProjectHistory.state.projectId);
                    }
                });
                sidebarContent.dataset.historyListener = 'true';
            }
        }
    
        const state = loadProjectHistory.state;
        if (state.isLoading || !state.hasMore) {
            return;
        }
    
        state.isLoading = true;
        const isInitialLoad = !state.nextCursor;
    
        if (isInitialLoad) {
            historyList.innerHTML = '<li class="sidebar-history-item" style="padding-left: 20px;">Loading history...</li>';
        }
    
        try {
            const url = new URL(`/api/v1/projects/${projectId}/revisions`, window.location.origin);
            url.searchParams.set('first', state.limit);
            if (state.nextCursor) {
                url.searchParams.set('after', state.nextCursor);
            }
    
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const { revisions } = await response.json();
    
            if (isInitialLoad) {
                historyList.innerHTML = '';
            }
    
            if (!revisions.data || revisions.data.length === 0) {
                if (isInitialLoad) {
                    historyList.innerHTML = '<li class="sidebar-history-item" style="padding-left: 20px;">No history found.</li>';
                }
                state.hasMore = false;
                return;
            }
            
            const oldScrollHeight = sidebarContent.scrollHeight;
    
            revisions.data.forEach(item => {
                const li = createHistoryItemElement(item);
                historyList.appendChild(li); // Appending adds to the top visually with column-reverse
            });
    
            state.hasMore = revisions.meta.has_next_page;
            state.nextCursor = revisions.meta.end_cursor;
    
            if (isInitialLoad) {
                // After initial load, scroll to the bottom to show the newest items
                setTimeout(() => sidebarContent.scrollTop = sidebarContent.scrollHeight, 0);
            } else {
                // After loading more, adjust scroll to keep user's position stable
                const newScrollHeight = sidebarContent.scrollHeight;
                sidebarContent.scrollTop += newScrollHeight - oldScrollHeight;
            }
    
        } catch (error) {
            console.error("Failed to fetch project history:", error);
            if (isInitialLoad) {
                historyList.innerHTML = '<li class="sidebar-history-item" style="padding-left: 20px;">Failed to load history.</li>';
            }
        } finally {
            if(state) state.isLoading = false;
        }
    }

    // NEW: Project Feed Loader
    async function projectLoader(user) { // MODIFIED to accept user
        const projectsGrid = document.getElementById('projects-grid');
        const loader = document.getElementById('loader');
        const mainContentEl = document.querySelector('.main-content');

        if (!projectsGrid || !loader || !mainContentEl) {
            console.error('Required elements for project loader not found.');
            return;
        }

        let offset = 0;
        const limit = 24;
        let isLoading = false;
        let hasMore = true;
        const userId = user ? user.id : null; // MODIFIED to use passed user

        async function fetchAndRenderProjects() {
            if (isLoading || !hasMore) return;
            isLoading = true;
            loader.style.display = 'block';

            try {
                const url = new URL('/api/v1/feed/trending', window.location.origin);
                url.searchParams.set('limit', limit);
                url.searchParams.set('offset', offset);
                url.searchParams.set('feed', 'hot_desktop');
                url.searchParams.set('range', 'all');
                if (userId) {
                    url.searchParams.set('for_user_id', userId);
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const { feed } = await response.json();
                
                const projects = feed.data;

                if (projects.length < limit) {
                    hasMore = false;
                    loader.textContent = 'No more projects to load.';
                }
                
                projects.forEach(item => {
                    const card = createProjectCard(item);
                    projectsGrid.appendChild(card);
                });
                offset += projects.length;
                
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                loader.textContent = 'Failed to load projects.';
                hasMore = false; // Stop trying on error
            } finally {
                isLoading = false;
                if(hasMore) {
                   loader.style.display = 'none';
                }
            }
        }
    
        function createProjectCard({ project, site }) {
            if (!project || !site || !project.created_by) {
                console.warn('Skipping incomplete project item:', { project, site });
                return document.createDocumentFragment();
            }

            const card = document.createElement('a');
            card.className = 'project-card';
            card.href = `https://websim.com/p/${project.id}`;
            card.target = '_blank';
            
            const thumbnailUrl = `https://images.websim.com/v1/site/${site.id}/600`;
            const authorProfileUrl = `https://websim.com/@${project.created_by.username}`;
            const authorAvatarUrl = `https://images.websim.com/avatar/${project.created_by.username}`;

            card.innerHTML = `
                <img src="${thumbnailUrl}" alt="${project.title || 'Project thumbnail'}" class="project-thumbnail" loading="lazy" onerror="this.style.backgroundColor='#e0e0e0'; this.removeAttribute('src');">
                <div class="project-info">
                    <div class="project-title">${project.title || 'Untitled Project'}</div>
                    <div class="project-author">
                        <img src="${authorAvatarUrl}" alt="${project.created_by.username}" class="author-avatar" onerror="this.style.display='none'">
                        <span>@${project.created_by.username}</span>
                    </div>
                </div>
            `;
            
            const authorLinkDiv = card.querySelector('.project-author');
            authorLinkDiv.addEventListener('click', (e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 window.open(authorProfileUrl, '_blank');
            });

            return card;
        }

        function handleScroll() {
            const { scrollTop, scrollHeight, clientHeight } = mainContentEl;
            if (scrollTop + clientHeight >= scrollHeight - 500) {
                fetchAndRenderProjects();
            }
        }

        // Initialize - removed user fetching from here
        await fetchAndRenderProjects();
        mainContentEl.addEventListener('scroll', handleScroll);
    }

    async function main() {
        const isPuppeteer = navigator.webdriver;
        let userForFeed = null;
    
        const addressAvatarImg = document.getElementById('userAvatarAddressBar');
        const sidebarAvatarImg = document.getElementById('sidebarUserAvatarIcon');
    
        if (isPuppeteer) {
            console.log("Puppeteer environment detected.");
            userForFeed = { username: 'api', id: null };
            
            if (addressAvatarImg) {
                addressAvatarImg.src = '/image.png'; // Use asset: AI gem icon
                addressAvatarImg.alt = "@api's avatar";
            }
    
            try {
                const creator = await window.websim.getCreator();
                if (creator && creator.username) {
                    if (sidebarAvatarImg) {
                        sidebarAvatarImg.src = `https://images.websim.com/avatar/${creator.username}`;
                        sidebarAvatarImg.alt = `${creator.username}'s avatar`;
                    }
                } else {
                    if (sidebarAvatarImg) sidebarAvatarImg.alt = 'Creator Avatar';
                }
            } catch (error) {
                console.error('Error fetching creator data for puppeteer mode:', error);
                if (sidebarAvatarImg) sidebarAvatarImg.alt = 'Creator Avatar';
            }
    
        } else {
            // Real user logic
            try {
                const user = await window.websim.getUser();
                userForFeed = user;
    
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
                    console.warn('WebSim user not found. Using default avatars.');
                    if (addressAvatarImg) addressAvatarImg.alt = 'User Avatar';
                    if (sidebarAvatarImg) sidebarAvatarImg.alt = 'User Avatar';
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                if (addressAvatarImg) addressAvatarImg.alt = 'User Avatar';
                if (sidebarAvatarImg) sidebarAvatarImg.alt = 'User Avatar';
            }
        }
    
        // Load project-specific data (common to both modes)
        try {
            const projectSummary = await window.websim.getCurrentProject();
            
            if (projectSummary && projectSummary.id) {
                // Fetch full project data to get current_version for bookmarking
                try {
                    const response = await fetch(`/api/v1/projects/${projectSummary.id}`);
                    if (response.ok) {
                        const { project } = await response.json();
                        currentProject = project;
                    } else {
                        console.error(`Failed to fetch full project details: ${response.status}. Using summary.`);
                        currentProject = { ...projectSummary, current_version: null }; // Fallback
                    }
                } catch (e) {
                    console.error('Error fetching full project details. Using summary.', e);
                    currentProject = { ...projectSummary, current_version: null }; // Fallback
                }
                
                if (currentProject.title && sidebarProjectTitle) {
                    sidebarProjectTitle.textContent = currentProject.title;
                }

                const description = currentProject.description;
                if (descriptionP && description) {
                    descriptionP.dataset.fullText = description;
                    descriptionP.classList.remove('is-placeholder');
                    if (description.length > 100) {
                        descriptionP.textContent = description.substring(0, 100) + '...';
                    } else {
                        descriptionP.textContent = description;
                    }
                }

                loadProjectHistory(currentProject.id);

            } else if (sidebarProjectTitle) {
                sidebarProjectTitle.textContent = document.title || "Project Details";
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            if (sidebarProjectTitle) {
                sidebarProjectTitle.textContent = document.title || "Project Details";
            }
        }
    
        projectLoader(userForFeed);
    }

    main();

    // Chat input auto-resize
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });
    }
});
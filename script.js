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
    let creator = null; // To store creator details

    // Set initial icon for the main header toggle button
    if (sidebarToggle) {
        sidebarToggle.innerHTML = ICONS.open;
    }

    // Sidebar tab switching
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
            // load projects if not loaded yet
            if (projectsView && !projectsView.dataset.loaded) {
                loadCreatorProjects();
                projectsView.dataset.loaded = 'true';
            }
        });
    }

    // Event listener for the main header toggle button (to open sidebar)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('hidden'); // Show the sidebar

            // When sidebar is opened, check for new history items without a full reload.
            if (currentProject && currentProject.id) {
                loadProjectHistory(currentProject.id, { refresh: true });
            }

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

        if (minutes < 1) return `just now`;
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

        const isCurrentVersion = currentProject && project_revision.version == currentProject.current_version;

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
                        ${isCurrentVersion ? ' <i class="far fa-bookmark"></i>' : ''}
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
        
        return li;
    }

    function createCreatorProjectItem({ project, site }) {
        const item = document.createElement('div');
        item.className = 'creator-project-item';
        
        const thumbnailUrl = site ? `https://images.websim.com/v1/site/${site.id}/600` : '/image.png';

        const likes = project.stats?.likes ?? 0;
        const views = project.stats?.views ?? 0;
        
        const formatStat = (num) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num;
        };

        item.innerHTML = `
            <img src="${thumbnailUrl}" class="creator-project-thumbnail" alt="Thumbnail for ${project.title || 'Untitled Project'}" onerror="this.src='/image.png'">
            <div class="creator-project-details">
                <div class="creator-project-title">${project.title || 'Untitled Project'}</div>
                <div class="creator-project-meta">
                    <div class="creator-project-stats">
                        <span><i class="far fa-heart"></i> ${formatStat(likes)}</span>
                        <span><i class="fas fa-chart-bar"></i> ${formatStat(views)}</span>
                    </div>
                    <span class="creator-project-time">${timeAgo(project.created_at)}</span>
                </div>
            </div>
            <div class="creator-project-actions">
                <button class="action-btn" title="Settings"><i class="fas fa-cog"></i></button>
            </div>
        `;

        return item;
    }

    function getRelativeDateGroup(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (targetDate.getTime() === today.getTime()) return 'Today';
        if (targetDate.getTime() === yesterday.getTime()) return 'Yesterday';
        
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if(targetDate > oneWeekAgo) return 'This Week';

        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    async function loadCreatorProjects(filter = 'all', query = '') {
        if (!creator || !creator.username) {
            console.error("Creator info not available.");
            if(container) container.innerHTML = `<p style="padding: 16px;">Could not load creator's projects.</p>`;
            return;
        }

        const container = document.getElementById('projects-list-container');
        container.innerHTML = `<p style="padding: 16px;">Loading projects...</p>`;

        try {
            const url = new URL(`/api/v1/users/${creator.username}/projects`, window.location.origin);
            url.searchParams.set('first', 50);
            url.searchParams.set('sort_by', 'updated_at');
            
            if (filter === 'posted') url.searchParams.set('posted', 'true');
            else if (filter === 'liked') url.searchParams.set('liked_by_owner', 'true');
            
            if (query) url.searchParams.set('query', query);

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const { projects } = await response.json();

            if (!projects.data || projects.data.length === 0) {
                container.innerHTML = `<p style="padding: 16px;">No projects found.</p>`;
                return;
            }
            
            const groupedProjects = projects.data.reduce((acc, { project, site, project_revision }) => {
                if (!project || !site) return acc;
                const group = getRelativeDateGroup(project.created_at);
                if (!acc[group]) acc[group] = [];
                acc[group].push({ project, site, project_revision });
                return acc;
            }, {});

            container.innerHTML = '';
            
            const groupOrder = ['Today', 'Yesterday', 'This Week'];
            const sortedGroups = Object.keys(groupedProjects).sort((a, b) => {
                const aIndex = groupOrder.indexOf(a);
                const bIndex = groupOrder.indexOf(b);
                if(aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if(aIndex !== -1) return -1;
                if(bIndex !== -1) return 1;
                return new Date(b) - new Date(a);
            });

            for (const groupName of sortedGroups) {
                const groupHeader = document.createElement('div');
                groupHeader.className = 'section-header';
                groupHeader.textContent = groupName;
                container.appendChild(groupHeader);
                
                groupedProjects[groupName].forEach(item => {
                    const projectEl = createCreatorProjectItem(item);
                    container.appendChild(projectEl);
                });
            }

        } catch (error) {
            console.error("Failed to load creator projects:", error);
            container.innerHTML = `<p style="padding: 16px;">Failed to load projects.</p>`;
        }
    }

    async function loadProjectHistory(projectId, options = {}) {
        const { refresh = false } = options;
        const historyList = document.querySelector('.sidebar-history-list');
        if (!historyList) {
            console.error('Sidebar history list element not found.');
            return;
        }
        const sidebarContent = historyList.parentElement;

        // State initialization/reset on first call or project change
        if (!loadProjectHistory.state || loadProjectHistory.state.projectId !== projectId) {
            historyList.innerHTML = '';
            sidebarContent.scrollTop = 0;
            loadProjectHistory.state = {
                projectId: projectId,
                isLoading: false,
                isRefreshing: false,
                nextCursor: null,
                hasMore: true,
                limit: 25,
            };
            
            // Setup scroll listener only once
            if (!sidebarContent.dataset.historyListener) {
                sidebarContent.addEventListener('scroll', () => {
                    if (sidebarContent.scrollTop < 200 && loadProjectHistory.state && !loadProjectHistory.state.isLoading && loadProjectHistory.state.hasMore) {
                        loadProjectHistory(loadProjectHistory.state.projectId);
                    }
                });
                sidebarContent.dataset.historyListener = 'true';
            }
        }
        
        const state = loadProjectHistory.state;

        // A) Refresh Logic (for sidebar reopen)
        if (refresh) {
            if (state.isRefreshing) return;
            state.isRefreshing = true;

            try {
                // 1. Get fresh project data for correct bookmark
                const projectResponse = await fetch(`/api/v1/projects/${projectId}`);
                if (projectResponse.ok) {
                    const { project } = await projectResponse.json();
                    currentProject = project; // Update global `currentProject`
                }

                // 2. Fetch first page of revisions
                const url = new URL(`/api/v1/projects/${projectId}/revisions`, window.location.origin);
                url.searchParams.set('first', state.limit);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const { revisions } = await response.json();

                if (!revisions.data || revisions.data.length === 0) return;

                // 3. Diff and prepend new items
                const newestIdInDOM = historyList.firstChild?.dataset.versionId;
                const newItemsData = [];
                for (const item of revisions.data) {
                    if (newestIdInDOM && item.project_revision.id === newestIdInDOM) break;
                    newItemsData.push(item);
                }

                newItemsData.reverse().forEach(item => {
                    const li = createHistoryItemElement(item);
                    historyList.insertBefore(li, historyList.firstChild);
                });

                // NEW: Check for updated thumbnails in the newly fetched data
                revisions.data.forEach(itemData => {
                    const { project_revision, site } = itemData;
                    const existingLi = historyList.querySelector(`[data-version-id="${project_revision.id}"]`);

                    if (existingLi) {
                        const avatarContainer = existingLi.querySelector('.history-item-avatar');
                        if (avatarContainer && avatarContainer.classList.contains('loading-failed')) {
                            const newThumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.com/v1/site/${site.id}/600` : '');
                            if (newThumbnailUrl) {
                                avatarContainer.classList.remove('loading-failed');
                                const newImg = document.createElement('img');
                                newImg.src = newThumbnailUrl;
                                newImg.alt = site?.prompt?.text ? `Thumbnail for: ${site.prompt.text.substring(0, 50)}...` : 'Project version thumbnail';
                                
                                newImg.onerror = () => {
                                    if (newImg.parentElement) {
                                        const parent = newImg.parentElement;
                                        newImg.remove();
                                        parent.classList.add('loading-failed');
                                    }
                                };
                                avatarContainer.appendChild(newImg);
                            }
                        }
                    }
                });
                
                // 4. Update bookmarks on all items, new and old
                const allItemsInDOM = historyList.querySelectorAll('.sidebar-history-item');
                allItemsInDOM.forEach(li => {
                    if (!li.dataset.versionId) return; // Skip loading placeholders
                    const versionTag = li.querySelector('.history-version-tag');
                    if(!versionTag) return;
                    
                    const versionSpan = versionTag.querySelector('span');
                    const version = versionSpan?.textContent?.replace('V', '');

                    const isCurrent = version && currentProject && version == currentProject.current_version;
                    const hasBookmark = !!versionTag.querySelector('.fa-bookmark');
                    
                    versionTag.classList.toggle('is-old-version', !isCurrent);

                    if (isCurrent && !hasBookmark) {
                        if(versionSpan) versionSpan.insertAdjacentHTML('afterend', ' <i class="far fa-bookmark"></i>');
                    } else if (!isCurrent && hasBookmark) {
                        versionTag.querySelector('.fa-bookmark')?.remove();
                    }
                });

            } catch (error) {
                console.error("Failed to refresh project history:", error);
            } finally {
                if(state) state.isRefreshing = false;
            }
            return;
        }

        // B) Infinite Scroll Logic (for scrolling up to see older items)
        if (state.isLoading || !state.hasMore || state.isRefreshing) {
            return;
        }
        state.isLoading = true;
        
        const isInitialLoad = !state.nextCursor;
        if (isInitialLoad && historyList.children.length === 0) {
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
                if (!historyList.querySelector(`[data-version-id="${item.project_revision.id}"]`)) {
                    const li = createHistoryItemElement(item);
                    historyList.appendChild(li);
                }
            });

            state.hasMore = revisions.meta.has_next_page;
            state.nextCursor = revisions.meta.end_cursor;

            if (isInitialLoad) {
                setTimeout(() => sidebarContent.scrollTop = sidebarContent.scrollHeight, 0);
            } else {
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
                const creatorInfo = await window.websim.getCreator();
                creator = creatorInfo;
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

                const creatorInfo = await window.websim.getCreator();
                creator = creatorInfo;
    
                if (user && user.username) {
                    const avatarSrc = `https://images.websim.com/avatar/${user.username}`;
                    const avatarAlt = `${user.username}'s avatar`;
    
                    if (addressAvatarImg) {
                        addressAvatarImg.src = avatarSrc;
                        addressAvatarImg.alt = avatarAlt;
                    }
                } else {
                    console.warn('WebSim user not found. Using default avatars.');
                    if (addressAvatarImg) addressAvatarImg.alt = 'User Avatar';
                }

                if (creator && creator.username) {
                    if (sidebarAvatarImg) {
                        sidebarAvatarImg.src = `https://images.websim.com/avatar/${creator.username}`;
                        sidebarAvatarImg.alt = `${creator.username}'s avatar`;
                    }
                } else {
                     if (sidebarAvatarImg) sidebarAvatarImg.alt = 'Creator Avatar';
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

                const branchStatValue = document.getElementById('branch-stat-value');
                if (branchStatValue && currentProject && currentProject.current_version != null) {
                    branchStatValue.textContent = currentProject.current_version;
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

    // Wire up filters and search for Projects View
    const projectsViewContainer = document.getElementById('projects-view');
    if (projectsViewContainer) {
        const filterBtns = projectsViewContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const query = projectsViewContainer.querySelector('input').value;
                loadCreatorProjects(filter, query);
            });
        });

        const searchInput = projectsViewContainer.querySelector('input');
        let searchTimeout;
        searchInput.addEventListener('keyup', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value;
                const activeFilter = projectsViewContainer.querySelector('.filter-btn.active').dataset.filter;
                loadCreatorProjects(activeFilter, query);
            }, 300); // Debounce search
        });
    }

    // Chat input auto-resize
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });
    }

    // Model Selector Logic
    const modelSelectorContainer = document.querySelector('.model-selector-container');
    if (modelSelectorContainer) {
        const modelSelectorBtn = modelSelectorContainer.querySelector('.model-selector-btn');
        const modelSelectorMenu = modelSelectorContainer.querySelector('#model-selector-menu');
        const modelSelectorBtnText = modelSelectorBtn.querySelector('span');
        const modelSelectorBtnIcon = modelSelectorBtn.querySelector('i');
        const modelItems = modelSelectorMenu.querySelectorAll('.model-item');

        modelSelectorBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = modelSelectorMenu.style.display === 'none';
            modelSelectorMenu.style.display = isHidden ? 'flex' : 'none';
            
            if (modelSelectorBtnIcon) {
                modelSelectorBtnIcon.style.transition = 'transform 0.2s ease-in-out';
                modelSelectorBtnIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });

        document.addEventListener('click', (event) => {
            if (!modelSelectorContainer.contains(event.target)) {
                modelSelectorMenu.style.display = 'none';
                if (modelSelectorBtnIcon) {
                    modelSelectorBtnIcon.style.transform = 'rotate(0deg)';
                }
            }
        });

        modelItems.forEach(item => {
            item.addEventListener('click', () => {
                const currentActive = modelSelectorMenu.querySelector('.model-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                item.classList.add('active');

                const modelName = item.dataset.modelName;
                if (modelSelectorBtnText) {
                    modelSelectorBtnText.textContent = modelName;
                }

                modelSelectorMenu.style.display = 'none';
                if (modelSelectorBtnIcon) {
                    modelSelectorBtnIcon.style.transform = 'rotate(0deg)';
                }

                console.log(`Model changed to: ${modelName}`);
            });
        });
    }

    // Advanced Abilities Menu Logic
    const abilitiesContainer = document.querySelector('.abilities-container');
    if (abilitiesContainer) {
        const abilitiesBtn = abilitiesContainer.querySelector('.attachment-btn');
        const abilitiesMenu = abilitiesContainer.querySelector('#advanced-abilities-menu');
        const abilitiesBadge = abilitiesBtn.querySelector('.badge');
        const checkboxes = abilitiesMenu.querySelectorAll('input[type="checkbox"]');
        const abilitiesWarning = document.getElementById('abilities-warning');

        const updateAbilitiesUI = () => {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            if (abilitiesBadge) {
                abilitiesBadge.textContent = checkedCount;
                if (checkedCount > 0) {
                    abilitiesBadge.style.display = 'flex';
                } else {
                    abilitiesBadge.style.display = 'none';
                }
            }
            if (abilitiesWarning) {
                abilitiesWarning.style.display = checkedCount >= 3 ? 'block' : 'none';
            }
        };

        abilitiesBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = abilitiesMenu.style.display === 'none';
            // Also hide model selector if open
            const modelSelectorMenu = document.querySelector('#model-selector-menu');
            if(modelSelectorMenu) modelSelectorMenu.style.display = 'none';

            abilitiesMenu.style.display = isHidden ? 'flex' : 'none';
        });

        document.addEventListener('click', (event) => {
            if (abilitiesMenu.style.display === 'flex' && !abilitiesContainer.contains(event.target)) {
                abilitiesMenu.style.display = 'none';
            }
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateAbilitiesUI();
                const abilityName = checkbox.nextElementSibling.querySelector('.ability-title').textContent;
                console.log(`Ability '${abilityName}' is now ${checkbox.checked ? 'enabled' : 'disabled'}`);
            });
        });

        // Initial count on load
        updateAbilitiesUI();
    }

    // Visibility Selector Logic
    const visibilityContainer = document.querySelector('.visibility-selector-container');
    if (visibilityContainer) {
        const visibilityBtn = visibilityContainer.querySelector('.visibility-btn');
        const visibilityMenu = visibilityContainer.querySelector('#visibility-selector-menu');
        const visibilityBtnIcon = visibilityBtn.querySelector('i');
        const visibilityBtnText = visibilityBtn.querySelector('span');
        const visibilityItems = visibilityMenu.querySelectorAll('.visibility-item');

        const visibilityIcons = {
            public: 'fas fa-globe',
            unlisted: 'fas fa-eye-slash',
            private: 'fas fa-lock'
        };

        visibilityBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = visibilityMenu.style.display === 'none';
            // Hide other menus
            const modelMenu = document.querySelector('#model-selector-menu');
            if (modelMenu) modelMenu.style.display = 'none';
            const abilitiesMenu = document.querySelector('#advanced-abilities-menu');
            if (abilitiesMenu) abilitiesMenu.style.display = 'none';
            
            visibilityMenu.style.display = isHidden ? 'flex' : 'none';
        });

        document.addEventListener('click', (event) => {
            if (!visibilityContainer.contains(event.target)) {
                visibilityMenu.style.display = 'none';
            }
        });

        visibilityItems.forEach(item => {
            item.addEventListener('click', () => {
                const currentActive = visibilityMenu.querySelector('.visibility-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                item.classList.add('active');

                const newVisibility = item.dataset.visibility;

                // Update button UI
                if (visibilityBtnIcon) {
                    visibilityBtnIcon.className = visibilityIcons[newVisibility];
                }
                if (visibilityBtnText) {
                    visibilityBtnText.textContent = item.querySelector('.visibility-name').textContent;
                }

                // Close menu
                visibilityMenu.style.display = 'none';

                console.log(`Project visibility changed to: ${newVisibility}`);
            });
        });
    }
});
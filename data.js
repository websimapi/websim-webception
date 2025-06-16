let creator = null;

export function setGlobalCreator(creatorInfo) {
    creator = creatorInfo;
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

// --- Project Feed ---

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

export async function loadProjectFeed(user) {
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
    const userId = user ? user.id : null;

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
            hasMore = false; 
        } finally {
            isLoading = false;
            if(hasMore) {
               loader.style.display = 'none';
            }
        }
    }

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = mainContentEl;
        if (scrollTop + clientHeight >= scrollHeight - 500) {
            fetchAndRenderProjects();
        }
    }

    await fetchAndRenderProjects();
    mainContentEl.addEventListener('scroll', handleScroll);
}


// --- Sidebar Project History ---

function createHistoryItemElement({ project_revision, site }) {
    const li = document.createElement('li');
    li.className = 'sidebar-history-item';
    li.dataset.versionId = project_revision.id;

    const currentProject = window.websim.currentProjectState;
    const version = project_revision.version || '??';
    const promptText = site?.prompt?.text || 'Project version created';
    const model = site?.model;

    const isCurrentVersion = currentProject && project_revision.version == currentProject.current_version;

    const views = '13k', likes = '+69', dislikes = '-2'; 
    const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.com/v1/site/${site.id}/600` : '');
    const altText = site?.prompt?.text ? `Thumbnail for: ${site.prompt.text.substring(0, 50)}...` : 'Project version thumbnail';

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
            <div class="history-prompt-text">${promptText}</div>
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
        </div>`;
    
    const img = li.querySelector('.history-item-avatar img');
    const avatarContainer = img.parentElement;
    const setFailedState = () => {
        if (avatarContainer) {
            img.remove();
            avatarContainer.classList.add('loading-failed');
        }
    };
    img.onerror = setFailedState;
    if (!thumbnailUrl) setFailedState();
    
    return li;
}

export async function loadProjectHistory(projectId, options = {}) {
    const { refresh = false } = options;
    const historyList = document.querySelector('.sidebar-history-list');
    if (!historyList) return;
    const sidebarContent = historyList.parentElement;

    if (!loadProjectHistory.state || loadProjectHistory.state.projectId !== projectId) {
        historyList.innerHTML = '';
        sidebarContent.scrollTop = 0;
        loadProjectHistory.state = { projectId, isLoading: false, isRefreshing: false, nextCursor: null, hasMore: true, limit: 25 };
        
        if (!sidebarContent.dataset.historyListener) {
            sidebarContent.addEventListener('scroll', () => {
                const state = loadProjectHistory.state;
                if (sidebarContent.scrollTop < 200 && state && !state.isLoading && state.hasMore) {
                    loadProjectHistory(state.projectId);
                }
            });
            sidebarContent.dataset.historyListener = 'true';
        }
    }
    
    const state = loadProjectHistory.state;

    if (refresh) {
        if (state.isRefreshing) return;
        state.isRefreshing = true;
        try {
            const projectResponse = await fetch(`/api/v1/projects/${projectId}`);
            if (projectResponse.ok) {
                const { project } = await projectResponse.json();
                window.websim.currentProjectState = project;
            }

            const url = new URL(`/api/v1/projects/${projectId}/revisions`, window.location.origin);
            url.searchParams.set('first', state.limit);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const { revisions } = await response.json();

            if (!revisions.data || revisions.data.length === 0) return;

            const newestIdInDOM = historyList.firstChild?.dataset.versionId;
            const newItemsData = [];
            for (const item of revisions.data) {
                if (newestIdInDOM && item.project_revision.id === newestIdInDOM) break;
                newItemsData.push(item);
            }
            newItemsData.reverse().forEach(item => historyList.insertBefore(createHistoryItemElement(item), historyList.firstChild));

            revisions.data.forEach(({ project_revision, site }) => {
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
                            newImg.onerror = () => newImg.parentElement?.classList.add('loading-failed');
                            avatarContainer.appendChild(newImg);
                        }
                    }
                }
            });
            
            historyList.querySelectorAll('.sidebar-history-item').forEach(li => {
                if (!li.dataset.versionId) return; 
                const versionTag = li.querySelector('.history-version-tag');
                if(!versionTag) return;
                const versionSpan = versionTag.querySelector('span');
                const version = versionSpan?.textContent?.replace('V', '');
                const currentProject = window.websim.currentProjectState;
                const isCurrent = version && currentProject && version == currentProject.current_version;
                const hasBookmark = !!versionTag.querySelector('.fa-bookmark');
                versionTag.classList.toggle('is-old-version', !isCurrent);
                if (isCurrent && !hasBookmark) versionSpan?.insertAdjacentHTML('afterend', ' <i class="far fa-bookmark"></i>');
                else if (!isCurrent && hasBookmark) versionTag.querySelector('.fa-bookmark')?.remove();
            });
        } catch (error) {
            console.error("Failed to refresh project history:", error);
        } finally {
            if(state) state.isRefreshing = false;
        }
        return;
    }

    if (state.isLoading || !state.hasMore || state.isRefreshing) return;
    state.isLoading = true;
    
    const isInitialLoad = !state.nextCursor;
    if (isInitialLoad && historyList.children.length === 0) {
        historyList.innerHTML = '<li class="sidebar-history-item" style="padding-left: 20px;">Loading history...</li>';
    }

    try {
        const url = new URL(`/api/v1/projects/${projectId}/revisions`, window.location.origin);
        url.searchParams.set('first', state.limit);
        if (state.nextCursor) url.searchParams.set('after', state.nextCursor);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const { revisions } = await response.json();

        if (isInitialLoad) historyList.innerHTML = '';

        if (!revisions.data || revisions.data.length === 0) {
            if (isInitialLoad) historyList.innerHTML = '<li class="sidebar-history-item" style="padding-left: 20px;">No history found.</li>';
            state.hasMore = false;
            return;
        }
        
        const oldScrollHeight = sidebarContent.scrollHeight;
        revisions.data.forEach(item => {
            if (!historyList.querySelector(`[data-version-id="${item.project_revision.id}"]`)) {
                historyList.appendChild(createHistoryItemElement(item));
            }
        });

        state.hasMore = revisions.meta.has_next_page;
        state.nextCursor = revisions.meta.end_cursor;

        if (isInitialLoad) setTimeout(() => sidebarContent.scrollTop = sidebarContent.scrollHeight, 0);
        else sidebarContent.scrollTop += sidebarContent.scrollHeight - oldScrollHeight;
    } catch (error) {
        console.error("Failed to fetch project history:", error);
        if (isInitialLoad) historyList.innerHTML = '<li class="sidebar-history-item" style="padding-left: 20px;">Failed to load history.</li>';
    } finally {
        if(state) state.isLoading = false;
    }
}

// --- Sidebar Creator Projects ---

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
        </div>`;
    return item;
}

function getRelativeDateGroup(dateString) {
    const date = new Date(dateString), now = new Date();
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

export async function loadCreatorProjects(filter = 'all', query = '') {
    const container = document.getElementById('projects-list-container');
    if (!creator || !creator.username) {
        if(container) container.innerHTML = `<p style="padding: 16px;">Could not load creator's projects.</p>`;
        return;
    }

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
            const aIndex = groupOrder.indexOf(a), bIndex = groupOrder.indexOf(b);
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
            groupedProjects[groupName].forEach(item => container.appendChild(createCreatorProjectItem(item)));
        }
    } catch (error) {
        console.error("Failed to load creator projects:", error);
        container.innerHTML = `<p style="padding: 16px;">Failed to load projects.</p>`;
    }
}
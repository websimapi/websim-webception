import { timeAgo, getRelativeDateGroup } from './utils.js';

export async function fetchProjectHistory(projectId, options = {}) {
    const { limit = 25, cursor = null } = options;
    
    const url = new URL(`/api/v1/projects/${projectId}/revisions`, window.location.origin);
    url.searchParams.set('first', limit);
    if (cursor) {
        url.searchParams.set('after', cursor);
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json();
}

export async function fetchProjectDetails(projectId) {
    const response = await fetch(`/api/v1/projects/${projectId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json();
}

export async function fetchCreatorProjects(creator, filter = 'all', query = '', limit = 50) {
    if (!creator || !creator.username) {
        throw new Error("Creator info not available.");
    }

    const url = new URL(`/api/v1/users/${creator.username}/projects`, window.location.origin);
    url.searchParams.set('first', limit);
    url.searchParams.set('sort_by', 'updated_at');
    
    if (filter === 'posted') url.searchParams.set('posted', 'true');
    else if (filter === 'liked') url.searchParams.set('liked_by_owner', 'true');
    
    if (query) url.searchParams.set('query', query);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
}

export async function fetchProjectFeed(user, offset = 0, limit = 24) {
    const url = new URL('/api/v1/feed/trending', window.location.origin);
    url.searchParams.set('limit', limit);
    url.searchParams.set('offset', offset);
    url.searchParams.set('feed', 'hot_desktop');
    url.searchParams.set('range', 'all');
    if (user && user.id) {
        url.searchParams.set('for_user_id', user.id);
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json();
}

export function createProjectCard({ project, site }) {
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

export function createHistoryItemElement({ project_revision, site }, currentProject) {
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

export function createCreatorProjectItem({ project, site }) {
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
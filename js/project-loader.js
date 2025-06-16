import { fetchProjectFeed, createProjectCard } from './api-service.js';

export async function initializeProjectLoader(user) {
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

    async function fetchAndRenderProjects() {
        if (isLoading || !hasMore) return;
        isLoading = true;
        loader.style.display = 'block';

        try {
            const { feed } = await fetchProjectFeed(user, offset, limit);
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

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = mainContentEl;
        if (scrollTop + clientHeight >= scrollHeight - 500) {
            fetchAndRenderProjects();
        }
    }

    // Initialize
    await fetchAndRenderProjects();
    mainContentEl.addEventListener('scroll', handleScroll);
}
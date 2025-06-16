import { fetchCreatorProjects, createCreatorProjectItem } from './api-service.js';
import { getRelativeDateGroup } from './utils.js';

class ProjectsManager {
    constructor() {
        this.creator = null;
        this.isLoaded = false;
        this.setupEventListeners();
    }

    setCreator(creator) {
        this.creator = creator;
    }

    setupEventListeners() {
        document.addEventListener('projectsViewOpened', () => {
            if (!this.isLoaded) {
                this.loadCreatorProjects();
                this.isLoaded = true;
            }
        });

        // Setup filters and search
        const projectsViewContainer = document.getElementById('projects-view');
        if (projectsViewContainer) {
            this.setupFiltersAndSearch(projectsViewContainer);
        }
    }

    setupFiltersAndSearch(container) {
        const filterBtns = container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const query = container.querySelector('input').value;
                this.loadCreatorProjects(filter, query);
            });
        });

        const searchInput = container.querySelector('input');
        let searchTimeout;
        searchInput.addEventListener('keyup', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value;
                const activeFilter = container.querySelector('.filter-btn.active').dataset.filter;
                this.loadCreatorProjects(activeFilter, query);
            }, 300);
        });
    }

    async loadCreatorProjects(filter = 'all', query = '') {
        if (!this.creator || !this.creator.username) {
            console.error("Creator info not available.");
            const container = document.getElementById('projects-list-container');
            if(container) container.innerHTML = `<p style="padding: 16px;">Could not load creator's projects.</p>`;
            return;
        }

        const container = document.getElementById('projects-list-container');
        container.innerHTML = `<p style="padding: 16px;">Loading projects...</p>`;

        try {
            const { projects } = await fetchCreatorProjects(this.creator, filter, query);

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
}

export const projectsManager = new ProjectsManager();
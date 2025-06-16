import { initUI, setProjectTitle, setProjectDescription, setBranchStat } from './ui.js';
import { loadProjectFeed, loadProjectHistory, loadCreatorProjects, setGlobalCreator } from './data.js';

document.addEventListener('DOMContentLoaded', async function() {
    initUI({
        onProjectsViewClick: () => {
             // load projects if not loaded yet
            const projectsView = document.getElementById('projects-view');
            if (projectsView && !projectsView.dataset.loaded) {
                loadCreatorProjects();
                projectsView.dataset.loaded = 'true';
            }
        },
        onSidebarOpen: () => {
            const state = window.websim.currentProjectState;
            if (state && state.id) {
                loadProjectHistory(state.id, { refresh: true });
            }
        },
        onProjectsFilterChange: (filter, query) => {
            loadCreatorProjects(filter, query);
        },
        onProjectsSearch: (filter, query) => {
            loadCreatorProjects(filter, query);
        }
    });

    const isPuppeteer = navigator.webdriver;
    let userForFeed = null;
    window.websim.currentProjectState = null;

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
            setGlobalCreator(creatorInfo); // Set for data.js
            if (creatorInfo && creatorInfo.username) {
                if (sidebarAvatarImg) {
                    sidebarAvatarImg.src = `https://images.websim.com/avatar/${creatorInfo.username}`;
                    sidebarAvatarImg.alt = `${creatorInfo.username}'s avatar`;
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
            setGlobalCreator(creatorInfo); // Set for data.js

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

            if (creatorInfo && creatorInfo.username) {
                if (sidebarAvatarImg) {
                    sidebarAvatarImg.src = `https://images.websim.com/avatar/${creatorInfo.username}`;
                    sidebarAvatarImg.alt = `${creatorInfo.username}'s avatar`;
                }
            } else {
                 if (sidebarAvatarImg) sidebarAvatarImg.alt = 'Creator Avatar';
            }

        } catch (error) {
            console.error('Error loading user data:', error);
            if (addressAvatarImg) addressAvatarImg.alt = 'User Avatar';
            if (sidebarAvatarImg) sidebarAvatarImg.alt = 'Creator Avatar';
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
                    window.websim.currentProjectState = project;
                } else {
                    console.error(`Failed to fetch full project details: ${response.status}. Using summary.`);
                    window.websim.currentProjectState = { ...projectSummary, current_version: null }; // Fallback
                }
            } catch (e) {
                console.error('Error fetching full project details. Using summary.', e);
                window.websim.currentProjectState = { ...projectSummary, current_version: null }; // Fallback
            }
            
            const project = window.websim.currentProjectState;
            setProjectTitle(project.title);
            setBranchStat(project.current_version);
            setProjectDescription(project.description);
            loadProjectHistory(project.id);

        } else {
            setProjectTitle(document.title || "Project Details");
        }
    } catch (error) {
        console.error('Error loading project data:', error);
        setProjectTitle(document.title || "Project Details");
    }

    loadProjectFeed(userForFeed);
});
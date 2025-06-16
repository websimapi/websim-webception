import { setupSidebarToggle, setupSidebarTabs, setupProjectDescription, setupChatInput, setupAddressBar } from './js/ui-handlers.js';
import { setupModelSelector, setupAdvancedAbilities, setupVisibilitySelector, setupDropdownCloseOnClickOutside } from './js/dropdown-handlers.js';
import { initializeProjectLoader } from './js/project-loader.js';
import { historyManager } from './js/history-manager.js';
import { projectsManager } from './js/projects-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI handlers
    setupSidebarToggle();
    setupSidebarTabs();
    setupProjectDescription();
    setupChatInput();
    setupAddressBar();
    
    // Initialize dropdown handlers
    setupModelSelector();
    setupAdvancedAbilities();
    setupVisibilitySelector();
    setupDropdownCloseOnClickOutside();

    // Initialize main application
    main();
});

async function main() {
    const isPuppeteer = navigator.webdriver;
    let userForFeed = null;
    let currentProject = null;
    let creator = null;

    const addressAvatarImg = document.getElementById('userAvatarAddressBar');
    const sidebarAvatarImg = document.getElementById('sidebarUserAvatarIcon');
    const sidebarProjectTitle = document.getElementById('sidebarProjectTitle');
    const descriptionP = document.getElementById('sidebarProjectDescription');

    if (isPuppeteer) {
        console.log("Puppeteer environment detected.");
        userForFeed = { username: 'api', id: null };
        
        if (addressAvatarImg) {
            addressAvatarImg.src = '/image.png';
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

    // Load project-specific data
    try {
        const projectSummary = await window.websim.getCurrentProject();
        
        if (projectSummary && projectSummary.id) {
            try {
                const response = await fetch(`/api/v1/projects/${projectSummary.id}`);
                if (response.ok) {
                    const { project } = await response.json();
                    currentProject = project;
                    // Make available globally for compatibility
                    window.currentProject = currentProject;
                } else {
                    console.error(`Failed to fetch full project details: ${response.status}. Using summary.`);
                    currentProject = { ...projectSummary, current_version: null };
                    window.currentProject = currentProject;
                }
            } catch (e) {
                console.error('Error fetching full project details. Using summary.', e);
                currentProject = { ...projectSummary, current_version: null };
                window.currentProject = currentProject;
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

            historyManager.loadProjectHistory(currentProject.id);

        } else if (sidebarProjectTitle) {
            sidebarProjectTitle.textContent = document.title || "Project Details";
        }
    } catch (error) {
        console.error('Error loading project data:', error);
        if (sidebarProjectTitle) {
            sidebarProjectTitle.textContent = document.title || "Project Details";
        }
    }

    // Initialize managers
    projectsManager.setCreator(creator);
    initializeProjectLoader(userForFeed);
}
const ICONS = {
    open: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path><path d="m10 15-3-3 3-3"></path></svg>`,
    closeSidebar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
};

function initSidebarToggle(onSidebarOpen) {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainHeaderLogoWrapper = document.getElementById('mainHeaderLogoWrapper');
    const sidebar = document.getElementById('sidebar');
    const sidebarInternalControls = document.getElementById('sidebarInternalControls');
    const sidebarInternalCloseBtn = document.getElementById('sidebarInternalCloseBtn');

    if (sidebarToggle) {
        sidebarToggle.innerHTML = ICONS.open;
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('hidden');
            if (onSidebarOpen) {
                onSidebarOpen();
            }
            if (mainHeaderLogoWrapper) mainHeaderLogoWrapper.style.display = 'none';
            if (sidebarInternalControls) {
                sidebarInternalControls.style.display = 'inline-flex';
                if (sidebarInternalCloseBtn) {
                    sidebarInternalCloseBtn.innerHTML = ICONS.closeSidebar;
                }
            }
        });
    }

    if (sidebarInternalCloseBtn) {
        sidebarInternalCloseBtn.addEventListener('click', function() {
            sidebar.classList.add('hidden');
            if (sidebarInternalControls) sidebarInternalControls.style.display = 'none';
            if (mainHeaderLogoWrapper) mainHeaderLogoWrapper.style.display = 'inline-flex';
        });
    }
}

function initSidebarViewSwitching(onProjectsViewClick) {
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
            if(onProjectsViewClick) onProjectsViewClick();
        });
    }
}

function initProjectDescriptionEditor() {
    const descriptionP = document.getElementById('sidebarProjectDescription');
    const descriptionTextarea = document.getElementById('sidebarProjectDescriptionInput');

    if (!descriptionP || !descriptionTextarea) return;

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

        setProjectDescription(newText);
    });

    descriptionTextarea.addEventListener('input', () => {
        descriptionTextarea.style.height = 'auto';
        descriptionTextarea.style.height = (descriptionTextarea.scrollHeight) + 'px';

        if (descriptionTextarea.value.length > descriptionTextarea.maxLength) {
            descriptionTextarea.value = descriptionTextarea.value.slice(0, descriptionTextarea.maxLength);
        }
    });
}

function initChatInput() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });
    }
}

function initPopups() {
    const popups = {
        model: {
            container: document.querySelector('.model-selector-container'),
            btn: document.querySelector('.model-selector-btn'),
            menu: document.querySelector('#model-selector-menu'),
        },
        abilities: {
            container: document.querySelector('.abilities-container'),
            btn: document.querySelector('.attachment-btn'),
            menu: document.querySelector('#advanced-abilities-menu'),
        },
        visibility: {
            container: document.querySelector('.visibility-selector-container'),
            btn: document.querySelector('.visibility-btn'),
            menu: document.querySelector('#visibility-selector-menu'),
        },
    };

    function closeAllPopups() {
        Object.values(popups).forEach(p => {
            if (p.menu) p.menu.style.display = 'none';
        });
        // Reset model selector icon specifically
        const modelSelectorBtnIcon = popups.model.btn?.querySelector('i');
        if (modelSelectorBtnIcon) modelSelectorBtnIcon.style.transform = 'rotate(0deg)';
    }

    Object.values(popups).forEach(popup => {
        if (!popup.container || !popup.btn || !popup.menu) return;

        popup.btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = popup.menu.style.display === 'none' || !popup.menu.style.display;
            
            closeAllPopups();

            if(isHidden) {
                popup.menu.style.display = popup.menu.id === 'advanced-abilities-menu' ? 'flex' : 'block';
                 if (popup.btn.classList.contains('model-selector-btn')) {
                    const icon = popup.btn.querySelector('i');
                    if(icon) icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });

    document.addEventListener('click', (event) => {
        let clickedInside = false;
        Object.values(popups).forEach(p => {
            if (p.container && p.container.contains(event.target)) {
                clickedInside = true;
            }
        });
        if (!clickedInside) {
            closeAllPopups();
        }
    });

    // Model Selector specific logic
    if (popups.model.menu) {
        const modelItems = popups.model.menu.querySelectorAll('.model-item');
        const modelSelectorBtnText = popups.model.btn.querySelector('span');
        modelItems.forEach(item => {
            item.addEventListener('click', () => {
                const currentActive = popups.model.menu.querySelector('.model-item.active');
                if (currentActive) currentActive.classList.remove('active');
                item.classList.add('active');
                if (modelSelectorBtnText) modelSelectorBtnText.textContent = item.dataset.modelName;
                closeAllPopups();
                console.log(`Model changed to: ${item.dataset.modelName}`);
            });
        });
    }

    // Abilities specific logic
    if(popups.abilities.menu) {
        const abilitiesBadge = popups.abilities.btn.querySelector('.badge');
        const checkboxes = popups.abilities.menu.querySelectorAll('input[type="checkbox"]');
        const abilitiesWarning = document.getElementById('abilities-warning');

        const updateAbilitiesUI = () => {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            if (abilitiesBadge) {
                abilitiesBadge.textContent = checkedCount;
                abilitiesBadge.style.display = checkedCount > 0 ? 'flex' : 'none';
            }
            if (abilitiesWarning) {
                abilitiesWarning.style.display = checkedCount >= 3 ? 'block' : 'none';
            }
        };

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateAbilitiesUI();
                const abilityName = checkbox.nextElementSibling.querySelector('.ability-title').textContent;
                console.log(`Ability '${abilityName}' is now ${checkbox.checked ? 'enabled' : 'disabled'}`);
            });
        });
        updateAbilitiesUI();
    }
    
    // Visibility specific logic
    if (popups.visibility.menu) {
        const visibilityItems = popups.visibility.menu.querySelectorAll('.visibility-item');
        const visibilityBtnIcon = popups.visibility.btn.querySelector('i');
        const visibilityBtnText = popups.visibility.btn.querySelector('span');
        const visibilityIcons = { public: 'fas fa-globe', unlisted: 'fas fa-eye-slash', private: 'fas fa-lock' };

        visibilityItems.forEach(item => {
            item.addEventListener('click', () => {
                popups.visibility.menu.querySelector('.visibility-item.active')?.classList.remove('active');
                item.classList.add('active');
                const newVisibility = item.dataset.visibility;
                if (visibilityBtnIcon) visibilityBtnIcon.className = visibilityIcons[newVisibility];
                if (visibilityBtnText) visibilityBtnText.textContent = item.querySelector('.visibility-name').textContent;
                closeAllPopups();
                console.log(`Project visibility changed to: ${newVisibility}`);
            });
        });
    }
}

function initMisc() {
    const urlInput = document.querySelector('.url-input');
    const refreshBtn = document.querySelector('.refresh-btn');

    function handleUrlSubmit() {
        const prompt = urlInput.value.trim();
        if (prompt) {
            console.log('Generating simulation for:', prompt);
        }
    }

    if (refreshBtn) refreshBtn.addEventListener('click', handleUrlSubmit);
    if (urlInput) urlInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUrlSubmit();
        }
    });
}

function initProjectsViewControls({ onProjectsFilterChange, onProjectsSearch }) {
    const projectsViewContainer = document.getElementById('projects-view');
    if (!projectsViewContainer) return;

    const filterBtns = projectsViewContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const query = projectsViewContainer.querySelector('input').value;
            onProjectsFilterChange(filter, query);
        });
    });

    const searchInput = projectsViewContainer.querySelector('input');
    let searchTimeout;
    searchInput.addEventListener('keyup', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value;
            const activeFilter = projectsViewContainer.querySelector('.filter-btn.active').dataset.filter;
            onProjectsSearch(activeFilter, query);
        }, 300);
    });
}

export function setProjectTitle(title) {
    const sidebarProjectTitle = document.getElementById('sidebarProjectTitle');
    if (sidebarProjectTitle) {
        sidebarProjectTitle.textContent = title || "Project Details";
    }
}

export function setProjectDescription(description) {
    const descriptionP = document.getElementById('sidebarProjectDescription');
    if (!descriptionP) return;

    if (!description) {
        descriptionP.textContent = 'Add a description...';
        descriptionP.classList.add('is-placeholder');
        delete descriptionP.dataset.fullText;
    } else {
        descriptionP.dataset.fullText = description;
        descriptionP.classList.remove('is-placeholder');
        descriptionP.textContent = description.length > 100 ? description.substring(0, 100) + '...' : description;
    }
}

export function setBranchStat(version) {
    const branchStatValue = document.getElementById('branch-stat-value');
    if (branchStatValue && version != null) {
        branchStatValue.textContent = version;
    }
}

export function initUI(callbacks) {
    initSidebarToggle(callbacks.onSidebarOpen);
    initSidebarViewSwitching(callbacks.onProjectsViewClick);
    initProjectDescriptionEditor();
    initChatInput();
    initPopups();
    initMisc();
    initProjectsViewControls({
        onProjectsFilterChange: callbacks.onProjectsFilterChange,
        onProjectsSearch: callbacks.onProjectsSearch,
    });
}
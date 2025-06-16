export function setupModelSelector() {
    const modelSelectorContainer = document.querySelector('.model-selector-container');
    if (!modelSelectorContainer) return;

    const modelSelectorBtn = modelSelectorContainer.querySelector('.model-selector-btn');
    const modelSelectorMenu = modelSelectorContainer.querySelector('#model-selector-menu');
    const modelSelectorBtnText = modelSelectorBtn.querySelector('span');
    const modelSelectorBtnIcon = modelSelectorBtn.querySelector('i');
    const modelItems = modelSelectorMenu.querySelectorAll('.model-item');

    modelSelectorBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = modelSelectorMenu.style.display === 'none';

        // Close other popups
        closeAllDropdowns(['model-selector-menu']);

        modelSelectorMenu.style.display = isHidden ? 'flex' : 'none';
        
        if (modelSelectorBtnIcon) {
            modelSelectorBtnIcon.style.transition = 'transform 0.2s ease-in-out';
            modelSelectorBtnIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
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

export function setupAdvancedAbilities() {
    const abilitiesContainer = document.querySelector('.abilities-container');
    if (!abilitiesContainer) return;

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
        
        // Close other popups
        closeAllDropdowns(['advanced-abilities-menu']);

        abilitiesMenu.style.display = isHidden ? 'flex' : 'none';
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

export function setupVisibilitySelector() {
    const visibilityContainer = document.querySelector('.visibility-selector-container');
    if (!visibilityContainer) return;

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

        // Close other popups
        closeAllDropdowns(['visibility-selector-menu']);
        
        visibilityMenu.style.display = isHidden ? 'flex' : 'none';
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

function closeAllDropdowns(except = []) {
    const dropdowns = [
        { menu: document.querySelector('#model-selector-menu'), icon: document.querySelector('.model-selector-btn i') },
        { menu: document.querySelector('#advanced-abilities-menu'), icon: null },
        { menu: document.querySelector('#visibility-selector-menu'), icon: null }
    ];

    dropdowns.forEach(({ menu, icon }, index) => {
        const menuIds = ['model-selector-menu', 'advanced-abilities-menu', 'visibility-selector-menu'];
        if (menu && !except.includes(menuIds[index])) {
            menu.style.display = 'none';
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    });
}

export function setupDropdownCloseOnClickOutside() {
    document.addEventListener('click', (event) => {
        const modelContainer = document.querySelector('.model-selector-container');
        const abilitiesContainer = document.querySelector('.abilities-container');
        const visibilityContainer = document.querySelector('.visibility-selector-container');

        let shouldCloseAll = true;

        if (modelContainer && modelContainer.contains(event.target)) {
            shouldCloseAll = false;
        }
        if (abilitiesContainer && abilitiesContainer.contains(event.target)) {
            shouldCloseAll = false;
        }
        if (visibilityContainer && visibilityContainer.contains(event.target)) {
            shouldCloseAll = false;
        }

        if (shouldCloseAll) {
            closeAllDropdowns();
        }
    });
}
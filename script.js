document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        
        // Update icon based on sidebar state
        const icon = sidebarToggle.querySelector('i');
        if (sidebar.classList.contains('hidden')) {
            icon.className = 'fas fa-bars';
        } else {
            icon.className = 'fas fa-times';
        }
    });
    
    // Handle URL input
    const urlInput = document.querySelector('.url-input');
    const goBtn = document.querySelector('.go-btn');
    
    function handleUrlSubmit() {
        const prompt = urlInput.value.trim();
        if (prompt) {
            console.log('Generating simulation for:', prompt);
            // TODO: Implement simulation generation
        }
    }
    
    goBtn.addEventListener('click', handleUrlSubmit);
    
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
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
    
    // Add click handlers for sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = item.querySelector('h5').textContent;
            console.log('Opening sidebar item:', title);
            // TODO: Implement sidebar item opening
        });
    });
});


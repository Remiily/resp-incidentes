// Additional Features: Thumbnails, Search, Theme, PDF Export

// Thumbnail Navigation
function initializeThumbnails() {
    const thumbnailBtn = document.getElementById('thumbnailBtn');
    const thumbnailNav = document.getElementById('thumbnailNav');
    const closeThumbnails = document.getElementById('closeThumbnails');
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    
    if (!thumbnailBtn || !thumbnailNav) return;
    
    // Generate thumbnails
    function generateThumbnails() {
        const slides = document.querySelectorAll('.slide');
        thumbnailGrid.innerHTML = '';
        
        slides.forEach((slide, index) => {
            const slideNum = index + 1;
            const slideTitle = slide.querySelector('.slide-title')?.textContent || `Slide ${slideNum}`;
            
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-item';
            thumbnail.dataset.slide = slideNum;
            thumbnail.innerHTML = `
                <div class="thumbnail-number">${slideNum}</div>
                <div class="thumbnail-title">${slideTitle.substring(0, 30)}${slideTitle.length > 30 ? '...' : ''}</div>
            `;
            
            thumbnail.addEventListener('click', () => {
                if (typeof goToSlide === 'function') {
                    goToSlide(slideNum);
                    closeThumbnailNav();
                }
            });
            
            thumbnailGrid.appendChild(thumbnail);
        });
    }
    
    function openThumbnailNav() {
        thumbnailNav.classList.add('active');
        generateThumbnails();
        updateActiveThumbnail();
    }
    
    function closeThumbnailNav() {
        thumbnailNav.classList.remove('active');
    }
    
    function updateActiveThumbnail() {
        const currentSlide = document.querySelector('.slide.active');
        if (!currentSlide) return;
        
        const currentSlideNum = parseInt(currentSlide.getAttribute('data-slide') || '1');
        const thumbnails = thumbnailGrid.querySelectorAll('.thumbnail-item');
        
        thumbnails.forEach(thumb => {
            thumb.classList.toggle('active', parseInt(thumb.dataset.slide) === currentSlideNum);
        });
    }
    
    thumbnailBtn.addEventListener('click', openThumbnailNav);
    closeThumbnails.addEventListener('click', closeThumbnailNav);
    thumbnailNav.addEventListener('click', (e) => {
        if (e.target === thumbnailNav) {
            closeThumbnailNav();
        }
    });
    
    // Update on slide change
    document.addEventListener('slideChanged', updateActiveThumbnail);
}

// Search Functionality
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const closeSearch = document.getElementById('closeSearch');
    
    if (!searchBtn || !searchModal) return;
    
    function openSearch() {
        searchModal.classList.add('active');
        searchInput.focus();
    }
    
    function closeSearchModal() {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = [];
        const slides = document.querySelectorAll('.slide');
        const searchTerm = query.toLowerCase();
        
        slides.forEach((slide, index) => {
            const slideNum = index + 1;
            const slideTitle = slide.querySelector('.slide-title')?.textContent || '';
            const slideContent = slide.textContent || '';
            
            if (slideContent.toLowerCase().includes(searchTerm)) {
                // Find matching text snippets
                const content = slideContent.toLowerCase();
                const matches = [];
                let startIndex = 0;
                
                while ((startIndex = content.indexOf(searchTerm, startIndex)) !== -1) {
                    const contextStart = Math.max(0, startIndex - 50);
                    const contextEnd = Math.min(content.length, startIndex + searchTerm.length + 50);
                    const snippet = slideContent.substring(contextStart, contextEnd);
                    matches.push({
                        snippet: snippet.trim(),
                        position: startIndex
                    });
                    startIndex += searchTerm.length;
                    if (matches.length >= 3) break; // Limit to 3 snippets per slide
                }
                
                results.push({
                    slideNum,
                    title: slideTitle,
                    matches: matches.slice(0, 3)
                });
            }
        });
        
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
            return;
        }
        
        searchResults.innerHTML = results.map(result => {
            const snippets = result.matches.map(m => {
                const highlighted = m.snippet.replace(
                    new RegExp(query, 'gi'),
                    match => `<mark>${match}</mark>`
                );
                return `<div class="search-snippet">${highlighted}</div>`;
            }).join('');
            
            return `
                <div class="search-result-item" data-slide="${result.slideNum}">
                    <div class="search-result-title">Slide ${result.slideNum}: ${result.title}</div>
                    ${snippets}
                </div>
            `;
        }).join('');
        
        // Add click handlers
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const slideNum = parseInt(item.dataset.slide);
                if (typeof goToSlide === 'function') {
                    goToSlide(slideNum);
                    closeSearchModal();
                }
            });
        });
    }
    
    searchBtn.addEventListener('click', openSearch);
    closeSearch.addEventListener('click', closeSearchModal);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearchModal();
        }
    });
    
    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            openSearch();
        }
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });
    
    // Search as you type
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

// Theme Toggle (Dark/Light)
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('presentation-theme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const theme = isLight ? 'light' : 'dark';
        localStorage.setItem('presentation-theme', theme);
        updateThemeIcon(theme);
    });
    
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            `;
        } else {
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            `;
        }
    }
}

// PDF Export
function initializePDFExport() {
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    
    if (!exportPdfBtn) return;
    
    exportPdfBtn.addEventListener('click', () => {
        // Use html2pdf library if available, otherwise show instructions
        if (typeof html2pdf !== 'undefined') {
            const element = document.body;
            const opt = {
                margin: 1,
                filename: 'Plan_Gestion_Incidentes_Cumplo.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            };
            
            html2pdf().set(opt).from(element).save();
        } else {
            // Fallback: Print dialog
            window.print();
        }
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initializeThumbnails();
    initializeSearch();
    initializeTheme();
    initializePDFExport();
    
    // Dispatch slide change event
    const originalGoToSlide = window.goToSlide;
    if (originalGoToSlide) {
        window.goToSlide = function(slideNumber) {
            originalGoToSlide(slideNumber);
            document.dispatchEvent(new CustomEvent('slideChanged', { 
                detail: { slideNumber } 
            }));
        };
    }
});

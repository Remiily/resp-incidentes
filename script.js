let currentSlide = 1;
let totalSlides = 0;
let isTransitioning = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalSlides = document.querySelectorAll('.slide').length;
    
    // Create progress bar if it doesn't exist
    if (!document.querySelector('.progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill" id="progressFill"></div>';
        document.body.appendChild(progressBar);
    }
    
    // Create navigation if it doesn't exist
    if (!document.querySelector('.navigation')) {
        const navigation = document.createElement('div');
        navigation.className = 'navigation';
        navigation.innerHTML = `
            <button class="nav-btn" id="prevBtn" aria-label="Slide anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <span class="slide-indicator">
                <span id="currentSlide">${currentSlide}</span> / <span id="totalSlides">${totalSlides}</span>
            </span>
            <button class="nav-btn" id="nextBtn" aria-label="Slide siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        `;
        document.body.appendChild(navigation);
    }
    
    // Initialize UI
    updateSlideIndicator();
    updateProgressBar();
    updateNavigationButtons();
    
    // Button event listeners
    document.getElementById('prevBtn').addEventListener('click', () => changeSlide(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changeSlide(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            changeSlide(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            changeSlide(-1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides);
        } else if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            toggleFullscreen();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (isTransitioning) return;
        
        const swipeThreshold = 50;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Horizontal swipe takes precedence
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
    
    // Mouse wheel navigation DISABLED - user requested
    // document.addEventListener('wheel', ...) - removed
    
    // Add entrance animation to first slide
    const firstSlide = document.querySelector('.slide[data-slide="1"]');
    if (firstSlide) {
        firstSlide.classList.add('active');
    }
    
    // Initialize interactive checkboxes
    initializeInteractiveCheckboxes();
    
    // Initialize interactive playbook steps
    initializePlaybookSteps();
    
    // Preload images and optimize performance
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            preloadSlides();
        });
    } else {
        setTimeout(preloadSlides, 100);
    }
});

// Interactive Checkboxes
function initializeInteractiveCheckboxes() {
    const checkboxes = document.querySelectorAll('.interactive-checkbox');
    
    checkboxes.forEach(checkbox => {
        const checkBtn = checkbox.querySelector('.check-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCheckbox(checkbox);
            });
        }
        
        // Also toggle on item click (but not on edit)
        checkbox.addEventListener('click', (e) => {
            if (!e.target.classList.contains('editable') && !e.target.closest('.editable')) {
                if (e.target !== checkBtn && !e.target.closest('.check-btn')) {
                    toggleCheckbox(checkbox);
                }
            }
        });
    });
}

function toggleCheckbox(checkbox) {
    const isChecked = checkbox.getAttribute('data-checked') === 'true';
    checkbox.setAttribute('data-checked', !isChecked);
    checkbox.classList.toggle('checked', !isChecked);
    
    // Update triage chart if it exists
    if (typeof updateTriageChart === 'function') {
        updateTriageChart();
    }
}

// Interactive Playbook Steps
function initializePlaybookSteps() {
    const steps = document.querySelectorAll('.interactive-step');
    
    steps.forEach(step => {
        const toggleBtn = step.querySelector('.step-toggle');
        const stepContent = step.querySelector('.step-content');
        
        if (toggleBtn && stepContent) {
            // Initially collapse all steps except first
            const stepNum = parseInt(step.getAttribute('data-step') || '1');
            if (stepNum > 1) {
                stepContent.style.display = 'none';
                toggleBtn.textContent = '▶';
            }
            
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleStep(step, stepContent, toggleBtn);
            });
        }
    });
}

function toggleStep(step, stepContent, toggleBtn) {
    const isExpanded = stepContent.style.display !== 'none';
    
    if (isExpanded) {
        stepContent.style.display = 'none';
        toggleBtn.textContent = '▶';
        step.classList.remove('expanded');
    } else {
        stepContent.style.display = 'block';
        toggleBtn.textContent = '▼';
        step.classList.add('expanded');
        
        // Smooth scroll to step if needed
        setTimeout(() => {
            step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

function changeSlide(direction) {
    if (isTransitioning) return;
    
    const newSlide = currentSlide + direction;
    
    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

function goToSlide(slideNumber) {
    if (isTransitioning || slideNumber === currentSlide) return;
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    isTransitioning = true;
    
    // Hide current slide
    const currentSlideElement = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
    }
    
    // Update current slide
    currentSlide = slideNumber;
    
    // Show new slide with slight delay for smooth transition
    setTimeout(() => {
        const newSlideElement = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
        if (newSlideElement) {
            newSlideElement.classList.add('active');
            
            // Animate cards on slide entry
            animateCardsOnEntry(newSlideElement);
        }
        
        // Update UI
        updateSlideIndicator();
        updateProgressBar();
        updateNavigationButtons();
        
        // Update charts if they exist
        if (typeof updateCharts === 'function') {
            setTimeout(updateCharts, 200);
        }
        
        // Scroll to top (for mobile)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        isTransitioning = false;
    }, 100);
}

function animateCardsOnEntry(slideElement) {
    const cards = slideElement.querySelectorAll('.glass-card, .content-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function updateSlideIndicator() {
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    if (currentSlideEl) {
        currentSlideEl.textContent = currentSlide;
    }
    if (totalSlidesEl) {
        totalSlidesEl.textContent = totalSlides;
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = (currentSlide / totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
        prevBtn.style.opacity = currentSlide === 1 ? '0.4' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
        nextBtn.style.opacity = currentSlide === totalSlides ? '0.4' : '1';
    }
}

// Auto-play functionality (optional, disabled by default)
let autoPlayInterval = null;
let autoPlayPaused = false;

function startAutoPlay(interval = 15000) {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
    
    autoPlayInterval = setInterval(() => {
        if (!autoPlayPaused && !isTransitioning) {
            if (currentSlide < totalSlides) {
                changeSlide(1);
            } else {
                goToSlide(1); // Loop back to start
            }
        }
    }, interval);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function pauseAutoPlay() {
    autoPlayPaused = true;
}

function resumeAutoPlay() {
    autoPlayPaused = false;
}

// Pause auto-play on user interaction
document.addEventListener('keydown', () => {
    pauseAutoPlay();
    stopAutoPlay();
});
document.addEventListener('click', () => {
    pauseAutoPlay();
    stopAutoPlay();
});
document.addEventListener('touchstart', () => {
    pauseAutoPlay();
    stopAutoPlay();
});

// Fullscreen support
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Add fullscreen toggle on double-click (optional)
document.addEventListener('dblclick', (e) => {
    // Only toggle if not clicking on interactive elements
    if (!e.target.closest('button') && !e.target.closest('a')) {
        toggleFullscreen();
    }
});

// Preload slides for better performance
function preloadSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index > 2) { // Preload slides after the first 3
            // Force browser to render hidden slides
            const tempDisplay = slide.style.display;
            slide.style.display = 'none';
            slide.offsetHeight; // Trigger reflow
            slide.style.display = tempDisplay;
        }
    });
}

// Performance optimization: Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observe all slides
    document.querySelectorAll('.slide').forEach(slide => {
        observer.observe(slide);
    });
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate layout if needed
        updateProgressBar();
    }, 250);
});

// Add visual feedback for navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const navBtn = e.key === 'ArrowRight' 
            ? document.getElementById('nextBtn')
            : document.getElementById('prevBtn');
        
        if (navBtn && !navBtn.disabled) {
            navBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                navBtn.style.transform = '';
            }, 150);
        }
    }
});

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        changeSlide,
        goToSlide,
        startAutoPlay,
        stopAutoPlay,
        toggleFullscreen
    };
}

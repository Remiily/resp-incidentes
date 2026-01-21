// Performance Optimization Script
(function() {
    'use strict';
    
    // Throttle function for performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimize animations - reduce motion for better performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
    }
    
    // Lazy load charts - only initialize when slide is visible
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const canvas = entry.target;
                const chartId = canvas.id;
                
                // Initialize chart if not already initialized
                if (chartId && typeof window.initializeCharts === 'function') {
                    setTimeout(() => {
                        if (typeof window.chartInstances === 'undefined' || !window.chartInstances[chartId]) {
                            // Chart will be initialized by charts.js
                        }
                    }, 100);
                }
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });
    
    // Observe all chart canvases
    document.addEventListener('DOMContentLoaded', () => {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            chartObserver.observe(canvas);
        });
    });
    
    // Optimize scroll performance - Enhanced
    let ticking = false;
    function updateOnScroll() {
        // Scroll-based updates here
        ticking = false;
    }
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });
    
    // Optimize Q&A and Anexos menu animations
    const optimizeMenuAnimations = () => {
        const qaAnswers = document.querySelectorAll('.qa-answer');
        const anexoContents = document.querySelectorAll('.anexo-content');
        
        qaAnswers.forEach(answer => {
            if (!answer.classList.contains('expanded')) {
                answer.style.willChange = 'auto';
            } else {
                answer.style.willChange = 'max-height, opacity';
            }
        });
        
        anexoContents.forEach(content => {
            if (!content.classList.contains('expanded')) {
                content.style.willChange = 'auto';
            } else {
                content.style.willChange = 'max-height, opacity';
            }
        });
    };
    
    // Observe menu changes
    const menuObserver = new MutationObserver(() => {
        optimizeMenuAnimations();
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const qaMenu = document.getElementById('qaMenu');
        const anexosMenu = document.getElementById('anexosMenu');
        
        if (qaMenu) {
            menuObserver.observe(qaMenu, {
                attributes: true,
                attributeFilter: ['class'],
                subtree: true
            });
        }
        
        if (anexosMenu) {
            menuObserver.observe(anexosMenu, {
                attributes: true,
                attributeFilter: ['class'],
                subtree: true
            });
        }
        
        optimizeMenuAnimations();
    });
    
    // Optimize resize performance
    const optimizedResize = debounce(() => {
        // Resize-based updates
        if (typeof window.updateCharts === 'function') {
            window.updateCharts();
        }
    }, 250);
    
    window.addEventListener('resize', optimizedResize, { passive: true });
    
    // Preload next slide content
    function preloadNextSlide() {
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return;
        
        const currentSlideNum = parseInt(activeSlide.getAttribute('data-slide') || '1');
        const nextSlide = document.querySelector(`.slide[data-slide="${currentSlideNum + 1}"]`);
        
        if (nextSlide) {
            // Preload images and heavy content
            const images = nextSlide.querySelectorAll('img');
            images.forEach(img => {
                if (img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }
    
    // Call preload when slide changes
    document.addEventListener('slideChanged', preloadNextSlide);
    
    // Optimize CSS animations - use will-change strategically
    const optimizeAnimations = () => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            if (slide.classList.contains('active')) {
                slide.style.willChange = 'transform, opacity';
            } else {
                slide.style.willChange = 'auto';
            }
        });
    };
    
    // Monitor performance
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Log long tasks for debugging
                    if (entry.entryType === 'measure' && entry.duration > 50) {
                        console.warn('Long task detected:', entry.name, entry.duration + 'ms');
                    }
                }
            });
            
            perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
            // Performance Observer not supported
        }
    }
    
    // Export functions
    window.performanceOptimizations = {
        throttle,
        debounce,
        optimizeAnimations,
        optimizeMenuAnimations
    };
    
    // Run optimizations
    document.addEventListener('DOMContentLoaded', () => {
        optimizeAnimations();
        
        // Re-optimize on slide change
        const observer = new MutationObserver(() => {
            optimizeAnimations();
        });
        
        const container = document.querySelector('.presentation-container');
        if (container) {
            observer.observe(container, {
                attributes: true,
                attributeFilter: ['class'],
                subtree: true
            });
        }
    });
})();

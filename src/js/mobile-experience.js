/**
 * GeneralISOL Mobile Experience JavaScript
 * Enhanced mobile interactions, navigation, and performance
 * Version: 2.0.0
 * Last Updated: 2026-01-29
 */

(function() {
    'use strict';

    // ==========================================================================
    // 1. MOBILE NAVIGATION
    // ==========================================================================

    class MobileNavigation {
        constructor() {
            this.menuBtn = document.querySelector('.mobile-menu-btn');
            this.mobileMenu = document.querySelector('.mobile-menu');
            this.overlay = document.querySelector('.mobile-menu-overlay');
            this.nav = document.querySelector('nav');
            this.navLinks = document.querySelectorAll('.mobile-menu .nav-link');
            this.isOpen = false;
            
            this.init();
        }

        init() {
            if (!this.menuBtn) return;
            
            // Toggle menu on button click
            this.menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });

            // Close menu when clicking overlay
            if (this.overlay) {
                this.overlay.addEventListener('click', () => this.close());
            }

            // Close menu when clicking a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => this.close(), 150);
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Close menu on resize to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 769 && this.isOpen) {
                    this.close();
                }
            });

            // Handle scroll state
            this.handleScroll();
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.isOpen = true;
            this.menuBtn.classList.add('active');
            this.menuBtn.setAttribute('aria-expanded', 'true');
            
            if (this.mobileMenu) {
                this.mobileMenu.classList.add('active');
            }
            
            if (this.overlay) {
                this.overlay.classList.add('active');
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        }

        close() {
            this.isOpen = false;
            this.menuBtn.classList.remove('active');
            this.menuBtn.setAttribute('aria-expanded', 'false');
            
            if (this.mobileMenu) {
                this.mobileMenu.classList.remove('active');
            }
            
            if (this.overlay) {
                this.overlay.classList.remove('active');
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        handleScroll() {
            if (this.nav) {
                if (window.scrollY > 50) {
                    this.nav.classList.add('scrolled');
                } else {
                    this.nav.classList.remove('scrolled');
                }
            }
        }
    }

    // ==========================================================================
    // 2. TOUCH FEEDBACK ENHANCEMENT
    // ==========================================================================

    class TouchFeedback {
        constructor() {
            this.init();
        }

        init() {
            // Add touch feedback to interactive elements
            const touchables = document.querySelectorAll(
                'a, button, [role="button"], .card, .service-card, .touchable'
            );

            touchables.forEach(el => {
                el.addEventListener('touchstart', () => {
                    el.classList.add('touch-active');
                }, { passive: true });

                el.addEventListener('touchend', () => {
                    setTimeout(() => {
                        el.classList.remove('touch-active');
                    }, 150);
                }, { passive: true });

                el.addEventListener('touchcancel', () => {
                    el.classList.remove('touch-active');
                }, { passive: true });
            });
        }
    }

    // ==========================================================================
    // 3. SMOOTH SCROLL ENHANCEMENT
    // ==========================================================================

    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            // Handle anchor links with smooth scroll
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        
                        const navHeight = document.querySelector('nav')?.offsetHeight || 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }

    // ==========================================================================
    // 4. LAZY LOADING IMAGES
    // ==========================================================================

    class LazyImages {
        constructor() {
            this.init();
        }

        init() {
            // Use native lazy loading with fallback
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            if ('loading' in HTMLImageElement.prototype) {
                // Native lazy loading supported
                images.forEach(img => {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                });
            } else {
                // Fallback with Intersection Observer
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                images.forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }
    }

    // ==========================================================================
    // 5. FORM ENHANCEMENT
    // ==========================================================================

    class FormEnhancement {
        constructor() {
            this.init();
        }

        init() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Add floating labels
                const inputs = form.querySelectorAll('input, textarea, select');
                
                inputs.forEach(input => {
                    // Check initial state
                    if (input.value) {
                        input.classList.add('has-value');
                    }
                    
                    // Handle focus/blur
                    input.addEventListener('focus', () => {
                        input.parentElement?.classList.add('focused');
                    });
                    
                    input.addEventListener('blur', () => {
                        input.parentElement?.classList.remove('focused');
                        if (input.value) {
                            input.classList.add('has-value');
                        } else {
                            input.classList.remove('has-value');
                        }
                    });
                    
                    // Prevent zoom on iOS
                    if (input.type !== 'checkbox' && input.type !== 'radio') {
                        input.style.fontSize = '16px';
                    }
                });
            });
        }
    }

    // ==========================================================================
    // 6. SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================================================

    class ScrollAnimations {
        constructor() {
            this.init();
        }

        init() {
            // Only animate if user hasn't requested reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            const animatedElements = document.querySelectorAll(
                '.animate-on-scroll, .card, .service-card, .feature-card, section > .container > *:first-child'
            );

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
        }
    }

    // ==========================================================================
    // 7. PERFORMANCE MONITORING
    // ==========================================================================

    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            // Report performance metrics
            if ('PerformanceObserver' in window) {
                // Largest Contentful Paint
                try {
                    new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('[Performance] LCP:', lastEntry.renderTime || lastEntry.loadTime);
                    }).observe({ type: 'largest-contentful-paint', buffered: true });
                } catch (e) {}

                // First Input Delay
                try {
                    new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        entries.forEach(entry => {
                            console.log('[Performance] FID:', entry.processingStart - entry.startTime);
                        });
                    }).observe({ type: 'first-input', buffered: true });
                } catch (e) {}

                // Cumulative Layout Shift
                try {
                    let clsValue = 0;
                    new PerformanceObserver((entryList) => {
                        for (const entry of entryList.getEntries()) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        }
                        console.log('[Performance] CLS:', clsValue);
                    }).observe({ type: 'layout-shift', buffered: true });
                } catch (e) {}
            }
        }
    }

    // ==========================================================================
    // 8. VIEWPORT HEIGHT FIX (iOS Safari)
    // ==========================================================================

    class ViewportFix {
        constructor() {
            this.init();
        }

        init() {
            // Fix for 100vh on mobile browsers
            const setVH = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };

            setVH();
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', () => {
                setTimeout(setVH, 100);
            });
        }
    }

    // ==========================================================================
    // 9. ACTIVE NAV LINK HIGHLIGHTING
    // ==========================================================================

    class ActiveNavHighlight {
        constructor() {
            this.init();
        }

        init() {
            // Set active class on current page nav link
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const linkPath = href.split('/').pop();
                    const currentFile = currentPath.split('/').pop() || 'index.html';
                    
                    if (linkPath === currentFile || 
                        (linkPath === 'index.html' && (currentFile === '' || currentFile === 'index.html'))) {
                        link.classList.add('active');
                    }
                }
            });
        }
    }

    // ==========================================================================
    // 10. CLICK-TO-CALL/EMAIL ENHANCEMENT
    // ==========================================================================

    class ContactLinks {
        constructor() {
            this.init();
        }

        init() {
            // Enhance phone and email links for mobile
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            
            phoneLinks.forEach(link => {
                link.setAttribute('aria-label', 'Anrufen: ' + link.textContent);
            });
            
            emailLinks.forEach(link => {
                link.setAttribute('aria-label', 'E-Mail an: ' + link.textContent);
            });
        }
    }

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    // Initialize all modules when DOM is ready
    const initMobileExperience = () => {
        new MobileNavigation();
        new TouchFeedback();
        new SmoothScroll();
        new LazyImages();
        new FormEnhancement();
        new ScrollAnimations();
        new PerformanceMonitor();
        new ViewportFix();
        new ActiveNavHighlight();
        new ContactLinks();
        
        console.log('[MobileExperience] All modules initialized');
    };

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileExperience);
    } else {
        initMobileExperience();
    }

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .touch-active {
            opacity: 0.7 !important;
            transform: scale(0.98) !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);

})();

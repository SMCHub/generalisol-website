/**
 * Performance & UI Enhancement Script
 * GeneralISOL Website - Optimized for Core Web Vitals
 */

(function() {
    'use strict';

    // ========================================
    // 1. INTERSECTION OBSERVER - Lazy Loading & Animations
    // ========================================

    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    // Lazy load images and animate elements on scroll
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // Lazy load images
                if (target.dataset.src) {
                    target.src = target.dataset.src;
                    target.removeAttribute('data-src');
                }

                // Add animation class
                if (target.classList.contains('animate-on-scroll')) {
                    target.classList.add('animated');
                }

                observer.unobserve(target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements that need lazy loading or animation
    document.addEventListener('DOMContentLoaded', () => {
        // Observe images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));

        // Observe elements for scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    });

    // ========================================
    // 2. SCROLL TO TOP BUTTON
    // ========================================

    const createScrollToTopButton = () => {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Zurück nach oben');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
        `;

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(button);

        // Show/hide button based on scroll position
        const toggleButton = () => {
            if (window.scrollY > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleButton, { passive: true });
    };

    // ========================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    };

    // ========================================
    // 4. PREFETCH VISIBLE LINKS
    // ========================================

    const prefetchVisibleLinks = () => {
        const prefetchLink = (url) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        };

        const linkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    const href = link.href;

                    if (href && href.startsWith(window.location.origin) && !href.includes('#')) {
                        prefetchLink(href);
                        linkObserver.unobserve(link);
                    }
                }
            });
        }, { rootMargin: '100px' });

        document.querySelectorAll('a[href]').forEach(link => {
            linkObserver.observe(link);
        });
    };

    // ========================================
    // 5. ENHANCED MOBILE MENU WITH FOCUS TRAP
    // ========================================

    const enhanceMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (!menuBtn || !mobileMenu) return;

        // Add ARIA attributes
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Menü öffnen');
        mobileMenu.setAttribute('aria-hidden', 'true');

        // Get focusable elements
        const getFocusableElements = () => {
            return mobileMenu.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
        };

        const trapFocus = (e) => {
            if (!mobileMenu.classList.contains('active')) return;

            const focusableElements = getFocusableElements();
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }

            if (e.key === 'Escape') {
                menuBtn.click();
                menuBtn.focus();
            }
        };

        const updateMenuState = (isOpen) => {
            menuBtn.setAttribute('aria-expanded', isOpen.toString());
            menuBtn.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
            mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());

            if (isOpen) {
                document.addEventListener('keydown', trapFocus);
                // Focus first link in menu
                const firstLink = mobileMenu.querySelector('a');
                if (firstLink) setTimeout(() => firstLink.focus(), 100);
            } else {
                document.removeEventListener('keydown', trapFocus);
            }
        };

        // Override existing click handler
        const originalClickHandler = menuBtn.onclick;
        menuBtn.onclick = function(e) {
            if (originalClickHandler) originalClickHandler.call(this, e);
            const isOpen = mobileMenu.classList.contains('active');
            updateMenuState(isOpen);
        };
    };

    // ========================================
    // 6. SERVICE CARDS MICRO-INTERACTIONS
    // ========================================

    const enhanceServiceCards = () => {
        const cards = document.querySelectorAll('.service-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.setProperty('--hover-intensity', '1');
            });

            card.addEventListener('mouseleave', function() {
                this.style.setProperty('--hover-intensity', '0');
            });

            // Add ripple effect on click
            card.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';

                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    // ========================================
    // 7. PERFORMANCE MONITORING
    // ========================================

    const logWebVitals = () => {
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('[LCP]', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log('[FID]', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                        console.log('[CLS]', clsScore);
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    };

    // ========================================
    // INITIALIZE ALL ENHANCEMENTS
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        createScrollToTopButton();
        initSmoothScroll();
        prefetchVisibleLinks();
        enhanceMobileMenu();
        enhanceServiceCards();

        // Only log vitals in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logWebVitals();
        }
    }
})();

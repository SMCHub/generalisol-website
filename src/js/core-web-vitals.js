/**
 * CORE WEB VITALS OPTIMIZATION SCRIPT
 * GeneralISOL Website - Performance First
 *
 * Optimizes:
 * - LCP (Largest Contentful Paint) < 2.5s
 * - FID (First Input Delay) < 100ms
 * - CLS (Cumulative Layout Shift) < 0.1
 * - INP (Interaction to Next Paint) < 200ms
 * - TTFB (Time to First Byte) < 800ms
 */

(function() {
    'use strict';

    // ========================================
    // 1. INSTANT PAGE LOADING - Prefetch on Hover
    // ========================================

    const instantPage = () => {
        const prefetchedLinks = new Set();
        let prefetchTimeout;

        const prefetch = (url) => {
            if (prefetchedLinks.has(url)) return;

            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = 'document';
            document.head.appendChild(link);

            prefetchedLinks.add(url);
        };

        // Prefetch on mouseenter (faster than click)
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;

            const url = link.href;

            // Only prefetch same-origin links
            if (url.startsWith(window.location.origin) && !url.includes('#')) {
                clearTimeout(prefetchTimeout);
                prefetchTimeout = setTimeout(() => prefetch(url), 100);
            }
        }, { passive: true });

        // Also prefetch on touchstart for mobile
        document.addEventListener('touchstart', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;

            const url = link.href;
            if (url.startsWith(window.location.origin) && !url.includes('#')) {
                prefetch(url);
            }
        }, { passive: true });
    };

    // ========================================
    // 2. CRITICAL IMAGE OPTIMIZATION
    // ========================================

    const optimizeImages = () => {
        // Prioritize hero images
        const heroImages = document.querySelectorAll('.hero img, .hero-image');
        heroImages.forEach(img => {
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('decoding', 'sync'); // Don't defer hero images
        });

        // Lazy load below-fold images with native API
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        // Fallback for browsers without native lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            return;
        }

        // Fallback: Intersection Observer
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before entering viewport
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    };

    // ========================================
    // 3. DEBOUNCED SCROLL HANDLER
    // ========================================

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Use requestAnimationFrame for smooth 60fps scrolling
    const rafThrottle = (func) => {
        let rafId = null;
        return function(...args) {
            if (rafId === null) {
                rafId = requestAnimationFrame(() => {
                    func.apply(this, args);
                    rafId = null;
                });
            }
        };
    };

    // ========================================
    // 4. PREVENT LAYOUT SHIFT (CLS)
    // ========================================

    const preventLayoutShift = () => {
        // Reserve space for images without dimensions
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            if (img.complete) {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;
            } else {
                img.addEventListener('load', function() {
                    this.width = this.naturalWidth;
                    this.height = this.naturalHeight;
                }, { once: true });
            }
        });

        // Prevent CLS from web fonts
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    };

    // ========================================
    // 5. REDUCE JAVASCRIPT EXECUTION TIME
    // ========================================

    // Split heavy work into chunks
    const runInChunks = (items, processItem, callback) => {
        const chunks = [];
        const chunkSize = 10; // Process 10 items at a time

        for (let i = 0; i < items.length; i += chunkSize) {
            chunks.push(items.slice(i, i + chunkSize));
        }

        const processChunk = (index) => {
            if (index >= chunks.length) {
                if (callback) callback();
                return;
            }

            requestIdleCallback(() => {
                chunks[index].forEach(processItem);
                processChunk(index + 1);
            }, { timeout: 1000 });
        };

        processChunk(0);
    };

    // ========================================
    // 6. OPTIMIZE EVENT LISTENERS
    // ========================================

    const optimizeEventListeners = () => {
        // Use passive listeners for scroll/touch events
        const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];

        passiveEvents.forEach(eventType => {
            // Override addEventListener for these events
            const original = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (passiveEvents.includes(type) && typeof options !== 'object') {
                    options = { passive: true };
                }
                return original.call(this, type, listener, options);
            };
        });
    };

    // ========================================
    // 7. WEBP IMAGE DETECTION & REPLACEMENT
    // ========================================

    const modernImageFormats = () => {
        // Check WebP support
        const checkWebPSupport = () => {
            return new Promise((resolve) => {
                const webP = new Image();
                webP.onload = webP.onerror = () => {
                    resolve(webP.height === 2);
                };
                webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            });
        };

        checkWebPSupport().then(supported => {
            if (supported) {
                document.documentElement.classList.add('webp');
            } else {
                document.documentElement.classList.add('no-webp');
            }
        });
    };

    // ========================================
    // 8. FIRST INPUT DELAY (FID) OPTIMIZATION
    // ========================================

    const optimizeFID = () => {
        // Break up long tasks
        const longTasks = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    console.warn('[Long Task]', entry.duration + 'ms', entry);
                }
            }
        });

        if ('PerformanceObserver' in window) {
            try {
                longTasks.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // longtask not supported
            }
        }

        // Input responsiveness - debounce expensive operations
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const originalHandler = input.oninput;
            if (originalHandler) {
                input.oninput = debounce(originalHandler, 300);
            }
        });
    };

    // ========================================
    // 9. RESOURCE LOADING PRIORITIZATION
    // ========================================

    const prioritizeResources = () => {
        // Load critical CSS first
        const criticalCSS = document.querySelector('link[href*="critical"]');
        if (criticalCSS) {
            criticalCSS.setAttribute('rel', 'preload');
            criticalCSS.setAttribute('as', 'style');
        }

        // Defer non-critical CSS
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([href*="critical"])');
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });

        // Preconnect to external domains
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    };

    // ========================================
    // 10. CACHE STATIC ASSETS
    // ========================================

    const cacheStaticAssets = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    registration => {
                        console.log('[Service Worker] Registered:', registration);
                    },
                    error => {
                        console.log('[Service Worker] Registration failed:', error);
                    }
                );
            });
        }
    };

    // ========================================
    // 11. MEASURE CORE WEB VITALS
    // ========================================

    const measureWebVitals = () => {
        if (!('PerformanceObserver' in window)) return;

        // Largest Contentful Paint (LCP)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                const lcp = lastEntry.renderTime || lastEntry.loadTime;

                console.log('[LCP]', lcp.toFixed(2) + 'ms', lastEntry.element);

                if (lcp > 2500) {
                    console.warn('[LCP] Poor - Target: < 2500ms');
                } else if (lcp > 4000) {
                    console.error('[LCP] Needs Improvement');
                } else {
                    console.log('[LCP] Good ✓');
                }
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            console.warn('[LCP] Not supported');
        }

        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    const fid = entry.processingStart - entry.startTime;
                    console.log('[FID]', fid.toFixed(2) + 'ms');

                    if (fid > 100) {
                        console.warn('[FID] Needs Improvement - Target: < 100ms');
                    } else {
                        console.log('[FID] Good ✓');
                    }
                });
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.warn('[FID] Not supported');
        }

        // Cumulative Layout Shift (CLS)
        try {
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });

                console.log('[CLS]', clsScore.toFixed(3));

                if (clsScore > 0.1) {
                    console.warn('[CLS] Needs Improvement - Target: < 0.1');
                } else {
                    console.log('[CLS] Good ✓');
                }
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            console.warn('[CLS] Not supported');
        }

        // Interaction to Next Paint (INP)
        try {
            const inpObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    const inp = entry.processingStart - entry.startTime;
                    console.log('[INP]', inp.toFixed(2) + 'ms');

                    if (inp > 200) {
                        console.warn('[INP] Needs Improvement - Target: < 200ms');
                    } else {
                        console.log('[INP] Good ✓');
                    }
                });
            });
            inpObserver.observe({ type: 'event', buffered: true });
        } catch (e) {
            // INP not widely supported yet
        }
    };

    // ========================================
    // INITIALIZE ALL OPTIMIZATIONS
    // ========================================

    const init = () => {
        // Run immediately
        preventLayoutShift();
        optimizeImages();
        modernImageFormats();
        optimizeEventListeners();

        // Run when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                instantPage();
                prioritizeResources();
                optimizeFID();
            });
        } else {
            instantPage();
            prioritizeResources();
            optimizeFID();
        }

        // Run on window load
        window.addEventListener('load', () => {
            cacheStaticAssets();

            // Only measure vitals in development
            if (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.search.includes('debug=true')) {
                measureWebVitals();
            }
        });
    };

    // Start optimization
    init();

    // Export for testing
    window.PerformanceOptimizer = {
        instantPage,
        optimizeImages,
        preventLayoutShift,
        measureWebVitals
    };

})();

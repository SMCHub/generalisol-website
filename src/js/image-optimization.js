/**
 * Advanced Image Optimization
 * WebP support detection, lazy loading, responsive images
 */

(function() {
    'use strict';

    // ========================================
    // 1. WEBP SUPPORT DETECTION
    // ========================================

    const supportsWebP = () => {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    };

    // ========================================
    // 2. NATIVE LAZY LOADING FALLBACK
    // ========================================

    const addNativeLazyLoading = () => {
        // Add loading="lazy" to all images without it
        const images = document.querySelectorAll('img:not([loading])');

        images.forEach(img => {
            // Skip above-fold images (first 2 images)
            const rect = img.getBoundingClientRect();
            const isAboveFold = rect.top < window.innerHeight;

            if (!isAboveFold) {
                img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
            } else {
                // Prioritize above-fold images
                img.setAttribute('fetchpriority', 'high');
            }
        });
    };

    // ========================================
    // 3. RESPONSIVE IMAGES WITH SRCSET
    // ========================================

    const enhanceResponsiveImages = () => {
        const images = document.querySelectorAll('img[data-sizes]');

        images.forEach(img => {
            const sizes = img.getAttribute('data-sizes');
            if (sizes) {
                img.setAttribute('sizes', sizes);
            }
        });
    };

    // ========================================
    // 4. PROGRESSIVE IMAGE LOADING
    // ========================================

    const loadProgressiveImages = () => {
        const progressiveImages = document.querySelectorAll('img[data-src-low]');

        progressiveImages.forEach(img => {
            // Load low-quality placeholder first
            const lowSrc = img.getAttribute('data-src-low');
            const highSrc = img.getAttribute('data-src') || img.src;

            if (lowSrc) {
                img.src = lowSrc;
                img.classList.add('loading-progressive');

                // Load high-quality image
                const highImg = new Image();
                highImg.onload = () => {
                    img.src = highSrc;
                    img.classList.remove('loading-progressive');
                    img.classList.add('loaded-progressive');
                };
                highImg.src = highSrc;
            }
        });
    };

    // ========================================
    // 5. IMAGE ERROR HANDLING
    // ========================================

    const addImageErrorHandling = () => {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            img.addEventListener('error', function() {
                if (!this.classList.contains('image-error')) {
                    this.classList.add('image-error');

                    // Try fallback if available
                    const fallback = this.getAttribute('data-fallback');
                    if (fallback && this.src !== fallback) {
                        this.src = fallback;
                    } else {
                        // Show placeholder
                        this.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                        this.style.minHeight = '200px';
                        this.alt = this.alt || 'Bild konnte nicht geladen werden';
                    }

                    console.warn('[Image Error]', this.src);
                }
            });
        });
    };

    // ========================================
    // 6. IMAGE PERFORMANCE METRICS
    // ========================================

    const trackImagePerformance = () => {
        if ('PerformanceObserver' in window) {
            const imageObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.initiatorType === 'img') {
                        const duration = entry.responseEnd - entry.startTime;
                        const size = entry.transferSize;

                        if (duration > 1000 || size > 100000) {
                            console.warn('[Slow Image]', {
                                url: entry.name,
                                duration: `${duration.toFixed(0)}ms`,
                                size: `${(size / 1024).toFixed(1)}KB`
                            });
                        }
                    }
                });
            });

            imageObserver.observe({ entryTypes: ['resource'] });
        }
    };

    // ========================================
    // 7. ASPECT RATIO PRESERVATION (CLS Prevention)
    // ========================================

    const preserveAspectRatios = () => {
        const images = document.querySelectorAll('img[width][height]');

        images.forEach(img => {
            const width = img.getAttribute('width');
            const height = img.getAttribute('height');

            if (width && height) {
                const aspectRatio = (height / width) * 100;
                img.style.aspectRatio = `${width} / ${height}`;

                // Fallback for older browsers
                if (!CSS.supports('aspect-ratio', '1')) {
                    const wrapper = img.parentElement;
                    if (!wrapper.classList.contains('img-wrapper')) {
                        const div = document.createElement('div');
                        div.className = 'img-wrapper';
                        div.style.paddingBottom = `${aspectRatio}%`;
                        div.style.position = 'relative';
                        div.style.overflow = 'hidden';

                        img.style.position = 'absolute';
                        img.style.top = '0';
                        img.style.left = '0';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';

                        wrapper.insertBefore(div, img);
                        div.appendChild(img);
                    }
                }
            }
        });
    };

    // ========================================
    // INITIALIZE ALL OPTIMIZATIONS
    // ========================================

    const init = async () => {
        // Check WebP support
        const webpSupported = await supportsWebP();
        if (webpSupported) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }

        // Apply all optimizations
        addNativeLazyLoading();
        enhanceResponsiveImages();
        loadProgressiveImages();
        addImageErrorHandling();
        preserveAspectRatios();

        // Track performance only in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            trackImagePerformance();
        }

        console.log('[Image Optimization] Initialized with WebP support:', webpSupported);
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * ADVANCED UI/UX INTERACTIONS
 * GeneralISOL Website - Premium User Experience
 *
 * Features:
 * - Magnetic cursor effects
 * - Parallax scrolling
 * - Number counter animations
 * - Card tilt effects
 * - Smooth page transitions
 */

(function() {
    'use strict';

    // ========================================
    // 1. MAGNETIC CURSOR EFFECT
    // ========================================

    const magneticElements = () => {
        const buttons = document.querySelectorAll('.cta-button, .magnetic-button');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Magnetic pull effect (limited to 10px)
                const moveX = x * 0.2;
                const moveY = y * 0.2;

                button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    };

    // ========================================
    // 2. PARALLAX SCROLL EFFECT
    // ========================================

    const parallaxScroll = () => {
        const parallaxElements = document.querySelectorAll('.parallax-slow');

        if (parallaxElements.length === 0) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // ========================================
    // 3. NUMBER COUNTER ANIMATION
    // ========================================

    const animateNumbers = () => {
        const counters = document.querySelectorAll('.counter');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target || counter.textContent);
                    const duration = parseInt(counter.dataset.duration || 2000);
                    const start = parseInt(counter.dataset.start || 0);

                    animateValue(counter, start, target, duration);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    };

    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = Math.round(end);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    };

    // ========================================
    // 4. 3D CARD TILT EFFECT
    // ========================================

    const cardTiltEffect = () => {
        const cards = document.querySelectorAll('.service-card, .feature-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

                // Update gradient position for spotlight effect
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                card.style.setProperty('--mouse-x', percentX + '%');
                card.style.setProperty('--mouse-y', percentY + '%');
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };

    // ========================================
    // 5. SMOOTH SCROLL WITH OFFSET
    // ========================================

    const smoothScrollWithOffset = () => {
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
                        const offset = 80; // Navigation height
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    };

    // ========================================
    // 6. INTERSECTION OBSERVER - FADE IN
    // ========================================

    const fadeInOnScroll = () => {
        const elements = document.querySelectorAll('.stagger-animation, .fade-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => observer.observe(element));
    };

    // ========================================
    // 7. TYPEWRITER EFFECT
    // ========================================

    const typewriterEffect = (element, text, speed = 100) => {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    };

    // Initialize typewriter on elements with .typewriter class
    const initTypewriter = () => {
        const typewriterElements = document.querySelectorAll('.typewriter');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.dataset.text || element.textContent;
                    const speed = parseInt(element.dataset.speed || 100);

                    typewriterEffect(element, text, speed);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        typewriterElements.forEach(element => observer.observe(element));
    };

    // ========================================
    // 8. CURSOR TRAIL EFFECT
    // ========================================

    const cursorTrail = () => {
        const coords = { x: 0, y: 0 };
        const circles = [];
        const colors = ['#1e40af', '#3b82f6', '#60a5fa'];

        // Create cursor trail circles
        for (let i = 0; i < 12; i++) {
            const circle = document.createElement('div');
            circle.className = 'cursor-circle';
            circle.style.cssText = `
                position: fixed;
                width: 12px;
                height: 12px;
                background: ${colors[i % colors.length]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i * 0.08};
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease-out;
            `;
            document.body.appendChild(circle);
            circles.push(circle);
        }

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            coords.x = e.clientX;
            coords.y = e.clientY;
        });

        // Animate trail
        const animateCircles = () => {
            let x = coords.x;
            let y = coords.y;

            circles.forEach((circle, index) => {
                circle.style.left = x + 'px';
                circle.style.top = y + 'px';

                const nextCircle = circles[index + 1] || circles[0];
                x += (parseInt(nextCircle.style.left) - x) * 0.3;
                y += (parseInt(nextCircle.style.top) - y) * 0.3;
            });

            requestAnimationFrame(animateCircles);
        };

        animateCircles();
    };

    // ========================================
    // 9. REVEAL ON SCROLL - SECTIONS
    // ========================================

    const revealSections = () => {
        const sections = document.querySelectorAll('section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, {
            threshold: 0.15
        });

        sections.forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });
    };

    // ========================================
    // 10. NAVBAR COLOR CHANGE ON SCROLL
    // ========================================

    const navbarScrollEffect = () => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // ========================================
    // 11. LAZY LOAD BACKGROUND IMAGES
    // ========================================

    const lazyBackgrounds = () => {
        const bgElements = document.querySelectorAll('[data-bg]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.removeAttribute('data-bg');
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '100px'
        });

        bgElements.forEach(element => observer.observe(element));
    };

    // ========================================
    // 12. RIPPLE EFFECT ON CLICK
    // ========================================

    const addRippleEffect = () => {
        document.querySelectorAll('.ripple-enabled, .service-card, .cta-button').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    // ========================================
    // 13. SCROLL PROGRESS INDICATOR
    // ========================================

    const scrollProgress = () => {
        let progressBar = document.querySelector('.scroll-progress-bar');

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            document.body.appendChild(progressBar);
        }

        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    };

    // ========================================
    // 14. TOAST NOTIFICATIONS
    // ========================================

    const createToast = (message, type = 'info', duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };

    // Add toast animation styles
    const addToastStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // ========================================
    // 15. IMAGE ZOOM ON HOVER
    // ========================================

    const imageZoomEffect = () => {
        const images = document.querySelectorAll('.zoom-image');

        images.forEach(img => {
            img.style.transition = 'transform 0.4s ease';
            img.parentElement.style.overflow = 'hidden';

            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    };

    // ========================================
    // INITIALIZE ALL INTERACTIONS
    // ========================================

    const init = () => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            magneticElements();
            parallaxScroll();
            cardTiltEffect();
            fadeInOnScroll();
            initTypewriter();
            revealSections();
            navbarScrollEffect();
            scrollProgress();
            imageZoomEffect();
        }

        // Always enable these (they have reduced-motion fallbacks)
        animateNumbers();
        smoothScrollWithOffset();
        lazyBackgrounds();
        addRippleEffect();
        addToastStyles();

        // Optional: cursor trail (can be disabled for better performance)
        // cursorTrail();
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export utilities for external use
    window.UIEnhancements = {
        createToast,
        typewriterEffect,
        animateValue
    };

})();

/**
 * Oldenly Premium UI Effects Module
 * Modern, high-performance (60 FPS) visual animations & UX interactions.
 * Vanilla JavaScript - Zero heavy dependencies.
 */
(function (window, document) {
    'use strict';

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const Effects = {
        init: function () {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.boot());
            } else {
                this.boot();
            }
        },

        boot: function () {
            this.initScrollProgress();
            this.initSmartNavbar();
            this.initScrollReveal();
            this.initTypewriter();
            this.initAnimatedCounters();
            this.initRippleEffect();
            this.initButtonMicroInteractions();
            this.init3DTilt();
            this.initBackToTop();
            this.initCustomCursor();
            this.initHeroParticles();
            this.initParallax();
            this.initLazyLoading();
            this.initSmoothScroll();
            this.initGlassmorphismToast();
        }
    };

    window.Effects = Effects;
})(window, document);

    /* ------------------------------------------------------------------
       1. READING PROGRESS BAR
       ------------------------------------------------------------------ */
    Effects.initScrollProgress = function () {
        let progressBar = document.getElementById('reading-progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'reading-progress-bar';
            progressBar.className = 'reading-progress-bar';
            document.body.appendChild(progressBar);
        }

        let ticking = false;
        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
        updateProgress();
    };

    /* ------------------------------------------------------------------
       2. SMART NAVBAR (HIDE ON SCROLL DOWN, SHOW ON SCROLL UP)
       ------------------------------------------------------------------ */
    Effects.initSmartNavbar = function () {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Glass backdrop effect
            if (currentScrollY > 30) {
                header.classList.add('nav-scrolled');
            } else {
                header.classList.remove('nav-scrolled');
            }

            // Hide/Show on scroll
            if (currentScrollY > 150 && currentScrollY > lastScrollY + 5) {
                header.classList.add('nav-hidden');
            } else if (currentScrollY < lastScrollY - 5 || currentScrollY <= 80) {
                header.classList.remove('nav-hidden');
            }

            lastScrollY = Math.max(0, currentScrollY);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
        handleScroll();
    };

    /* ------------------------------------------------------------------
       3. ENHANCED SCROLL REVEAL (INTERSECTION OBSERVER)
       ------------------------------------------------------------------ */
    Effects.initScrollReveal = function () {
        if (prefersReducedMotion) {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
            return;
        }

        const revealElements = document.querySelectorAll(
            '.reveal, .why__card, .cat__card, .values__card, .student-card, .testimonial-card, .howto-card, .contact-card, .mission-vision__card'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.12
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach((el, index) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
            // Add automatic staggered delay if not explicitly set
            if (!el.className.includes('reveal-d')) {
                const staggerClass = `reveal-d${(index % 4) + 1}`;
                el.classList.add(staggerClass);
            }
            revealObserver.observe(el);
        });
    };

    /* ------------------------------------------------------------------
       4. TYPEWRITER EFFECT FOR HERO HEADINGS
       ------------------------------------------------------------------ */
    Effects.initTypewriter = function () {
        const typeTargets = document.querySelectorAll('[data-typing], .hero__h em');
        if (!typeTargets.length || prefersReducedMotion) return;

        typeTargets.forEach(target => {
            // Inspirational phrases for Oldenly
            const phrases = JSON.parse(
                target.dataset.typing || '["Honoring every voice", "Connecting generations", "Preserving lifelong wisdom", "Building warm communities"]'
            );

            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let currentText = '';

            target.classList.add('typewriter-text');

            const type = () => {
                const fullPhrase = phrases[phraseIndex];

                if (isDeleting) {
                    currentText = fullPhrase.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    currentText = fullPhrase.substring(0, charIndex + 1);
                    charIndex++;
                }

                target.textContent = currentText;

                let typingSpeed = isDeleting ? 40 : 80;

                if (!isDeleting && charIndex === fullPhrase.length) {
                    typingSpeed = 2200; // Pause at end
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 400; // Pause before next word
                }

                setTimeout(type, typingSpeed);
            };

            type();
        });
    };

    /* ------------------------------------------------------------------
       5. ANIMATED STAT COUNTERS
       ------------------------------------------------------------------ */
    Effects.initAnimatedCounters = function () {
        const counterElements = document.querySelectorAll('[data-counter], .stat-number, .count-up');
        if (!counterElements.length) return;

        const animateCounter = (el) => {
            const targetAttr = el.dataset.counter || el.dataset.target || el.textContent;
            const match = targetAttr.match(/([^\d]*)([\d,.]+)([^\d]*)/);
            if (!match) return;

            const prefix = match[1] || '';
            const rawNum = parseFloat(match[2].replace(/,/g, ''));
            const suffix = match[3] || '';
            const duration = parseInt(el.dataset.duration, 10) || 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out expo formula for smooth slowdown
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = Math.floor(easeProgress * rawNum);

                el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = `${prefix}${rawNum.toLocaleString()}${suffix}`;
                }
            };

            requestAnimationFrame(update);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterElements.forEach(el => counterObserver.observe(el));
    };

    /* ------------------------------------------------------------------
       6. RIPPLE EFFECT ON CLICK
       ------------------------------------------------------------------ */
    Effects.initRippleEffect = function () {
        const interactiveSelector = '.btn, .nav__signin, .nav__login, .theme-toggle, .accordion-toggle, .nav-user-trigger, .about__btn, .contact-form__submit, .ripple-effect';

        document.addEventListener('click', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (!target) return;

            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.className = 'ui-ripple';
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            target.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    };

    /* ------------------------------------------------------------------
       7. BUTTON MICRO-INTERACTIONS (MAGNETIC LIFT & GLOW)
       ------------------------------------------------------------------ */
    Effects.initButtonMicroInteractions = function () {
        if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;

        const buttons = document.querySelectorAll('.btn, .nav__signin, .nav__login, .about__btn, .contact-form__submit');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Subtle magnetic displacement
                btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0) scale(1.02)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
            });
        });
    };

    /* ------------------------------------------------------------------
       8. 3D CARD TILT EFFECT WITH SPECULAR LIGHT
       ------------------------------------------------------------------ */
    Effects.init3DTilt = function () {
        if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;

        const tiltCards = document.querySelectorAll(
            '.why__card, .cat__card, .student-card, .values__card, .contact-card, .howto-card, .mission-vision__card, .testimonial-card'
        );

        tiltCards.forEach(card => {
            card.classList.add('tilt-card');

            let innerGlow = card.querySelector('.tilt-glow');
            if (!innerGlow) {
                innerGlow = document.createElement('div');
                innerGlow.className = 'tilt-glow';
                card.appendChild(innerGlow);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
                innerGlow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                innerGlow.style.background = 'none';
            });
        });
    };

    /* ------------------------------------------------------------------
       9. BACK TO TOP BUTTON WITH CIRCULAR SCROLL PROGRESS RING
       ------------------------------------------------------------------ */
    Effects.initBackToTop = function () {
        let btn = document.getElementById('back-to-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'back-to-top';
            btn.className = 'back-to-top';
            btn.setAttribute('aria-label', 'Scroll back to top');
            btn.innerHTML = `
                <svg class="b2t-progress" width="48" height="48" viewBox="0 0 48 48">
                    <circle class="b2t-circle-bg" cx="24" cy="24" r="20" />
                    <circle class="b2t-circle-fill" cx="24" cy="24" r="20" />
                </svg>
                <span class="b2t-arrow">↑</span>
            `;
            document.body.appendChild(btn);
        }

        const circleFill = btn.querySelector('.b2t-circle-fill');
        const circumference = 2 * Math.PI * 20;

        if (circleFill) {
            circleFill.style.strokeDasharray = `${circumference}`;
            circleFill.style.strokeDashoffset = `${circumference}`;
        }

        const updateBackToTop = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            if (scrollTop > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }

            if (circleFill && docHeight > 0) {
                const scrollFraction = scrollTop / docHeight;
                const offset = circumference - scrollFraction * circumference;
                circleFill.style.strokeDashoffset = offset;
            }
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateBackToTop);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    /* ------------------------------------------------------------------
       10. ELEGANT CUSTOM CURSOR (DESKTOP ONLY)
       ------------------------------------------------------------------ */
    Effects.initCustomCursor = function () {
        if (prefersReducedMotion || window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

        let dot = document.querySelector('.custom-cursor-dot');
        let ring = document.querySelector('.custom-cursor-ring');

        if (!dot) {
            dot = document.createElement('div');
            dot.className = 'custom-cursor-dot';
            document.body.appendChild(dot);
        }

        if (!ring) {
            ring = document.createElement('div');
            ring.className = 'custom-cursor-ring';
            document.body.appendChild(ring);
        }

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }, { passive: true });

        const animateCursor = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            requestAnimationFrame(animateCursor);
        };

        requestAnimationFrame(animateCursor);

        // Hover scale on interactive elements
        const hoverTargets = 'a, button, input, select, textarea, .btn, .cat__card, .why__card, .interactive';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                ring.classList.add('cursor-hover');
                dot.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                ring.classList.remove('cursor-hover');
                dot.classList.remove('cursor-hover');
            }
        });
    };

    /* ------------------------------------------------------------------
       11. AMBIENT PARTICLES CANVAS (HERO SECTION)
       ------------------------------------------------------------------ */
    Effects.initHeroParticles = function () {
        const hero = document.querySelector('.hero, .volunteer-hero, .contact-hero');
        if (!hero || prefersReducedMotion) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'hero-particle-canvas';
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = hero.offsetWidth);
        let height = (canvas.height = hero.offsetHeight);

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 35), 32);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.35 + 0.15
            });
        }

        let isVisible = true;
        const heroObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        });
        heroObserver.observe(hero);

        window.addEventListener('resize', () => {
            width = canvas.width = hero.offsetWidth;
            height = canvas.height = hero.offsetHeight;
        });

        const render = () => {
            if (isVisible) {
                ctx.clearRect(0, 0, width, height);

                const isDark = document.body.classList.contains('dark-theme');
                const particleColor = isDark ? '247, 220, 232' : '74, 45, 94';

                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;
                    if (p.y < 0) p.y = height;
                    if (p.y > height) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
                    ctx.fill();

                    // Connect nearby particles
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 90) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(${particleColor}, ${(1 - dist / 90) * 0.12})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                });
            }
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    };

    /* ------------------------------------------------------------------
       12. LIGHTWEIGHT PARALLAX EFFECT
       ------------------------------------------------------------------ */
    Effects.initParallax = function () {
        if (prefersReducedMotion) return;

        const floatElements = document.querySelectorAll('.h-deco, .w-deco, .contact-spore, .h-mascot');
        if (!floatElements.length) return;

        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        }, { passive: true });

        const animateParallax = () => {
            const scrollY = window.scrollY;

            floatElements.forEach((el, index) => {
                const speed = (index % 3 + 1) * 0.04;
                const translateY = scrollY * speed + mouseY * (speed * 0.5);
                const translateX = mouseX * (speed * 0.5);

                el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            });

            requestAnimationFrame(animateParallax);
        };

        requestAnimationFrame(animateParallax);
    };

    /* ------------------------------------------------------------------
       13. LAZY LOADING WITH FADE-IN
       ------------------------------------------------------------------ */
    Effects.initLazyLoading = function () {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            img.classList.add('img-loaded');
            if (!img.complete) {
                img.addEventListener('load', () => img.classList.add('img-loaded'));
                img.addEventListener('error', () => img.classList.add('img-loaded'));
            }
        });
    };

    /* ------------------------------------------------------------------
       14. SMOOTH ANCHOR LINK SCROLLING WITH HEADER OFFSET
       ------------------------------------------------------------------ */
    Effects.initSmoothScroll = function () {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    };

    /* ------------------------------------------------------------------
       15. GLASSMORPHISM TOAST UPGRADE
       ------------------------------------------------------------------ */
    Effects.initGlassmorphismToast = function () {
        // Upgrade UI.showToast if UI object exists
        if (window.UI && typeof window.UI.showToast === 'function') {
            const originalToast = window.UI.showToast;
            window.UI.showToast = function (message, type = 'success') {
                originalToast.call(window.UI, message, type);

                // Add animated progress line to newly created toast
                const toasts = document.querySelectorAll('.toast:not(.has-progress)');
                toasts.forEach(toast => {
                    toast.classList.add('has-progress', 'glass-toast');
                    const progress = document.createElement('div');
                    progress.className = 'toast-progress-bar';
                    toast.appendChild(progress);
                });
            };
        }
    };

    // Auto-start Effects engine
    Effects.init();


(function () {
    var themeToggle = document.querySelector('.theme-toggle');
    function updateHomeProfileLink() {
        var profileLink = document.getElementById('home-profile');
        var signInLink = document.getElementById('home-signin');
        var signUpLink = document.getElementById('home-signup');
        var hasUser = !!getStoredUser();

        if (profileLink) {
            profileLink.hidden = !hasUser;
        }
        if (signInLink) {
            signInLink.hidden = hasUser;
        }
        if (signUpLink) {
            signUpLink.hidden = hasUser;
        }
    }

    function setAuthMessage(message, isError) {
        var el = document.getElementById('auth-message');
        if (!el) return;
        el.textContent = message || '';
        el.style.color = isError ? '#b55478' : '#4f6b4d';
    }

    function saveUser(user) {
        localStorage.setItem('oldenly-user', JSON.stringify(user));
    }

    function getStoredUser() {
        try {
            return JSON.parse(localStorage.getItem('oldenly-user') || 'null');
        } catch (e) {
            return null;
        }
    }

    updateHomeProfileLink();

    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var account = document.getElementById('login-account').value.trim();
            var password = document.getElementById('login-password').value;
            var storedUser = getStoredUser();

            if (!account || !password) {
                setAuthMessage('Please fill in both fields.', true);
                return;
            }

            if (!storedUser) {
                setAuthMessage('No account found. Please sign up first.', true);
                return;
            }

            if ((storedUser.email && storedUser.email.toLowerCase() === account.toLowerCase()) || (storedUser.username && storedUser.username.toLowerCase() === account.toLowerCase())) {
                if (storedUser.password === password) {
                    saveUser(storedUser);
                    setAuthMessage('Welcome back!', false);
                    window.location.href = 'profile.html';
                } else {
                    setAuthMessage('Incorrect password.', true);
                }
            } else {
                setAuthMessage('We could not find that account.', true);
            }
        });
    }

    var signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var username = document.getElementById('signup-username').value.trim();
            var email = document.getElementById('signup-email').value.trim();
            var password = document.getElementById('signup-password').value;
            var confirm = document.getElementById('signup-confirm').value;

            if (!username || !email || !password || !confirm) {
                setAuthMessage('Please complete all fields.', true);
                return;
            }

            if (password.length < 6) {
                setAuthMessage('Password must be at least 6 characters.', true);
                return;
            }

            if (password !== confirm) {
                setAuthMessage('Passwords do not match.', true);
                return;
            }

            var user = {
                username: username,
                email: email,
                password: password,
                stories: '12',
                joined: 'Jun 2026'
            };
            saveUser(user);
            setAuthMessage('Account created! Redirecting to your profile...', false);
            window.setTimeout(function () {
                window.location.href = 'profile.html';
            }, 700);
        });
    }
    function applyTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
        if (themeToggle) {
            var icon = themeToggle.querySelector('.theme-toggle__icon');
            if (icon) {
                icon.textContent = isDark ? '☀️' : '🌙';
            }
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
        localStorage.setItem('oldenly-theme', isDark ? 'dark' : 'light');
    }

    var savedTheme = localStorage.getItem('oldenly-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    applyTheme(initialDark);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            applyTheme(!document.body.classList.contains('dark-theme'));
        });
    }

    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        obs.observe(el);
    });

    function getSlidesPerView() {
        if (window.innerWidth <= 720) return 1;
        if (window.innerWidth <= 960) return 2;
        return 3;
    }

    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
        var viewport = carousel.querySelector('.carousel__viewport');
        var track = carousel.querySelector('.carousel__track');
        var slides = carousel.querySelectorAll('.carousel__slide');
        var prevBtn = carousel.querySelector('.carousel__btn--prev');
        var nextBtn = carousel.querySelector('.carousel__btn--next');
        var dotsContainer = carousel.querySelector('.carousel__dots');
        var pageIndex = 0;
        var pageCount = 1;

        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (var i = 0; i < pageCount; i++) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel__dot' + (i === pageIndex ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
                dot.dataset.page = String(i);
                dot.addEventListener('click', function () {
                    pageIndex = Number(this.dataset.page);
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            var perView = getSlidesPerView();
            carousel.style.setProperty('--slides-per-view', String(perView));
            var newPageCount = Math.max(1, Math.ceil(slides.length / perView));

            if (newPageCount !== pageCount) {
                pageCount = newPageCount;
                buildDots();
            } else {
                pageCount = newPageCount;
            }

            if (pageIndex >= pageCount) {
                pageIndex = pageCount - 1;
            }

            var offsetPx = pageIndex * (viewport ? viewport.offsetWidth : 0);
            track.style.transform = 'translateX(-' + offsetPx + 'px)';

            if (prevBtn) prevBtn.disabled = pageIndex === 0;
            if (nextBtn) nextBtn.disabled = pageIndex >= pageCount - 1;

            if (dotsContainer) {
                dotsContainer.querySelectorAll('.carousel__dot').forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === pageIndex);
                });
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (pageIndex > 0) {
                    pageIndex -= 1;
                    updateCarousel();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                if (pageIndex < pageCount - 1) {
                    pageIndex += 1;
                    updateCarousel();
                }
            });
        }

        buildDots();
        updateCarousel();

        window.addEventListener('resize', function () {
            buildDots();
            updateCarousel();
        });
    });
})();

// Animaciones para la sección "Our Values"
document.addEventListener('DOMContentLoaded', function () {
    var valuesCards = document.querySelectorAll('.values__card');

    if (valuesCards.length > 0) {
        var valuesObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    valuesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        valuesCards.forEach(function (card) {
            valuesObserver.observe(card);
        });
    }

    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        var feedback = contactForm.querySelector('.contact-form__feedback');
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var name = contactForm.querySelector('#contact-name').value.trim();
            var email = contactForm.querySelector('#contact-email').value.trim();
            var subject = contactForm.querySelector('#contact-subject').value.trim();
            var message = contactForm.querySelector('#contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                feedback.textContent = 'Please fill in all fields.';
                feedback.style.color = '#b5175a';
                return;
            }

            feedback.textContent = 'Thanks! Your message has been sent. We will contact you soon.';
            feedback.style.color = '#2d1b3d';
            contactForm.reset();
        });
    }

    function markActiveNavLink() {
        var currentPath = window.location.pathname.split('/').pop();
        if (!currentPath) {
            currentPath = 'index.html';
        }

        var currentHash = window.location.hash || '#home';

        document.querySelectorAll('.nav__list a').forEach(function (link) {
            link.classList.remove('is-active');
            var href = link.getAttribute('href');
            if (!href) return;

            if (href.indexOf('#') === 0 && (currentPath === 'index.html' || currentPath === '')) {
                if (href === currentHash) {
                    link.classList.add('is-active');
                }
                return;
            }

            var linkPath = href.split('/').pop();
            if (!linkPath) return;

            if (linkPath === currentPath) {
                link.classList.add('is-active');
            }
        });
    }

    var howtoSearch = document.querySelector('.howto-search');
    if (howtoSearch) {
        var howtoCards = Array.prototype.slice.call(document.querySelectorAll('.howto-card'));
        howtoSearch.addEventListener('input', function () {
            var query = this.value.trim().toLowerCase();
            howtoCards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                var matches = text.indexOf(query) !== -1;
                card.style.display = matches ? '' : 'none';
            });
        });
    }

    document.querySelectorAll('.accordion-item .accordion-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var item = toggle.closest('.accordion-item');
            var panel = item ? item.querySelector('.accordion-panel') : null;
            var isOpen = item && item.classList.contains('open');

            document.querySelectorAll('.accordion-item').forEach(function (otherItem) {
                otherItem.classList.remove('open');
                var otherPanel = otherItem.querySelector('.accordion-panel');
                if (otherPanel) otherPanel.style.maxHeight = '0px';
                var otherToggle = otherItem.querySelector('.accordion-toggle');
                if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
            });

            if (item && !isOpen) {
                item.classList.add('open');
                if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
                toggle.setAttribute('aria-expanded', 'true');
            } else if (item) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.querySelectorAll('.accordion-item').forEach(function (item) {
        var panel = item.querySelector('.accordion-panel');
        if (panel) panel.style.maxHeight = item.classList.contains('open') ? panel.scrollHeight + 'px' : '0px';
    });

    var howtoFile = document.getElementById('howto-file');
    var fileInfo = document.querySelector('.file-info');
    var uploadBar = document.querySelector('.upload-bar');
    var uploadPreview = document.querySelector('.upload-preview');
    if (howtoFile && fileInfo && uploadBar && uploadPreview) {
        howtoFile.addEventListener('change', function () {
            var file = this.files && this.files[0];
            if (!file) {
                fileInfo.textContent = 'No file selected yet.';
                uploadBar.style.width = '0%';
                uploadPreview.innerHTML = '';
                return;
            }

            fileInfo.textContent = 'Selected: ' + file.name;
            uploadBar.style.width = '100%';

            if (file.type.startsWith('image/')) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    uploadPreview.innerHTML = '<img src="' + event.target.result + '" alt="Selected preview" style="max-width: 100%; border-radius: 12px;">';
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('audio/')) {
                var url = URL.createObjectURL(file);
                uploadPreview.innerHTML = '<audio controls src="' + url + '"></audio>';
            } else {
                uploadPreview.innerHTML = '<p style="color:#4a2d5e;">File ready to send.</p>';
            }
        });
    }

    var suggestionForm = document.querySelector('.suggestion-form');
    if (suggestionForm) {
        var suggestionFeedback = suggestionForm.querySelector('.contact-form__feedback');
        suggestionForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var message = suggestionForm.querySelector('#suggestion-message').value.trim();
            if (!message) {
                suggestionFeedback.textContent = 'Please write a short description of your issue.';
                suggestionFeedback.style.color = '#b5175a';
                return;
            }

            suggestionFeedback.textContent = 'Thanks! Your suggestion was received.';
            suggestionFeedback.style.color = '#2d1b3d';
            suggestionForm.reset();
        });
    }

    markActiveNavLink();
});

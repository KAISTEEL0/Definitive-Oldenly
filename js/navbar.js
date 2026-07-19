/**
 * Navbar Module
 * Dynamically renders and manages the navigation bar across all pages.
 */
const Navbar = {
    /**
     * Initializes the navbar based on the current session.
     */
    init() {
        this.render();
        UI.initTheme();
    },

    /**
     * Detects the path prefix to ensure links work from any directory.
     * @returns {Object} { toRoot, toPages }
     */
    getPathPrefixes() {
        const path = window.location.pathname;
        const isInPages = path.includes('/pages/');
        return {
            toRoot: isInPages ? '../' : '',
            toPages: isInPages ? '' : 'pages/'
        };
    },

    /**
     * Renders the entire navbar dynamically.
     */
    render() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const user = StorageManager.getUserSession();
        const { toRoot, toPages } = this.getPathPrefixes();

        const isDark = document.body.classList.contains('dark-theme');
        const themeIcon = isDark ? '☀️' : '🌙';
        const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

        // Determine active link based on current page
        const path = window.location.pathname;
        const isHome = path.endsWith('index.html') || path.endsWith('/') || (!path.includes('.html') && !path.includes('/pages/'));
        const isVolunteer = path.includes('volunteer.html');
        const isBrowse = path.includes('browse.html');
        const isHowToUse = path.includes('how-to-use.html');
        const isAbout = path.includes('AboutUs.html');
        const isContact = path.includes('contact.html');

        const avatarHTML = user && user.avatar 
            ? `<img src="${user.avatar}" alt="${Helpers.escapeHTML(user.username)}" class="nav-avatar-img">`
            : (user ? `<div class="nav-avatar-placeholder">${Helpers.escapeHTML(user.username.charAt(0).toUpperCase())}</div>` : '');

        const rightContent = user ? `
            <button class="theme-toggle" type="button" aria-label="${themeLabel}" aria-pressed="${isDark}">
                <span class="theme-toggle__icon" aria-hidden="true">${themeIcon}</span>
            </button>
            <div class="nav-user-dropdown">
                <button class="nav-user-trigger" aria-haspopup="true" aria-expanded="false">
                    ${avatarHTML}
                    <span class="nav-user-name">${Helpers.escapeHTML(user.username)}</span>
                    <span class="nav-user-arrow">▼</span>
                </button>
                <div class="nav-dropdown-menu">
                    <div class="nav-dropdown-header">
                        ${avatarHTML}
                        <div class="nav-dropdown-user-info">
                            <span class="nav-dropdown-name">${Helpers.escapeHTML(user.firstName || user.username)}</span>
                            <span class="nav-dropdown-email">${Helpers.escapeHTML(user.email)}</span>
                            <span class="nav-dropdown-status"><span class="status-dot"></span> Online</span>
                        </div>
                    </div>
                    <div class="nav-dropdown-divider"></div>
                    <ul class="nav-dropdown-links">
                        <li><a href="${toPages}profile.html?tab=profile"><span class="nav-icon">👤</span> My Profile</a></li>
                        <li><a href="${toPages}profile.html?tab=edit"><span class="nav-icon">✏️</span> Edit Profile</a></li>
                        <li><a href="${toPages}profile.html?tab=stories"><span class="nav-icon">📖</span> My Stories</a></li>
                        <li><a href="${toPages}profile.html?tab=settings"><span class="nav-icon">⚙️</span> Settings</a></li>
                    </ul>
                    <div class="nav-dropdown-divider"></div>
                    <button class="nav-dropdown-logout-btn" id="nav-logout-btn">
                        <span class="nav-icon">🚪</span> Log Out
                    </button>
                </div>
            </div>
        ` : `
            <button class="theme-toggle" type="button" aria-label="${themeLabel}" aria-pressed="${isDark}">
                <span class="theme-toggle__icon" aria-hidden="true">${themeIcon}</span>
            </button>
            <a href="${toPages}sign-in.html" class="nav__signin" id="home-signin">Sign in</a>
            <a href="${toPages}sign-up.html" class="nav__login" id="home-signup">Sign up</a>
        `;

        header.innerHTML = `
            <nav class="nav" aria-label="Main navigation">
                <div class="nav__left">
                    <a href="${toRoot}index.html" class="nav__brand">
                        <img class="nav__logo" src="https://z-cdn-media.chatglm.cn/files/9870feec-49e7-4e46-a5d9-dd51aa2c1c44.png?auth_key=1881144779-4a1a777672674cf48df3bb8cfc2347da-0-375f282fa162657122442a64536a374c" alt="Oldenly Logo">
                        <span class="nav__name">Oldenly</span>
                    </a>
                    <button class="nav__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav__list" id="nav-menu">
                        <li><a href="${toRoot}index.html" class="${isHome ? 'is-active' : ''}">Home</a></li>
                        <li><a href="${toRoot}volunteer.html" class="${isVolunteer ? 'is-active' : ''}">Volunteer</a></li>
                        <li><a href="${toRoot}browse.html" class="${isBrowse ? 'is-active' : ''}">Explore Stories</a></li>
                        <li><a href="${toPages}how-to-use.html" class="${isHowToUse ? 'is-active' : ''}">How to use</a></li>
                        <li><a href="${toRoot}AboutUs.html" class="${isAbout ? 'is-active' : ''}">About us</a></li>
                        <li><a href="${toPages}contact.html" class="${isContact ? 'is-active' : ''}">Contact us</a></li>
                    </ul>
                </div>
                <div class="nav__right">
                    ${rightContent}
                </div>
            </nav>
        `;

        // Add dropdown toggle event if logged in
        if (user) {
            const trigger = header.querySelector('.nav-user-trigger');
            const dropdown = header.querySelector('.nav-user-dropdown');
            
            if (trigger && dropdown) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const expanded = trigger.getAttribute('aria-expanded') === 'true';
                    trigger.setAttribute('aria-expanded', !expanded);
                    dropdown.classList.toggle('active');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    trigger.setAttribute('aria-expanded', 'false');
                    dropdown.classList.remove('active');
                });
            }

            // Logout button event
            const logoutBtn = header.querySelector('#nav-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    UI.showConfirm('Log Out', 'Are you sure you want to log out of your session?', () => {
                        UI.showLoader();
                        setTimeout(() => {
                            StorageManager.clearUserSession();
                            UI.hideLoader();
                            UI.showToast('Logged out successfully.', 'success');
                            window.location.href = `${toRoot}index.html`;
                        }, 600);
                    });
                });
            }
        }

        // Initialize mobile menu toggle
        const toggle = header.querySelector('.nav__toggle');
        const menu = header.querySelector('#nav-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !expanded);
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
            });
        }
    }
};

window.Navbar = Navbar;

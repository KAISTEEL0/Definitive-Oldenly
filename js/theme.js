/**
 * Theme Manager Module
 * Handles dark/light mode toggling and persistence.
 */
const ThemeManager = {
    KEY: 'oldenly-theme',

    initialized: false,

    /**
     * Initializes the theme based on saved preference or system preference.
     */
    init() {
        this.applyTheme(this.isDark());
        if (!this.initialized) {
            this.initToggleListeners();
            this.initialized = true;
        }
    },

    /**
     * Checks if dark mode is currently active.
     * @returns {boolean}
     */
    isDark() {
        const savedTheme = localStorage.getItem(this.KEY);
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Fallback to system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Applies the theme to the document body and updates toggle buttons.
     * @param {boolean} isDark 
     */
    applyTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);

        // Update all theme toggle buttons on the page
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            const icon = toggle.querySelector('.theme-toggle__icon');
            if (icon) {
                icon.textContent = isDark ? '☀️' : '🌙';
            }
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

            // If there's a checkbox toggle in settings, update it too
            const checkbox = document.getElementById('settings-theme-toggle');
            if (checkbox) {
                checkbox.checked = isDark;
            }
        });

        localStorage.setItem(this.KEY, isDark ? 'dark' : 'light');
    },

    /**
     * Toggles the theme between dark and light.
     */
    toggle() {
        const newDark = !document.body.classList.contains('dark-theme');
        this.applyTheme(newDark);

        // Log activity if user is logged in
        if (window.StorageManager && typeof StorageManager.getUserSession === 'function') {
            const user = StorageManager.getUserSession();
            if (user) {
                StorageManager.logActivity(`Switched theme to ${newDark ? 'Dark' : 'Light'}`);
                // If we are on the profile page, refresh the activity timeline
                if (window.Profile && typeof Profile.renderActivity === 'function') {
                    Profile.renderActivity(StorageManager.getUserSession());
                }
            }
        }
    },

    /**
     * Initializes event listeners for theme toggle buttons.
     */
    initToggleListeners() {
        // Use event delegation on body to handle dynamically rendered toggles
        document.body.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.theme-toggle');
            if (toggleBtn) {
                e.preventDefault();
                this.toggle();
            }
        });
    }
};

// Initialize theme immediately to prevent flash of light theme
ThemeManager.init();
window.ThemeManager = ThemeManager;

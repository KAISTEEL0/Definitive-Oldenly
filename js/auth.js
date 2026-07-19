/**
 * Auth Module
 * Handles login, signup, and route protection.
 */
const Auth = {
    /**
     * Initializes authentication handlers.
     */
    init() {
        this.handleRouteProtection();
        this.initLoginForm();
        this.initSignupForm();
    },

    /**
     * Protects routes based on authentication state.
     */
    handleRouteProtection() {
        const user = StorageManager.getUserSession();
        const path = window.location.pathname;
        const isProfilePage = path.includes('profile.html');
        const isAuthPage = path.includes('sign-in.html') || path.includes('sign-up.html');

        if (isProfilePage && !user) {
            // If trying to access profile without being logged in, redirect to sign-in
            const isInPages = path.includes('/pages/');
            const redirectPath = isInPages ? 'sign-in.html' : 'pages/sign-in.html';
            window.location.href = redirectPath;
        } else if (isAuthPage && user) {
            // If already logged in and trying to access login/signup, redirect to profile
            const isInPages = path.includes('/pages/');
            const redirectPath = isInPages ? 'profile.html' : 'pages/profile.html';
            window.location.href = redirectPath;
        }
    },

    /**
     * Initializes the login form handler.
     */
    initLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const accountInput = document.getElementById('login-account');
            const passwordInput = document.getElementById('login-password');
            const messageEl = document.getElementById('auth-message');

            if (!accountInput || !passwordInput) return;

            const account = accountInput.value.trim();
            const password = passwordInput.value;

            if (!account || !password) {
                this.setAuthMessage('Please fill in both fields.', true);
                return;
            }

            UI.showLoader();

            setTimeout(() => {
                try {
                    const user = StorageManager.loginUser(account, password);
                    this.setAuthMessage('Welcome back! Redirecting...', false);
                    UI.showToast(`Welcome back, ${user.username}!`, 'success');

                    setTimeout(() => {
                        UI.hideLoader();
                        window.location.href = 'profile.html';
                    }, 800);
                } catch (error) {
                    UI.hideLoader();
                    this.setAuthMessage(error.message, true);
                    UI.showToast(error.message, 'error');
                }
            }, 600);
        });
    },

    /**
     * Initializes the signup form handler.
     */
    initSignupForm() {
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;

        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const usernameInput = document.getElementById('signup-username');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const confirmInput = document.getElementById('signup-confirm');

            if (!usernameInput || !emailInput || !passwordInput || !confirmInput) return;

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirm = confirmInput.value;

            if (!username || !email || !password || !confirm) {
                this.setAuthMessage('Please complete all fields.', true);
                return;
            }

            if (password.length < 6) {
                this.setAuthMessage('Password must be at least 6 characters.', true);
                return;
            }

            if (password !== confirm) {
                this.setAuthMessage('Passwords do not match.', true);
                return;
            }

            UI.showLoader();

            setTimeout(() => {
                try {
                    const user = StorageManager.registerUser(username, email, password);
                    this.setAuthMessage('Account created! Redirecting...', false);
                    UI.showToast('Account created successfully!', 'success');

                    setTimeout(() => {
                        UI.hideLoader();
                        window.location.href = 'profile.html';
                    }, 800);
                } catch (error) {
                    UI.hideLoader();
                    this.setAuthMessage(error.message, true);
                    UI.showToast(error.message, 'error');
                }
            }, 600);
        });
    },

    /**
     * Sets the authentication message on the form.
     * @param {string} message 
     * @param {boolean} isError 
     */
    setAuthMessage(message, isError) {
        const el = document.getElementById('auth-message');
        if (!el) return;
        el.textContent = message || '';
        el.style.color = isError ? '#b55478' : '#4f6b4d';
    }
};

window.Auth = Auth;

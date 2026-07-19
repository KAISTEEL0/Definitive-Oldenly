/**
 * Profile Dashboard Module
 * Manages the profile page, sidebar navigation, statistics, activity timeline,
 * profile picture upload, edit profile modal, and settings.
 */
const Profile = {
    /**
     * Initializes the profile dashboard.
     */
    init() {
        const user = StorageManager.getUserSession();
        if (!user) {
            window.location.href = 'sign-in.html';
            return;
        }

        this.renderDashboard();
        this.initSidebar();
        this.initEditModal();
        this.initPhotoUpload();
        this.initSettings();
        this.initShareProfile();
    },

    /**
     * Renders all user data in the dashboard.
     */
    renderDashboard() {
        const user = StorageManager.getUserSession();
        if (!user) return;

        // Calculate days registered
        const daysRegistered = Helpers.daysBetween(user.joined);
        user.stats.daysRegistered = daysRegistered;

        // Update text contents
        this.updateText('profile-name', `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username);
        this.updateText('sidebar-user-name', user.firstName || user.username);
        this.updateText('profile-username', `@${user.username}`);
        this.updateText('profile-email', user.email);
        this.updateText('profile-joined', Helpers.formatDate(user.joined));
        this.updateText('profile-last-login', Helpers.formatDateTime(user.lastLogin));
        this.updateText('profile-status', user.status || 'Online');
        this.updateText('profile-bio', user.bio || 'No biography provided.');

        // Update avatars
        this.updateAvatars(user);

        // Render stats
        this.renderStats(user);

        // Render activity timeline
        this.renderActivity(user);
    },

    /**
     * Updates text content of an element safely.
     */
    updateText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    },

    /**
     * Updates all avatar elements on the page.
     */
    updateAvatars(user) {
        const avatarContainers = document.querySelectorAll('.user-avatar-container');
        avatarContainers.forEach(container => {
            if (user.avatar) {
                container.innerHTML = `<img src="${user.avatar}" alt="${Helpers.escapeHTML(user.username)}" class="dashboard-avatar-img">`;
            } else {
                const initial = user.username.charAt(0).toUpperCase();
                container.innerHTML = `<div class="dashboard-avatar-placeholder">${initial}</div>`;
            }
        });
    },

    /**
     * Renders the statistics panel.
     */
    renderStats(user) {
        const stats = user.stats || {};
        this.updateText('stat-stories', stats.storiesShared || 0);
        this.updateText('stat-favorites', stats.storiesFavorite || 0);
        this.updateText('stat-days', stats.daysRegistered || 0);
        this.updateText('stat-access', Helpers.formatDate(user.lastLogin));
        this.updateText('stat-comments', stats.comments || 0);
        this.updateText('stat-likes', stats.likesReceived || 0);

        // Render badges
        const badgesContainer = document.getElementById('stat-badges');
        if (badgesContainer) {
            const badges = stats.badges || [];
            badgesContainer.innerHTML = badges.map(badge => `
                <span class="badge-pill">${Helpers.escapeHTML(badge)}</span>
            `).join('');
        }
    },

    /**
     * Renders the activity timeline.
     */
    renderActivity(user) {
        const timeline = document.getElementById('activity-timeline');
        if (!timeline) return;

        const activities = user.activity || [];
        if (activities.length === 0) {
            timeline.innerHTML = '<p class="no-activity">No recent activity found.</p>';
            return;
        }

        timeline.innerHTML = activities.map(act => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <span class="timeline-time">${Helpers.formatDateTime(act.time)}</span>
                    <p class="timeline-text">${Helpers.escapeHTML(act.text)}</p>
                </div>
            </div>
        `).join('');
    },

    /**
     * Initializes sidebar navigation and tab switching.
     */
    initSidebar() {
        const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');
        const tabs = document.querySelectorAll('.dashboard-tab-content');

        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');

                if (targetTab === 'logout') {
                    // Trigger logout
                    const logoutBtn = document.getElementById('nav-logout-btn');
                    if (logoutBtn) {
                        logoutBtn.click();
                    } else {
                        UI.showConfirm('Log Out', 'Are you sure you want to log out of your session?', () => {
                            StorageManager.clearUserSession();
                            window.location.href = '../index.html';
                        });
                    }
                    return;
                }

                // Update active link
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update active tab
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.id === `tab-${targetTab}`) {
                        tab.classList.add('active');
                    }
                });

                // If edit profile tab is selected, open the modal instead of switching tab,
                // or switch tab and open modal. Let's open the modal!
                if (targetTab === 'edit') {
                    this.openEditModal();
                    // Switch back to profile tab in sidebar
                    const profileLink = document.querySelector('.sidebar-nav-link[data-tab="profile"]');
                    if (profileLink) profileLink.click();
                }
            });
        });

        // Check URL query params for tab
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
            const targetLink = document.querySelector(`.sidebar-nav-link[data-tab="${tabParam}"]`);
            if (targetLink) {
                targetLink.click();
            }
        }
    },

    /**
     * Initializes the Edit Profile modal.
     */
    initEditModal() {
        const editBtn = document.getElementById('edit-profile-btn');
        const modal = document.getElementById('edit-profile-modal');
        if (!modal) return;

        if (editBtn) {
            editBtn.addEventListener('click', () => this.openEditModal());
        }

        const closeBtn = modal.querySelector('.modal-close-btn');
        const cancelBtn = document.getElementById('edit-cancel-btn');
        const form = document.getElementById('edit-profile-form');

        const closeModal = () => {
            modal.classList.remove('active');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = StorageManager.getUserSession();
                if (!user) return;

                const firstName = document.getElementById('edit-firstname').value.trim();
                const lastName = document.getElementById('edit-lastname').value.trim();
                const username = document.getElementById('edit-username').value.trim();
                const email = document.getElementById('edit-email').value.trim();
                const bio = document.getElementById('edit-bio').value.trim();
                const country = document.getElementById('edit-country').value;
                const birthDate = document.getElementById('edit-birthdate').value;

                if (!username || !email) {
                    UI.showToast('Username and Email are required.', 'error');
                    return;
                }

                UI.showLoader();

                setTimeout(() => {
                    try {
                        // Update user
                        StorageManager.updateUser({
                            firstName,
                            lastName,
                            username,
                            email,
                            bio,
                            country,
                            birthDate
                        });

                        // Log activity
                        StorageManager.logActivity('Edited profile details');

                        // Refresh dashboard and navbar
                        this.renderDashboard();
                        Navbar.render();

                        closeModal();
                        UI.hideLoader();
                        UI.showToast('Profile updated successfully!', 'success');
                    } catch (error) {
                        UI.hideLoader();
                        UI.showToast(error.message, 'error');
                    }
                }, 600);
            });
        }
    },

    /**
     * Opens the Edit Profile modal and populates it with current user data.
     */
    openEditModal() {
        const modal = document.getElementById('edit-profile-modal');
        if (!modal) return;

        const user = StorageManager.getUserSession();
        if (!user) return;

        document.getElementById('edit-firstname').value = user.firstName || '';
        document.getElementById('edit-lastname').value = user.lastName || '';
        document.getElementById('edit-username').value = user.username || '';
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-bio').value = user.bio || '';
        document.getElementById('edit-country').value = user.country || 'United States';
        document.getElementById('edit-birthdate').value = user.birthDate || '';

        modal.classList.add('active');
    },

    /**
     * Initializes the profile picture upload.
     */
    initPhotoUpload() {
        const fileInput = document.getElementById('avatar-file-input');
        const uploadBtn = document.getElementById('change-photo-btn');
        const uploadBtnCard = document.getElementById('card-change-photo-btn');

        const triggerUpload = () => {
            if (fileInput) fileInput.click();
        };

        if (uploadBtn) uploadBtn.addEventListener('click', triggerUpload);
        if (uploadBtnCard) uploadBtnCard.addEventListener('click', triggerUpload);

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    UI.showToast('Please select a valid image file.', 'error');
                    return;
                }

                // Limit size to 1.5MB to avoid localStorage quota issues
                if (file.size > 1.5 * 1024 * 1024) {
                    UI.showToast('Image is too large. Please select an image under 1.5MB.', 'error');
                    return;
                }

                UI.showLoader();

                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;

                    setTimeout(() => {
                        try {
                            // Save avatar
                            StorageManager.updateUser({ avatar: base64Image });

                            // Log activity
                            StorageManager.logActivity('Changed profile picture');

                            // Refresh dashboard and navbar
                            this.renderDashboard();
                            Navbar.render();

                            UI.hideLoader();
                            UI.showToast('Profile picture updated!', 'success');
                        } catch (error) {
                            UI.hideLoader();
                            UI.showToast('Failed to save image. It might be too large.', 'error');
                        }
                    }, 600);
                };
            reader.readAsDataURL(file);
        });

        const deleteBtn = document.getElementById('delete-photo-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const user = StorageManager.getUserSession();
                if (!user || !user.avatar) {
                    UI.showToast('You do not have a custom profile picture to delete.', 'info');
                    return;
                }

                UI.showConfirm('Delete Photo', 'Are you sure you want to delete your profile picture and return to the default avatar?', () => {
                    UI.showLoader();
                    setTimeout(() => {
                        const updatedUser = StorageManager.updateUser({ avatar: '' });
                        StorageManager.logActivity('Removed profile picture');

                        this.renderDashboard(updatedUser);
                        Navbar.render();

                        UI.hideLoader();
                        UI.showToast('Profile picture removed successfully!', 'success');
                    }, 600);
                });
            });
        }
        }
    },

    /**
     * Initializes settings tab handlers (theme, language, delete account).
     */
    initSettings() {
        // Theme toggle in settings
        const settingsThemeToggle = document.getElementById('settings-theme-toggle');
        if (settingsThemeToggle) {
            const isDark = document.body.classList.contains('dark-theme');
            settingsThemeToggle.checked = isDark;
            settingsThemeToggle.addEventListener('change', () => {
                const themeToggleBtn = document.querySelector('.theme-toggle');
                if (themeToggleBtn) themeToggleBtn.click();
            });
        }

        // Language selection
        const langSelect = document.getElementById('settings-language');
        if (langSelect) {
            const user = StorageManager.getUserSession();
            langSelect.value = user.language || 'en';
            langSelect.addEventListener('change', (e) => {
                const lang = e.target.value;
                StorageManager.updateUser({ language: lang });
                StorageManager.logActivity(`Changed language to ${lang === 'es' ? 'Spanish' : 'English'}`);
                UI.showToast(`Language changed to ${lang === 'es' ? 'Spanish' : 'English'}.`, 'success');
            });
        }

        // Delete account
        const deleteBtn = document.getElementById('delete-account-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                UI.showConfirm(
                    'Delete Account',
                    'WARNING: This will permanently delete your account and ALL your data from this browser. This action cannot be undone. Are you sure?',
                    () => {
                        UI.showLoader();
                        setTimeout(() => {
                            StorageManager.deleteUserAccount();
                            UI.hideLoader();
                            UI.showToast('Your account has been permanently deleted.', 'info');
                            setTimeout(() => {
                                window.location.href = '../index.html';
                            }, 1000);
                        }, 1000);
                    }
                );
            });
        }
    },

    /**
     * Initializes the Share Profile button.
     */
    initShareProfile() {
        const shareBtn = document.getElementById('share-profile-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const user = StorageManager.getUserSession();
                const profileUrl = window.location.href;

                // Try to use Web Share API if available, otherwise copy to clipboard
                if (navigator.share) {
                    navigator.share({
                        title: `${user.username}'s Profile on Oldenly`,
                        text: `Check out ${user.username}'s profile on Oldenly!`,
                        url: profileUrl
                    }).catch(err => console.log(err));
                } else {
                    navigator.clipboard.writeText(profileUrl).then(() => {
                        UI.showToast('Profile link copied to clipboard!', 'success');
                        StorageManager.logActivity('Shared profile link');
                        this.renderDashboard();
                    }).catch(() => {
                        UI.showToast('Failed to copy link.', 'error');
                    });
                }
            });
        }
    }
};

window.Profile = Profile;

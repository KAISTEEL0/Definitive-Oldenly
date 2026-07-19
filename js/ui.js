/**
 * UI Module
 * Handles toasts, modals, loaders, and theme toggling.
 */
const UI = {
    /**
     * Shows a toast notification.
     * @param {string} message 
     * @param {string} type ('success', 'error', 'info')
     */
    showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast--${type} fade-in`;

        let icon = '🔔';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = 'ℹ️';

        toast.innerHTML = `
            <span class="toast__icon">${icon}</span>
            <span class="toast__message">${message}</span>
        `;

        container.appendChild(toast);

        // Remove toast after 3.5 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    },

    /**
     * Shows a loading spinner.
     */
    showLoader() {
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'global-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
            `;
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    },

    /**
     * Hides the loading spinner.
     */
    hideLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    },

    /**
     * Shows a custom confirmation modal.
     * @param {string} title 
     * @param {string} message 
     * @param {function} onConfirm 
     */
    showConfirm(title, message, onConfirm) {
        let modal = document.getElementById('confirm-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'confirm-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-card scale-in">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close-btn" id="confirm-close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn--outline" id="confirm-cancel-btn">Cancel</button>
                    <button class="btn btn--filled btn--danger" id="confirm-ok-btn">Confirm</button>
                </div>
            </div>
        `;

        modal.classList.add('active');

        const close = () => {
            modal.classList.remove('active');
        };

        modal.querySelector('#confirm-close-btn').addEventListener('click', close);
        modal.querySelector('#confirm-cancel-btn').addEventListener('click', close);
        modal.querySelector('#confirm-ok-btn').addEventListener('click', () => {
            close();
            if (typeof onConfirm === 'function') onConfirm();
        });
    },

    /**
     * Initializes theme toggling.
     */
    initTheme() {
        if (window.ThemeManager) {
            ThemeManager.init();
        }
    }
};

window.UI = UI;

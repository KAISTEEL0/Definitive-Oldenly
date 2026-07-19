/**
 * Helpers Utility Module
 * Contains reusable helper functions using ES6.
 */
const Helpers = {
    /**
     * Escapes HTML characters to prevent XSS.
     * @param {string} str 
     * @returns {string}
     */
    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /**
     * Formats a date string or object into a readable format.
     * @param {Date|string|number} date 
     * @returns {string}
     */
    formatDate(date) {
        if (!date) return 'N/A';
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Formats a date and time.
     * @param {Date|string|number} date 
     * @returns {string}
     */
    formatDateTime(date) {
        if (!date) return 'N/A';
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Calculates the number of days between two dates.
     * @param {Date|string} startDate 
     * @param {Date|string} endDate 
     * @returns {number}
     */
    daysBetween(startDate, endDate = new Date()) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
        const diffTime = Math.abs(end - start);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
};

window.Helpers = Helpers;

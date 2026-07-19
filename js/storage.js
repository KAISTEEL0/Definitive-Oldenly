/**
 * Storage Manager Module
 * Handles all localStorage operations for users, sessions, and activities.
 */
const StorageManager = {
    KEYS: {
        USERS: 'oldenly-users',
        SESSION: 'oldenly-user',
        THEME: 'oldenly-theme'
    },

    /**
     * Gets all registered users.
     * @returns {Array}
     */
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
        } catch (e) {
            console.error('Error reading users from localStorage', e);
            return [];
        }
    },

    /**
     * Saves the array of registered users.
     * @param {Array} users 
     */
    saveUsers(users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    /**
     * Gets the currently logged-in user session.
     * @returns {Object|null}
     */
    getUserSession() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.SESSION) || 'null');
        } catch (e) {
            console.error('Error reading session from localStorage', e);
            return null;
        }
    },

    /**
     * Saves the active user session and updates their record in the registered users list.
     * @param {Object} user 
     */
    saveUserSession(user) {
        if (!user) return;
        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(user));

        // Update in the registered users list
        const users = this.getUsers();
        const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase() || u.username.toLowerCase() === user.username.toLowerCase());
        if (index !== -1) {
            users[index] = user;
        } else {
            users.push(user);
        }
        this.saveUsers(users);
    },

    /**
     * Clears the active user session (logout).
     */
    clearUserSession() {
        localStorage.removeItem(this.KEYS.SESSION);
    },

    /**
     * Registers a new user.
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} The registered user
     */
    registerUser(username, email, password) {
        const users = this.getUsers();

        // Check if user already exists
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
        if (exists) {
            throw new Error('Username or email already registered.');
        }

        const now = new Date().toISOString();
        const newUser = {
            username,
            email,
            password,
            firstName: username,
            lastName: '',
            bio: 'Storyteller and memory keeper.',
            country: 'United States',
            birthDate: '',
            avatar: '', // empty for default
            joined: now,
            lastLogin: now,
            status: 'Online',
            theme: 'light',
            language: 'en',
            stats: {
                storiesShared: 12, // default simulated stats
                storiesFavorite: 3,
                daysRegistered: 0,
                lastAccess: now,
                comments: 5,
                likesReceived: 24,
                badges: ['Pioneer', 'Storyteller', 'Active Member']
            },
            activity: [
                { time: now, text: 'Account created' },
                { time: now, text: 'Logged in' }
            ]
        };

        users.push(newUser);
        this.saveUsers(users);
        this.saveUserSession(newUser);
        return newUser;
    },

    /**
     * Logs in a user.
     * @param {string} account (email or username)
     * @param {string} password 
     * @returns {Object} The logged-in user
     */
    loginUser(account, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === account.toLowerCase() || u.username.toLowerCase() === account.toLowerCase());

        if (!user) {
            throw new Error('We could not find that account.');
        }

        if (user.password !== password) {
            throw new Error('Incorrect password.');
        }

        const now = new Date().toISOString();
        user.lastLogin = now;
        user.status = 'Online';

        // Add login activity
        if (!user.activity) user.activity = [];
        user.activity.unshift({ time: now, text: 'Logged in' });

        this.saveUserSession(user);
        return user;
    },

    /**
     * Updates the active user's profile data.
     * @param {Object} updatedData 
     * @returns {Object} The updated user
     */
    updateUser(updatedData) {
        const user = this.getUserSession();
        if (!user) throw new Error('No active session found.');

        const updatedUser = { ...user, ...updatedData };
        this.saveUserSession(updatedUser);
        return updatedUser;
    },

    /**
     * Deletes the active user's account.
     */
    deleteUserAccount() {
        const user = this.getUserSession();
        if (!user) return;

        const users = this.getUsers();
        const filteredUsers = users.filter(u => u.email.toLowerCase() !== user.email.toLowerCase() && u.username.toLowerCase() !== user.username.toLowerCase());
        this.saveUsers(filteredUsers);
        this.clearUserSession();
    },

    /**
     * Logs an activity event for the active user.
     * @param {string} text 
     */
    logActivity(text) {
        const user = this.getUserSession();
        if (!user) return;

        if (!user.activity) user.activity = [];
        user.activity.unshift({
            time: new Date().toISOString(),
            text: text
        });
        this.saveUserSession(user);
    }
};

window.StorageManager = StorageManager;

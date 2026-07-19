/**
 * Volunteer Module
 * Handles workshops, events calendar, testimonials, and joining workshops.
 */
const Volunteer = {
    STORAGE_KEY: 'oldenly-workshops',

    DEFAULT_WORKSHOPS: [
        {
            id: 'ws-1',
            name: 'Coffee & Conversations',
            description: 'A relaxed meeting where volunteers chat with seniors over coffee.',
            date: '2026-07-10',
            time: '10:00 AM',
            location: 'Community Center Cafe',
            spots: 15,
            duration: '2 hours',
            category: 'Social',
            level: 'Everyone',
            image: 'https://img.freepik.com/premium-photo/group-friends-are-sitting-around-table-coffee-shop-talking-laughing_36682-44206.jpg'
        },
        {
            id: 'ws-2',
            name: 'Painting Memories',
            description: 'Create beautiful paintings while sharing life stories and experiences.',
            date: '2026-07-12',
            time: '02:00 PM',
            location: 'Art Studio Room B',
            spots: 10,
            duration: '3 hours',
            category: 'Art',
            level: 'Beginner',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400'
        },
        {
            id: 'ws-3',
            name: 'Music Through Generations',
            description: 'Listen to classic songs, discuss memories, and share musical tastes.',
            date: '2026-07-15',
            time: '04:00 PM',
            location: 'Music Hall',
            spots: 20,
            duration: '1.5 hours',
            category: 'Music',
            level: 'Everyone',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'
        },
        {
            id: 'ws-4',
            name: 'Storytelling Circle',
            description: 'Share meaningful life experiences and preserve oral histories.',
            date: '2026-07-18',
            time: '11:00 AM',
            location: 'Library Lounge',
            spots: 12,
            duration: '2 hours',
            category: 'Literature',
            level: 'Everyone',
            image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400'
        },
        {
            id: 'ws-5',
            name: 'Technology Basics',
            description: 'Teach seniors how to use smartphones, video call family, and browse safely.',
            date: '2026-07-20',
            time: '03:00 PM',
            location: 'Tech Lab Room 1',
            spots: 8,
            duration: '2 hours',
            category: 'Technology',
            level: 'Beginner',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400'
        },
        {
            id: 'ws-6',
            name: 'Community Gardening',
            description: 'Plant flowers, herbs, and vegetables together in the community garden.',
            date: '2026-07-22',
            time: '09:00 AM',
            location: 'Central Park Garden',
            spots: 18,
            duration: '2.5 hours',
            category: 'Nature',
            level: 'Everyone',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=400'
        },
        {
            id: 'ws-7',
            name: 'Cooking Together',
            description: 'Prepare traditional recipes and share culinary secrets across generations.',
            date: '2026-07-25',
            time: '12:30 PM',
            location: 'Community Kitchen',
            spots: 6,
            duration: '3 hours',
            category: 'Culinary',
            level: 'Everyone',
            image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400'
        },
        {
            id: 'ws-8',
            name: 'Board Games Afternoon',
            description: 'Enjoy chess, dominoes, card games, and friendly competition.',
            date: '2026-07-28',
            time: '03:30 PM',
            location: 'Recreation Room',
            spots: 25,
            duration: '2 hours',
            category: 'Games',
            level: 'Everyone',
            image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=400'
        }
    ],

    /**
     * Initializes the volunteer page.
     */
    init() {
        this.initWorkshops();
        this.renderWorkshops();
        this.renderCalendar();
        this.initJoinButtons();
    },

    /**
     * Loads workshops from localStorage or initializes them with defaults.
     */
    initWorkshops() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULT_WORKSHOPS));
        }
    },

    /**
     * Gets all workshops from localStorage.
     * @returns {Array}
     */
    getWorkshops() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },

    /**
     * Saves workshops to localStorage.
     * @param {Array} workshops 
     */
    saveWorkshops(workshops) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workshops));
    },

    /**
     * Renders the workshops grid.
     */
    renderWorkshops() {
        const grid = document.getElementById('workshops-grid');
        if (!grid) return;

        const workshops = this.getWorkshops();
        const user = window.StorageManager ? StorageManager.getUserSession() : null;
        const joinedWorkshops = user && user.joinedWorkshops ? user.joinedWorkshops : [];

        grid.innerHTML = workshops.map(ws => {
            const isJoined = joinedWorkshops.includes(ws.id);
            const btnText = isJoined ? 'Joined ✓' : 'Join Workshop';
            const btnClass = isJoined ? 'btn--outline btn--joined' : 'btn--filled';
            const spotsText = ws.spots > 0 ? `${ws.spots} spots left` : 'Fully Booked';
            const isBooked = ws.spots <= 0 && !isJoined;

            return `
                <div class="workshop-card reveal fade-in" data-id="${ws.id}">
                    <div class="workshop-card__image-wrapper">
                        <img src="${ws.image}" alt="${Helpers.escapeHTML(ws.name)}" class="workshop-card__image">
                        <span class="workshop-card__category">${Helpers.escapeHTML(ws.category)}</span>
                    </div>
                    <div class="workshop-card__content">
                        <div class="workshop-card__meta-top">
                            <span class="workshop-card__level">${Helpers.escapeHTML(ws.level)}</span>
                            <span class="workshop-card__duration">⏱️ ${Helpers.escapeHTML(ws.duration)}</span>
                        </div>
                        <h3 class="workshop-card__title">${Helpers.escapeHTML(ws.name)}</h3>
                        <p class="workshop-card__description">${Helpers.escapeHTML(ws.description)}</p>
                        <div class="workshop-card__details">
                            <div class="workshop-detail-item">📅 <strong>Date:</strong> ${Helpers.formatDate(ws.date)}</div>
                            <div class="workshop-detail-item">🕒 <strong>Time:</strong> ${Helpers.escapeHTML(ws.time)}</div>
                            <div class="workshop-detail-item">📍 <strong>Location:</strong> ${Helpers.escapeHTML(ws.location)}</div>
                        </div>
                        <div class="workshop-card__footer">
                            <span class="workshop-card__spots ${ws.spots <= 3 ? 'low-spots' : ''}">${spotsText}</span>
                            <button class="btn ${btnClass} join-workshop-btn" data-id="${ws.id}" ${isBooked ? 'disabled' : ''}>
                                ${btnText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renders the events calendar.
     */
    renderCalendar() {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;

        const workshops = this.getWorkshops();
        // Sort workshops by date
        const sorted = [...workshops].sort((a, b) => new Date(a.date) - new Date(b.date));

        calendarContainer.innerHTML = sorted.map(ws => {
            const d = new Date(ws.date);
            const dayNum = d.getDate();
            const monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            return `
                <div class="calendar-row reveal fade-in">
                    <div class="calendar-date-box">
                        <span class="calendar-month">${monthStr}</span>
                        <span class="calendar-day-num">${dayNum}</span>
                        <span class="calendar-day-name">${dayName}</span>
                    </div>
                    <div class="calendar-info-box">
                        <span class="calendar-category-tag">${Helpers.escapeHTML(ws.category)}</span>
                        <h4 class="calendar-event-title">${Helpers.escapeHTML(ws.name)}</h4>
                        <p class="calendar-event-desc">${Helpers.escapeHTML(ws.description)}</p>
                        <div class="calendar-event-meta">
                            <span>🕒 ${Helpers.escapeHTML(ws.time)}</span>
                            <span>📍 ${Helpers.escapeHTML(ws.location)}</span>
                            <span>👤 Level: ${Helpers.escapeHTML(ws.level)}</span>
                        </div>
                    </div>
                    <div class="calendar-action-box">
                        <button class="btn btn--outline btn--sm view-workshop-btn" data-id="${ws.id}">View Details</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Initializes event listeners for joining workshops.
     */
    initJoinButtons() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.join-workshop-btn');
            if (btn) {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                this.joinWorkshop(id);
            }

            const viewBtn = e.target.closest('.view-workshop-btn');
            if (viewBtn) {
                e.preventDefault();
                const id = viewBtn.getAttribute('data-id');
                // Scroll to the workshop card
                const card = document.querySelector(`.workshop-card[data-id="${id}"]`);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.classList.add('highlight-pulse');
                    setTimeout(() => card.classList.remove('highlight-pulse'), 2000);
                }
            }
        });
    },

    /**
     * Handles joining a workshop by redirecting to the existing Contact Us form.
     * @param {string} id 
     */
    joinWorkshop(id) {
        const { toPages } = window.Navbar ? Navbar.getPathPrefixes() : { toPages: 'pages/' };
        window.location.href = `${toPages}contact.html?interest=workshop&id=${id}`;
    }
};

window.Volunteer = Volunteer;

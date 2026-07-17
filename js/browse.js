// browse.js - Dynamic Stories Engine with Filtering, Sorting, and Lazy Loading

const stories = [
    {
        id: 1,
        titulo: "The evening the kitchen remembered us",
        autor: "Elena M.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
        categoria: "Drama",
        imagen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600",
        descripcion: "A warm reflection on family rituals and the way ordinary places carry emotional memories.",
        likes: 124,
        comentarios: 18,
        lecturas: 1250,
        tiempo: "7 min",
        fecha: "2026-02-15"
    },
    {
        id: 2,
        titulo: "Small habits for a calmer afternoon",
        autor: "Daniel R.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
        categoria: "Tips",
        imagen: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600",
        descripcion: "Practical advice shared with tenderness and calm, perfect for slowing down and reflecting.",
        likes: 98,
        comentarios: 12,
        lecturas: 840,
        tiempo: "4 min",
        fecha: "2026-02-18"
    },
    {
        id: 3,
        titulo: "The letters that stayed in the drawer",
        autor: "Sofia T.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150",
        categoria: "Romance",
        imagen: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600",
        descripcion: "A gentle story about love, memory and the quiet courage of keeping a promise alive.",
        likes: 210,
        comentarios: 34,
        lecturas: 1980,
        tiempo: "6 min",
        fecha: "2026-02-10"
    },
    {
        id: 4,
        titulo: "The Clockmaker's Daughter",
        autor: "Arthur P.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150",
        categoria: "Mystery",
        imagen: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=600",
        descripcion: "Every clock in the village stopped at exactly 3:47 AM. The only clue was a golden pocket watch.",
        likes: 185,
        comentarios: 29,
        lecturas: 1620,
        tiempo: "15 min",
        fecha: "2026-02-20"
    },
    {
        id: 5,
        titulo: "Garden of Forgotten Things",
        autor: "Sophie L.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150",
        categoria: "Romance",
        imagen: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?q=80&w=600",
        descripcion: "Behind the overgrown hedge lay a garden frozen in time — roses still blooming, and the echo of a laughter.",
        likes: 320,
        comentarios: 45,
        lecturas: 2450,
        tiempo: "10 min",
        fecha: "2026-02-22"
    },
    {
        id: 6,
        titulo: "The Art of Slow Living",
        autor: "Amara C.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
        categoria: "Tips",
        imagen: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600",
        descripcion: "In a world obsessed with speed, one woman's experiment with slowing down revealed profound truths.",
        likes: 142,
        comentarios: 22,
        lecturas: 1100,
        tiempo: "6 min",
        fecha: "2026-02-14"
    },
    {
        id: 7,
        titulo: "Whispers in the Dark Woods",
        autor: "Marcus V.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
        categoria: "Horror",
        imagen: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=600",
        descripcion: "They said the trees spoke at night. He didn't believe them until he heard his own name being called.",
        likes: 275,
        comentarios: 56,
        lecturas: 2150,
        tiempo: "12 min",
        fecha: "2026-02-25"
    },
    {
        id: 8,
        titulo: "The Last Alchemist of Prague",
        autor: "Helena K.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150",
        categoria: "Fantasy",
        imagen: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=600",
        descripcion: "Deep within the winding streets, a secret laboratory holds the key to turning memories into pure gold.",
        likes: 195,
        comentarios: 31,
        lecturas: 1480,
        tiempo: "9 min",
        fecha: "2026-02-19"
    },
    {
        id: 9,
        titulo: "Echoes of the Red Planet",
        autor: "Leo G.",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=150",
        categoria: "Sci-Fi",
        imagen: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600",
        descripcion: "A lone astronaut on Mars discovers a transmission that was sent from Earth... fifty years in the future.",
        likes: 230,
        comentarios: 41,
        lecturas: 1890,
        tiempo: "11 min",
        fecha: "2026-02-24"
    },
    {
        id: 10,
        titulo: "The Great Cat Caper",
        autor: "Oliver S.",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
        categoria: "Comedy",
        imagen: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600",
        descripcion: "Barnaby was no ordinary cat. He was the mastermind behind the neighborhood's most elaborate fish heist.",
        likes: 160,
        comentarios: 25,
        lecturas: 1320,
        tiempo: "5 min",
        fecha: "2026-02-21"
    },
    {
        id: 11,
        titulo: "Beyond the Misty Mountains",
        autor: "Diana W.",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=150",
        categoria: "Adventure",
        imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600",
        descripcion: "Armed with only an ancient map and her grandfather's compass, she set out to find the lost city.",
        likes: 245,
        comentarios: 38,
        lecturas: 2050,
        tiempo: "14 min",
        fecha: "2026-02-23"
    },
    {
        id: 12,
        titulo: "The Shadow in the Mirror",
        autor: "Silas N.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        categoria: "Horror",
        imagen: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600",
        descripcion: "Every time he looked in the mirror, his reflection smiled a fraction of a second after he did.",
        likes: 190,
        comentarios: 48,
        lecturas: 1550,
        tiempo: "8 min",
        fecha: "2026-02-17"
    },
    {
        id: 13,
        titulo: "The Secret of the Lighthouse",
        autor: "Clara B.",
        avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=150",
        categoria: "Mystery",
        imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
        descripcion: "The lighthouse had been abandoned for decades, yet every stormy night, its light still swept across the sea.",
        likes: 205,
        comentarios: 33,
        lecturas: 1720,
        tiempo: "10 min",
        fecha: "2026-02-16"
    },
    {
        id: 14,
        titulo: "A Song for the Stars",
        autor: "Julian P.",
        avatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=150",
        categoria: "Fantasy",
        imagen: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600",
        descripcion: "A young musician discovers that playing certain chords can summon starlight down to earth.",
        likes: 178,
        comentarios: 27,
        lecturas: 1290,
        tiempo: "8 min",
        fecha: "2026-02-12"
    },
    {
        id: 15,
        titulo: "The Laughing Baker",
        autor: "Marta S.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150",
        categoria: "Comedy",
        imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600",
        descripcion: "Whoever ate Marta's special sourdough bread couldn't stop laughing for at least ten minutes.",
        likes: 155,
        comentarios: 20,
        lecturas: 1180,
        tiempo: "6 min",
        fecha: "2026-02-11"
    }
];

// State variables
let currentCategory = "Todos";
let currentSort = "populares";
let searchQuery = "";
const savedStories = new Set();

// DOM Elements
const storiesGrid = document.getElementById("stories-grid");
const categoriesPills = document.getElementById("categories-pills");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
const storiesCounter = document.getElementById("stories-counter");
const backToTopBtn = document.getElementById("back-to-top");

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderSkeletonLoaders();
    setTimeout(() => {
        renderStories();
    }, 800); // Simulate loading delay for skeleton effect

    setupEventListeners();
});

// Render Skeleton Loaders
function renderSkeletonLoaders() {
    storiesGrid.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card";
        skeleton.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-content">
                <div class="skeleton-text title"></div>
                <div class="skeleton-text desc"></div>
                <div class="skeleton-text desc"></div>
                <div class="skeleton-text desc-short"></div>
            </div>
        `;
        storiesGrid.appendChild(skeleton);
    }
}

// Render Stories based on current filters and sorting
function renderStories() {
    // Load local stories from localStorage if any
    const localStories = JSON.parse(localStorage.getItem('local_stories') || '[]');
    
    // Combine default stories with user uploaded stories
    let combinedStories = [...stories];
    
    // Avoid duplicates if already in array
    localStories.forEach(ls => {
        if (!combinedStories.some(s => s.id === ls.id)) {
            combinedStories.unshift(ls); // Put new stories at the beginning
        }
    });

    // Filter by Category
    let filtered = combinedStories;
    if (currentCategory !== "Todos" && currentCategory !== "All") {
        filtered = combinedStories.filter(s => s.categoria.toLowerCase() === currentCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(s => 
            s.titulo.toLowerCase().includes(query) ||
            s.autor.toLowerCase().includes(query) ||
            s.categoria.toLowerCase().includes(query)
        );
    }

    // Sort
    if (currentSort === "populares") {
        filtered.sort((a, b) => b.likes - a.likes);
    } else if (currentSort === "recientes") {
        filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (currentSort === "lecturas") {
        filtered.sort((a, b) => b.lecturas - a.lecturas);
    }

    // Update Counter
    storiesCounter.textContent = `Showing ${filtered.length} stor${filtered.length === 1 ? "y" : "ies"}`;

    // Clear Grid
    storiesGrid.innerHTML = "";

    if (filtered.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-stories">
                <div class="no-stories__icon">📭</div>
                <h3 class="no-stories__title">No stories available for this category</h3>
                <p class="no-stories__desc">Try exploring another category or check back later.</p>
            </div>
        `;
        return;
    }

    // Render Cards
    filtered.forEach((story, index) => {
        const isFeatured = story.lecturas >= 1800;
        const isSaved = savedStories.has(story.id);

        const card = document.createElement("article");
        card.className = "story-card";
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="story-card__img-container">
                <img data-src="${story.imagen}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3C/svg%3E" alt="${story.titulo}" class="story-card__img lazy-load">
                <div class="story-card__badges">
                    <span class="badge badge--category">${story.categoria}</span>
                    ${isFeatured ? `<span class="badge badge--featured">Featured</span>` : ""}
                </div>
            </div>
            <div class="story-card__content">
                <div class="story-card__author">
                    <img src="${story.avatar}" alt="${story.autor}" class="story-card__avatar">
                    <div class="story-card__author-info">
                        <span class="story-card__author-name">${story.autor}</span>
                        <span class="story-card__read-time">${story.tiempo} read</span>
                    </div>
                </div>
                <h3 class="story-card__title">${story.titulo}</h3>
                <p class="story-card__desc">${story.descripcion}</p>
                <div class="story-card__footer">
                    <div class="story-card__stats">
                        <span class="story-card__stat" onclick="likeStory(${story.id}, this)">❤️ ${story.likes}</span>
                        <span class="story-card__stat">💬 ${story.comentarios}</span>
                        <span class="story-card__stat">👁️ ${story.lecturas}</span>
                    </div>
                    <button class="story-card__save-btn ${isSaved ? "saved" : ""}" onclick="toggleSaveStory(${story.id}, this)" aria-label="Guardar historia">
                        🔖
                    </button>
                </div>
            </div>
        `;

        storiesGrid.appendChild(card);
    });

    // Initialize Lazy Loading
    initLazyLoading();
}

// Lazy Loading Implementation
function initLazyLoading() {
    const lazyImages = document.querySelectorAll(".lazy-load");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy-load");
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => observer.observe(img));
    } else {
        // Fallback
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Category Pills
    categoriesPills.addEventListener("click", (e) => {
        const btn = e.target.closest(".pill-btn");
        if (!btn) return;

        // Update active class
        document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Filter and Render
        currentCategory = btn.dataset.category;
        renderSkeletonLoaders();
        setTimeout(() => {
            renderStories();
        }, 400);
    });

    // Sort Select
    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderSkeletonLoaders();
        setTimeout(() => {
            renderStories();
        }, 400);
    });

    // Search Input
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderStories();
    });

    // Back to Top Button Visibility
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    // Back to Top Click
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Like Story Action
window.likeStory = function (id, element) {
    const story = stories.find(s => s.id === id);
    if (story) {
        story.likes++;
        element.innerHTML = `❤️ ${story.likes}`;
        element.style.transform = "scale(1.2)";
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 200);
    }
};

// Toggle Save Story Action
window.toggleSaveStory = function (id, element) {
    if (savedStories.has(id)) {
        savedStories.delete(id);
        element.classList.remove("saved");
    } else {
        savedStories.add(id);
        element.classList.add("saved");
    }
};

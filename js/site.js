(function () {
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
});

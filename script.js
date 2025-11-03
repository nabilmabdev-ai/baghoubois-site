document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initEntranceAnimations(); // For the hero section
    initScrollAnimations();     // For the rest of the page
    initHeroParallax();         // Adds a depth effect
    initMobileMenu();
    updateCopyrightYear();
    initBackToTopButton();      // For the new scroll-to-top button
});

/**
 * Adds a "scrolled" class to the header when the page is scrolled down,
 * allowing for styling changes (e.g., background color, size).
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/**
 * Animates the hero content elements immediately on page load.
 */
function initEntranceAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    const elements = heroContent.querySelectorAll('[data-animation]');
    elements.forEach(el => {
        const delay = el.dataset.delay || '0';
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
    });
}

/**
 * Uses IntersectionObserver to trigger animations on elements as they
 * scroll into the viewport. This is more performant than scroll event listeners.
 */
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    if (!elementsToAnimate.length) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || '0';
                el.style.transitionDelay = `${delay}ms`;

                const animationType = el.dataset.animation || 'fade-up';
                el.classList.add(animationType, 'is-visible');

                // If the element is the stats container, animate its counters
                if (el.classList.contains('about-stats')) {
                    el.querySelectorAll('.stat-number').forEach(animateCounter);
                }

                observer.unobserve(el); // Stop observing after animation
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Creates a subtle parallax effect on the hero background on scroll.
 */
function initHeroParallax() {
    const heroBg = document.querySelector('.hero-background');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;
        // The 0.4 factor slows down the background's movement relative to the scroll
        heroBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
    });
}

/**
 * Animates a number from 0 to its target value.
 * @param {HTMLElement} counter The element containing the number to animate.
 */
function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3); // Easing function for a smooth effect
    let startTimestamp = null;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easeOutCubic(progress);

        counter.innerText = Math.floor(easedProgress * target);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            counter.innerText = target; // Ensure the final value is exact
        }
    }
    window.requestAnimationFrame(step);
}

/**
 * Toggles the mobile navigation menu and ensures links close the menu on click.
 * Also manages ARIA attributes for accessibility.
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (!navToggle || !mainNav) return;

    navToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Automatically updates the copyright year in the footer.
 */
function updateCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Shows/hides a "back to top" button based on scroll position and
 * handles the smooth scroll behavior on click.
 */
function initBackToTopButton() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('visible', window.scrollY > 300);
    });

    button.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
const tourSections = ["#about", "#services", "#projects", "#contact"];
const tourDelayMs = 2200;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let tourTimeoutId = null;
let tourIndex = 0;
let isTourRunning = false;

function updateTourButton() {
    const tourButton = document.getElementById("tour-button");
    if (!tourButton) {
        return;
    }

    if (isTourRunning) {
        tourButton.textContent = "Stop Tour";
        tourButton.setAttribute("aria-pressed", "true");
    } else {
        tourButton.textContent = "Start Tour";
        tourButton.setAttribute("aria-pressed", "false");
    }
}

function stopTour() {
    if (tourTimeoutId) {
        clearTimeout(tourTimeoutId);
    }

    tourTimeoutId = null;
    isTourRunning = false;
    updateTourButton();
}

function scrollToSection(selector) {
    const section = document.querySelector(selector);
    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
    });
}

function runTourStep() {
    if (!isTourRunning || tourIndex >= tourSections.length) {
        stopTour();
        return;
    }

    scrollToSection(tourSections[tourIndex]);
    tourIndex += 1;
    tourTimeoutId = setTimeout(runTourStep, tourDelayMs);
}

function startTour() {
    if (isTourRunning) {
        stopTour();
        return;
    }

    isTourRunning = true;
    tourIndex = 0;
    updateTourButton();
    runTourStep();
}

function setupTourButton() {
    const tourButton = document.getElementById("tour-button");
    if (!tourButton) {
        return;
    }

    tourButton.addEventListener("click", startTour);
    updateTourButton();
}

function setupMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("main-menu");

    if (!menuToggle || !navLinks) {
        return;
    }

    const closeMenu = () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    const openMenu = () => {
        navLinks.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 640) {
            closeMenu();
        }
    });
}

function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) {
        return;
    }

    if (prefersReducedMotion) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -24px 0px"
        }
    );

    revealElements.forEach((element) => observer.observe(element));
}

function setupActiveNavHighlight() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

    if (!sections.length || !navLinks.length) {
        return;
    }

    const setActive = (id) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("nav-link-active", isActive);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: "-10% 0px -60% 0px"
        }
    );

    sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupTourButton();
    setupRevealAnimations();
    setupActiveNavHighlight();
});




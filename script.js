// Theme initialization
const initTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
};
initTheme();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetDOM = document.querySelector(targetId);
            if (targetDOM) {
                targetDOM.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add a small offset so the nav activates slightly before the section hits top
            if (scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once element has animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 5. Scroll-based Glass Shine and 3D Effect
    const glassShine = document.querySelector('.glass-shine');
    const glassContainer = document.querySelector('.glass-container');

    if (glassShine || glassContainer) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Move shine from -150% to 200% over 800px of scroll
            if (glassShine) {
                const shinePos = Math.min((scrollY / 600) * 350 - 150, 200);
                glassShine.style.left = `${shinePos}%`;
            }

            // Dynamic 3D rotation based on scroll
            if (glassContainer) {
                const rotateY = -15 + (scrollY * 0.04);
                const rotateX = 10 - (scrollY * 0.02);

                // Clamp the rotation so it rests naturally when scrolled past
                const clampedY = Math.min(Math.max(rotateY, -15), 0);
                const clampedX = Math.min(Math.max(rotateX, 0), 10);

                glassContainer.style.transform = `rotateY(${clampedY}deg) rotateX(${clampedX}deg)`;
            }
        });
    }
});

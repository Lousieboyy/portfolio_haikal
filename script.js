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

    // 6. Scroll Progress Bar Update
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        });
    }

    // 7. Typing Animation for Hero Section
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Software Developer', 'UI/UX Enthusiast', 'Tech Explorer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // go faster when deleting
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150; // normal typing speed
            }

            // Word fully typed out
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at the end of the word
            } 
            // Word fully deleted
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex++;
                if (wordIndex >= words.length) {
                    wordIndex = 0;
                }
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing after a short initial delay matching the hero animation delay
        setTimeout(type, 1000); 
    }
});

// Global function to copy email
window.copyEmail = function() {
    const email = "mohamadhaikalrejab@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const tooltip = document.getElementById("copy-tooltip");
        tooltip.innerHTML = "Copied!";
        tooltip.classList.add("show");
        
        setTimeout(() => {
            tooltip.classList.remove("show");
            // Reset text after tooltip fades
            setTimeout(() => {
                tooltip.innerHTML = "Copy to clipboard";
            }, 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy info: ', err);
    });
};

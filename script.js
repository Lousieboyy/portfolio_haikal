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

    // 0. Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            }, { once: true });
        }, 2500);
    }

    // 1. Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function closeMobileNav() {
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('open');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    function openMobileNav() {
        if (hamburger && navLinks) {
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            navLinks.classList.add('open');
            if (mobileOverlay) mobileOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.contains('active');
            if (isOpen) closeMobileNav();
            else openMobileNav();
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileNav);
    }

    // 2. Smooth Scrolling for Navigation Links
    const navLinksAll = document.querySelectorAll('.nav-links a');
    navLinksAll.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetDOM = document.querySelector(targetId);
            if (targetDOM) {
                targetDOM.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            closeMobileNav();
        });
    });

    // 3. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    });

    // 4. Scroll Animations using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // 5. Theme Toggle
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
            if (typeof initParticles === 'function') initParticles();
        });
    }

    // 6. Scroll-based Glass Shine and 3D Effect
    const glassShine = document.querySelector('.glass-shine');
    const glassContainer = document.querySelector('.glass-container');
    if (glassShine || glassContainer) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (glassShine) {
                const shinePos = Math.min((scrollY / 600) * 350 - 150, 200);
                glassShine.style.left = `${shinePos}%`;
            }
            if (glassContainer) {
                const rotateY = -15 + (scrollY * 0.04);
                const rotateX = 10 - (scrollY * 0.02);
                glassContainer.style.transform = `rotateY(${Math.min(Math.max(rotateY, -15), 0)}deg) rotateX(${Math.min(Math.max(rotateX, 0), 10)}deg)`;
            }
        });
    }

    // 7. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
            scrollProgress.setAttribute('aria-valuenow', Math.round(scrollPercent));
        });
    }

    // 8. Typing Animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Software Developer', 'UI/UX Enthusiast', 'Tech Explorer'];
        let wordIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;
        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    // 9. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 500);
        });
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, null, '#home');
        });
    }

    // 10. Animated Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        let statsAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) statsObserver.observe(statsGrid);

        function animateCounters() {
            statNumbers.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
                const duration = 2000;
                const startTime = performance.now();
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const currentValue = eased * target;
                    counter.textContent = decimals > 0 ? currentValue.toFixed(decimals) : Math.floor(currentValue);
                    if (progress < 1) requestAnimationFrame(updateCounter);
                    else counter.textContent = decimals > 0 ? target.toFixed(decimals) : target;
                }
                requestAnimationFrame(updateCounter);
            });
        }
    }

    // 11. Project Filter Tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-status') === filter) {
                    card.classList.remove('filter-hidden');
                } else {
                    card.classList.add('filter-hidden');
                }
            });
        });
    });

    // 12. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('form-submit');
            const submitText = submitBtn.querySelector('.submit-text');
            const submitLoading = submitBtn.querySelector('.submit-loading');
            submitText.style.display = 'none';
            submitLoading.style.display = 'inline';
            submitBtn.disabled = true;
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    submitText.textContent = '✓ Message Sent!';
                    submitText.style.display = 'inline';
                    submitLoading.style.display = 'none';
                    contactForm.reset();
                    setTimeout(() => {
                        submitText.textContent = 'Send Message';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                submitText.textContent = '✗ Error. Try again.';
                submitText.style.display = 'inline';
                submitLoading.style.display = 'none';
                setTimeout(() => {
                    submitText.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // 13. Particle Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function initParticles() {
            if (animationId) cancelAnimationFrame(animationId);
            const heroSection = document.getElementById('home');
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const particleColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.3 + 0.05,
                    color: particleColor
                });
            }
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `${p.color}${p.opacity})`;
                    ctx.fill();
                });
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `${particles[i].color}${0.06 * (1 - dist / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
                animationId = requestAnimationFrame(animate);
            }
            animate();
        }

        window.initParticles = initParticles;
        initParticles();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(initParticles, 200);
        });
    }

    // 14. Currently Learning Bars Animation
    const learningBars = document.querySelectorAll('.learning-bar');
    if (learningBars.length > 0) {
        const learningObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = `${targetWidth}%`;
                    }, 200);
                    learningObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.4 });
        learningBars.forEach(bar => learningObserver.observe(bar));
    }

    // 15. Custom Cursor
    const customCursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');

    if (customCursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (!customCursor.classList.contains('visible')) {
                customCursor.classList.add('visible');
                cursorDot.classList.add('visible');
            }
        });

        function animateCursor() {
            dotX += (cursorX - dotX) * 0.15;
            dotY += (cursorY - dotY) * 0.15;
            customCursor.style.left = `${dotX}px`;
            customCursor.style.top = `${dotY}px`;
            cursorDot.style.left = `${cursorX}px`;
            cursorDot.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .pill, .badge-chip, .project-card, input, textarea, .filter-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
        });

        document.addEventListener('mouseleave', () => {
            customCursor.classList.remove('visible');
            cursorDot.classList.remove('visible');
        });
        document.addEventListener('mouseenter', () => {
            customCursor.classList.add('visible');
            cursorDot.classList.add('visible');
        });

        // Cursor Particle Burst on Click
        document.addEventListener('click', (e) => {
            const burstCount = 12;
            const colors = ['#ff0f7b', '#f89b29', '#06b6d4', '#a855f7'];
            for (let i = 0; i < burstCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'cursor-particle';
                const size = Math.random() * 6 + 3;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = `${e.clientX}px`;
                particle.style.top = `${e.clientY}px`;
                document.body.appendChild(particle);

                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 50 + 20;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;

                particle.animate([
                    { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
                    { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: Math.random() * 400 + 400,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }).onfinish = () => particle.remove();
            }
        });
    }

});

// Global function to copy email
window.copyEmail = function () {
    const email = "mohamadhaikalrejab@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const tooltip = document.getElementById("copy-tooltip");
        tooltip.innerHTML = "Copied!";
        tooltip.classList.add("show");
        setTimeout(() => {
            tooltip.classList.remove("show");
            setTimeout(() => { tooltip.innerHTML = "Copy to clipboard"; }, 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy info: ', err);
    });
};

// 16. GitHub Live Stats
(async function fetchGitHubStats() {
    const GITHUB_USER = 'Lousieboyy';
    const langColors = {
        'JavaScript': '#f1e05a', 'Python': '#3572A5', 'Kotlin': '#A97BFF',
        'Java': '#b07219', 'HTML': '#e34c26', 'CSS': '#563d7c',
        'C#': '#178600', 'C++': '#f34b7d', 'PHP': '#4F5D95',
        'TypeScript': '#2b7489', 'Dart': '#00B4AB', 'Shell': '#89e051'
    };
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USER}`),
            fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
        ]);
        if (!userRes.ok || !reposRes.ok) return;
        const user = await userRes.json();
        const repos = await reposRes.json();

        let totalStars = 0;
        const langCount = {};
        repos.forEach(repo => {
            totalStars += repo.stargazers_count || 0;
            if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        });

        const elRepos = document.getElementById('gh-repos');
        const elStars = document.getElementById('gh-stars');
        const elFollowers = document.getElementById('gh-followers');
        if (elRepos) elRepos.textContent = user.public_repos;
        if (elStars) elStars.textContent = totalStars;
        if (elFollowers) elFollowers.textContent = user.followers;

        const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const total = sorted.reduce((s, [, v]) => s + v, 0);
        const barEl = document.getElementById('gh-lang-bar');
        const legendEl = document.getElementById('gh-lang-legend');
        if (barEl && legendEl && sorted.length > 0) {
            sorted.forEach(([lang, count]) => {
                const pct = ((count / total) * 100).toFixed(1);
                const color = langColors[lang] || '#8b949e';
                const seg = document.createElement('div');
                seg.className = 'github-lang-segment';
                seg.style.background = color;
                barEl.appendChild(seg);
                setTimeout(() => { seg.style.width = `${pct}%`; }, 350);
                const item = document.createElement('div');
                item.className = 'github-lang-item';
                item.innerHTML = `<span class="github-lang-dot" style="background:${color}"></span>${lang}`;
                legendEl.appendChild(item);
            });
        }
    } catch (e) {
        const row = document.getElementById('github-stats-row');
        if (row) row.style.display = 'none';
    }
})();

// 17. Project Detail Modal
(function initModal() {
    const modalOverlay = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    if (!modalOverlay) return;

    function openModal(card) {
        const d = card.dataset;
        const modalImg = document.getElementById('modal-image');
        const modalVideo = document.getElementById('modal-video');
        const imageWrapper = document.getElementById('modal-image-wrapper');
        
        // Handle Video/Image
        let embedUrl = null;
        if (d.demo) {
            let videoId = null;
            if (d.demo.includes('youtu.be/')) {
                videoId = d.demo.split('youtu.be/')[1].split('?')[0];
            } else if (d.demo.includes('youtube.com/watch')) {
                const urlParams = new URLSearchParams(new URL(d.demo).search);
                videoId = urlParams.get('v');
            }
            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }

        if (embedUrl) {
            modalImg.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.src = embedUrl;
            imageWrapper.style.display = 'block';
        } else if (d.image) {
            modalVideo.style.display = 'none';
            modalVideo.src = '';
            modalImg.style.display = 'block';
            modalImg.src = d.image;
            modalImg.alt = d.title || '';
            imageWrapper.style.display = 'block';
        } else {
            imageWrapper.style.display = 'none';
            modalVideo.src = '';
        }

        document.getElementById('modal-title').textContent = d.title || '';
        document.getElementById('modal-desc').textContent = d.desc || '';

        const badge = document.getElementById('modal-status-badge');
        badge.textContent = d.status === 'finished' ? 'Finished' : 'Ongoing';
        badge.className = 'modal-status-badge ' + (d.status || '');

        const pillsEl = document.getElementById('modal-tech-pills');
        pillsEl.innerHTML = '';
        (d.tech || '').split(',').forEach(t => {
            const s = document.createElement('span');
            s.className = 'pill';
            s.style.cssText = 'font-size:0.85rem;padding:0.45rem 1rem;cursor:default;';
            s.textContent = t.trim();
            pillsEl.appendChild(s);
        });

        const actionsEl = document.getElementById('modal-actions');
        actionsEl.innerHTML = '';
        if (d.repo) {
            actionsEl.innerHTML += `<a href="${d.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.9rem;"><i class="devicon-github-original colored" style="margin-right:7px;"></i>View Repository</a>`;
        }
        if (d.demo) {
            actionsEl.innerHTML += `<a href="${d.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.9rem;">Watch Demo &rarr;</a>`;
        }
        if (!d.repo && !d.demo) {
            actionsEl.innerHTML = `<span style="font-size:0.85rem;color:var(--text-muted);">Links coming soon</span>`;
        }

        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
        const modalVideo = document.getElementById('modal-video');
        if (modalVideo) modalVideo.src = ''; // stop video playback
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    if (modalClose) modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });

    document.querySelectorAll('.project-card[data-title]').forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });
})();

// 18. Force Download function
window.forceDownload = function (e, url, filename) {
    e.preventDefault();
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    // Optional: show a loading state

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            a.remove();
        })
        .catch(err => {
            console.error('Download failed, using fallback.', err);
            // Fallback to default behavior
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
};

// 19. Interactive Skills Radar Chart
(function initRadarChart() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const legendEl = document.getElementById('radar-legend');

    const skills = [
        { label: 'Mobile Dev',    value: 85, color: '#ff0f7b' },
        { label: 'Web Dev',       value: 80, color: '#f89b29' },
        { label: 'Backend / AI',  value: 65, color: '#a855f7' },
        { label: 'UI/UX Design',  value: 70, color: '#06b6d4' },
        { label: 'Version Ctrl',  value: 88, color: '#22c55e' },
        { label: 'Problem Solving',value: 82, color: '#f43f5e' },
    ];

    const N = skills.length;
    const CX = canvas.width / 2;
    const CY = canvas.height / 2;
    const RADIUS = canvas.width * 0.38;
    const LEVELS = 5;
    const ANGLE_STEP = (Math.PI * 2) / N;

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'radar-tooltip';
    document.body.appendChild(tooltip);

    // Build legend
    if (legendEl) {
        skills.forEach(skill => {
            const item = document.createElement('div');
            item.className = 'radar-legend-item';
            item.innerHTML = `<span class="radar-legend-dot" style="background:${skill.color}"></span>${skill.label}`;
            legendEl.appendChild(item);
        });
    }

    // Animation state
    let animProgress = 0;
    let animStartTime = null;
    const ANIM_DURATION = 1200;
    let hoveredIndex = -1;

    function getIsDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function getPointCoords(index, fraction) {
        const angle = ANGLE_STEP * index - Math.PI / 2;
        const r = RADIUS * fraction;
        return {
            x: CX + r * Math.cos(angle),
            y: CY + r * Math.sin(angle)
        };
    }

    function draw(progress) {
        const isDark = getIsDark();
        const gridColor   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
        const labelColor  = isDark ? 'rgba(240,242,245,0.75)' : 'rgba(30,30,30,0.7)';
        const axisColor   = isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(0,0,0,0.08)';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw concentric grid rings
        for (let lvl = 1; lvl <= LEVELS; lvl++) {
            const frac = lvl / LEVELS;
            ctx.beginPath();
            for (let i = 0; i < N; i++) {
                const pt = getPointCoords(i, frac);
                i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
            }
            ctx.closePath();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axis lines from centre to each vertex
        for (let i = 0; i < N; i++) {
            const pt = getPointCoords(i, 1);
            ctx.beginPath();
            ctx.moveTo(CX, CY);
            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = axisColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Draw filled radar polygon (animated)
        ctx.beginPath();
        skills.forEach((skill, i) => {
            const frac = (skill.value / 100) * progress;
            const pt = getPointCoords(i, frac);
            i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();

        // Gradient fill
        const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, RADIUS);
        grad.addColorStop(0, isDark ? 'rgba(121,40,202,0.35)' : 'rgba(255,15,123,0.18)');
        grad.addColorStop(1, isDark ? 'rgba(255,0,128,0.12)' : 'rgba(248,155,41,0.08)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = isDark ? '#a855f7' : '#ff0f7b';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw vertex dots
        skills.forEach((skill, i) => {
            const frac = (skill.value / 100) * progress;
            const pt = getPointCoords(i, frac);
            const isHovered = hoveredIndex === i;

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, isHovered ? 9 : 6, 0, Math.PI * 2);
            ctx.fillStyle = skill.color;
            ctx.fill();
            ctx.strokeStyle = isDark ? '#0f1115' : '#ffffff';
            ctx.lineWidth = isHovered ? 3 : 2;
            ctx.stroke();

            if (isHovered) {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = skill.color + '33';
                ctx.fill();
            }
        });

        // Draw axis labels
        skills.forEach((skill, i) => {
            const angle = ANGLE_STEP * i - Math.PI / 2;
            const labelR = RADIUS + 32;
            const lx = CX + labelR * Math.cos(angle);
            const ly = CY + labelR * Math.sin(angle);

            ctx.font = hoveredIndex === i
                ? 'bold 13px Inter, sans-serif'
                : '12px Inter, sans-serif';
            ctx.fillStyle = hoveredIndex === i ? skill.color : labelColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(skill.label, lx, ly);
        });

        // Percentage labels at level rings (right axis)
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)';
        ctx.textAlign = 'left';
        for (let lvl = 1; lvl <= LEVELS; lvl++) {
            const frac = lvl / LEVELS;
            const pt = getPointCoords(0, frac);
            ctx.fillText(`${lvl * 20}%`, pt.x + 4, pt.y - 4);
        }
    }

    function animate(ts) {
        if (!animStartTime) animStartTime = ts;
        const elapsed = ts - animStartTime;
        animProgress = Math.min(elapsed / ANIM_DURATION, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - animProgress, 3);
        draw(eased);
        if (animProgress < 1) requestAnimationFrame(animate);
    }

    // Kick off animation when section enters viewport
    const radarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animStartTime = null;
                animProgress = 0;
                requestAnimationFrame(animate);
                radarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    radarObserver.observe(canvas);

    // Re-draw on theme change (observe attribute mutation)
    const themeObserver = new MutationObserver(() => {
        draw(1);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Hit detection for hover
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        let found = -1;
        skills.forEach((skill, i) => {
            const frac = skill.value / 100;
            const pt = getPointCoords(i, frac);
            const dx = mx - pt.x;
            const dy = my - pt.y;
            if (Math.sqrt(dx * dx + dy * dy) < 18) found = i;
        });

        if (found !== hoveredIndex) {
            hoveredIndex = found;
            draw(1);
        }

        if (found !== -1) {
            const skill = skills[found];
            tooltip.textContent = `${skill.label}: ${skill.value}%`;
            tooltip.style.left = `${e.clientX + 14}px`;
            tooltip.style.top  = `${e.clientY - 36}px`;
            tooltip.classList.add('visible');
            canvas.style.cursor = 'pointer';
        } else {
            tooltip.classList.remove('visible');
            canvas.style.cursor = 'crosshair';
        }
    });

    canvas.addEventListener('mouseleave', () => {
        hoveredIndex = -1;
        tooltip.classList.remove('visible');
        draw(1);
    });

    // Window resize — redraw
    window.addEventListener('resize', () => draw(1));
})();

// 20. Visitor Counter Simulation
(function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    // Simulate page views starting from a realistic base number
    const BASE_VIEWS = 1428;
    
    // Check local storage for previous visits to make it dynamic per user
    let localViews = parseInt(localStorage.getItem('page_views')) || 0;
    
    // Increment on load
    localViews++;
    localStorage.setItem('page_views', localViews.toString());
    
    const totalViews = BASE_VIEWS + localViews;
    
    // Animate digits
    const digits = totalViews.toString().split('');
    counterEl.innerHTML = ''; // clear initial placeholder
    
    digits.forEach((digit, index) => {
        const span = document.createElement('span');
        span.className = 'digit';
        span.textContent = '0'; // start at 0
        counterEl.appendChild(span);
        
        // Simple counter roll animation
        setTimeout(() => {
            let current = 0;
            const target = parseInt(digit);
            // Even if target is 0, let it cycle visually once
            const rolls = target === 0 ? 10 : target; 
            
            const interval = setInterval(() => {
                if (current >= rolls) {
                    clearInterval(interval);
                    span.textContent = target;
                } else {
                    current++;
                    span.textContent = current % 10;
                }
            }, 60);
        }, index * 150);
    });
})();

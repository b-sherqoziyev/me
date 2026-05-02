document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Data
    let data = {};
    try {
        const response = await fetch('data.json');
        data = await response.json();
    } catch (error) {
        console.error('Data yuklashda xatolik:', error);
        return;
    }

    // 2. Global Settings
    document.title = data.site.title;
    const copyrightEl = document.getElementById('copyright-text');
    if (copyrightEl) {
        copyrightEl.innerHTML = `&copy; ${new Date().getFullYear()} ${data.site.copyright}. Barcha huquqlar himoyalangan.`;
    }

    // 3. Populate Hero Section
    const badgeEl = document.getElementById('hero-badge');
    const heroTitleEl = document.getElementById('hero-title');
    const heroPEl = document.getElementById('hero-p');
    if (badgeEl) badgeEl.textContent = data.personal.badge;
    if (heroTitleEl) heroTitleEl.textContent = data.personal.hero_title;
    if (heroPEl) heroPEl.textContent = data.personal.hero_p;

    // 4. Populate Expertise Section
    const expertiseList = document.getElementById('expertise-list');
    if (expertiseList && data.expertise) {
        data.expertise.forEach(item => {
            const card = document.createElement('div');
            card.className = 'expertise-card';
            card.innerHTML = `
                <i class="${item.icon}"></i>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            `;
            expertiseList.appendChild(card);
        });
    }

    // 5. Populate Stats Section
    const statsList = document.getElementById('stats-list');
    if (statsList && data.stats) {
        data.stats.forEach(stat => {
            const div = document.createElement('div');
            div.className = 'stat-item';
            div.innerHTML = `
                <h3>${stat.value}</h3>
                <p>${stat.label}</p>
            `;
            statsList.appendChild(div);
        });
    }

    // 6. Populate About Section
    const bioEl = document.getElementById('about-bio');
    if (bioEl) bioEl.textContent = data.personal.bio;
    const skillsList = document.getElementById('skills-list');
    if (skillsList && data.skills) {
        data.skills.forEach(skill => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            div.innerHTML = `<i class="${skill.icon}"></i> <span>${skill.name}</span>`;
            skillsList.appendChild(div);
        });
    }

    // 7. Populate Socials
    const socialsList = document.getElementById('footer-socials');
    if (socialsList) {
        data.socials.forEach(social => {
            const a = document.createElement('a');
            a.href = social.url;
            a.target = '_blank';
            a.title = social.name;
            a.innerHTML = `<i class="${social.icon}"></i>`;
            socialsList.appendChild(a);
        });
    }

    // 8. Typing Animation
    const typingElement = document.querySelector('.typing');
    const words = data.personal.roles;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        if (!typingElement) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typingElement) type();

    // 9. Telegram Mini App Visit Notification
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (!sessionStorage.getItem('notified_visit') && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            fetch('/.netlify/functions/notify-visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            }).then(() => {
                sessionStorage.setItem('notified_visit', 'true');
            }).catch(err => console.error('Visit notification error:', err));
        }
    }

    // 10. Contact Form (Simplified: No Email)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const formData = {
                name: document.getElementById('form-name').value,
                message: document.getElementById('form-message').value
            };

            submitBtn.textContent = 'Yuborilmoqda...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/.netlify/functions/send-telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Xabaringiz muvaffaqiyatli yuborildi!');
                    contactForm.reset();
                } else {
                    const err = await response.json();
                    throw new Error(err.error || 'Xatolik yuz berdi');
                }
            } catch (error) {
                alert('Xatolik: ' + error.message);
            } finally {
                submitBtn.textContent = 'Xabar yuborish';
                submitBtn.disabled = false;
            }
        });
    }

    // 11. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.padding = '10px 0';
            navbar.style.background = 'rgba(5, 8, 17, 0.95)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.background = 'rgba(5, 8, 17, 0.8)';
        }
    });

    // 12. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

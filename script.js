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
        const copyrightName = data.site.copyright ? ` ${data.site.copyright}` : "";
        copyrightEl.innerHTML = `&copy; ${new Date().getFullYear()}${copyrightName}. Barcha huquqlar himoyalangan.`;
    }

    // 3. Populate Hero Section
    const badgeEl = document.getElementById('hero-badge');
    const heroPEl = document.getElementById('hero-p');
    if (badgeEl) badgeEl.textContent = data.personal.badge;
    if (heroPEl) heroPEl.textContent = data.personal.hero_p;

    // 4. Populate About Section
    const bioEl = document.getElementById('about-bio');
    if (bioEl) bioEl.textContent = data.personal.bio;
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        data.skills.forEach(skill => {
            const span = document.createElement('span');
            span.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
            skillsList.appendChild(span);
        });
    }

    // 5. Populate Blog Section
    const blogList = document.getElementById('blog-list');
    if (blogList) {
        data.blog.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            article.innerHTML = `
                <span class="date">${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.desc}</p>
                <a href="${post.link}" class="link">O'qish <i class="fas fa-chevron-right"></i></a>
            `;
            blogList.appendChild(article);
        });
    }

    // 6. Populate Footer
    // Footer Contacts (Email, Phone)
    const footerContacts = document.getElementById('footer-contacts');
    if (footerContacts && data.contact) {
        footerContacts.innerHTML = `
            <a href="mailto:${data.contact.email}">
                <i class="fas fa-envelope"></i> ${data.contact.email}
            </a>
            <a href="tel:${data.contact.phone.replace(/\s/g, '')}">
                <i class="fas fa-phone"></i> ${data.contact.phone}
            </a>
        `;
    }

    // Footer Socials
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

    // 7. Typing Animation
    const typingElement = document.querySelector('.typing');
    const words = data.personal.roles;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 200;

    function type() {
        const currentWord = words[wordIndex];
        if (!typingElement) return;
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 200;
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

    // 8. Navbar & Smooth Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    });

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

    // 9. Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            submitBtn.textContent = 'Yuborilmoqda...';
            submitBtn.disabled = true;
            setTimeout(() => {
                alert('Xabaringiz muvaffaqiyatli yuborildi!');
                contactForm.reset();
                submitBtn.textContent = 'Xabar yuborish';
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // 10. Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    setTimeout(() => {
        document.querySelectorAll('.section, .blog-post').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }, 100);
});

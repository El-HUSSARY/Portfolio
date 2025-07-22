// === Mobile Menu Toggle ===
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// === Header Scroll Effect ===
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    animateOnScroll(); // Trigger animations on scroll
});

// === Smooth Scroll to Sections ===
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

// === Scroll-triggered Animations ===
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-title, .about-image, .about-text, .experience-card, .course-card, .contact-info, .contact-form, .project-category, .skills-category');

    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight / 1.2;

        if (position < triggerPoint) {
            el.style.animationPlayState = 'running';
        }
    });
};

window.addEventListener('load', animateOnScroll);

// === Language Switcher ===
const languageSwitcher = document.getElementById('languageSwitcher');
let currentLanguage = 'en';

const updateLanguage = () => {
    languageSwitcher.querySelector('span').textContent = currentLanguage === 'en' ? 'EN' : 'AR';

    document.querySelectorAll('[data-en], [data-ar]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = el.getAttribute(`data-${currentLanguage}`);
        } else {
            if (el.hasAttribute('title')) {
                el.title = el.getAttribute(`data-${currentLanguage}`);
            } else {
                el.innerHTML = el.getAttribute(`data-${currentLanguage}`);
            }
        }
    });

    localStorage.setItem('language', currentLanguage);
};

if (languageSwitcher) {
    languageSwitcher.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
        updateLanguage();
    });
}

// === Theme Switcher ===
const themeSwitcher = document.getElementById('themeSwitcher');
const logoImg = document.querySelector('.logo-img');
const heroImg = document.querySelector('.hero-image img');
let darkMode = true;

const updateTheme = () => {
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        logoImg.src = 'https://i.ibb.co/5XFhFN6d/Web-Logo-1.png';
        heroImg.src = 'https://i.ibb.co/5XFhFN6d/Web-Logo-1.png';
        themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        logoImg.src = 'https://i.ibb.co/4gf8Kg9K/Web-Logo-2.png';
        heroImg.src = 'https://i.ibb.co/4gf8Kg9K/Web-Logo-2.png';
        themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
    }

    localStorage.setItem('darkMode', darkMode);

    // Smooth transition
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
};

if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
        darkMode = !darkMode;
        updateTheme();
    });
}

// === Load Saved Preferences ===
window.addEventListener('load', () => {
    // Load language
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        currentLanguage = savedLang;
        updateLanguage();
    }

    // Load theme
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
        darkMode = savedTheme === 'true';
        updateTheme();
    }
});

// === Contact Form Submission ===
const form = document.getElementById('contact-form');
const statusMsg = document.getElementById('form-status');

if (form && statusMsg) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusMsg.style.display = 'block';
                statusMsg.style.color = 'green';
                statusMsg.textContent = currentLanguage === 'ar'
                    ? '✔️ تم الإرسال بنجاح!'
                    : '✔️ Message sent successfully!';
                form.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            statusMsg.style.display = 'block';
            statusMsg.style.color = 'red';
            statusMsg.textContent = currentLanguage === 'ar'
                ? '❌ فيه مشكلة، حاول تاني.'
                : '❌ Something went wrong. Please try again.';
        }
    });
}

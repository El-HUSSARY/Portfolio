
const GOOGLE_SHEET_WEB_APP_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Enhanced Smooth Scrolling with GitHub Pages compatibility
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate offset considering fixed header
        const offset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        // Alternative method that works better with GitHub Pages
        window.history.pushState(null, null, targetId);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Fallback for browsers that don't support smooth scrolling
        if (!('scrollBehavior' in document.documentElement.style)) {
          window.scrollTo(0, offsetPosition);
        }
      }
    });
  });

  // Header scroll effect
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Active nav-link highlighting while scrolling (scroll-spy)
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinkEls.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Animation on scroll with Intersection Observer (more efficient)
  const animateElements = () => {
    const elements = document.querySelectorAll('.section-title, .about-image, .about-text, .experience-card, .course-card, .contact-info, .contact-form, .project-category, .skills-category, .skill, .skill-item, .project-card');

    // Prepare skill progress bars: store their target width, then start at 0
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(bar => {
      bar.dataset.targetWidth = bar.style.width || '0%';
      bar.style.width = '0%';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';

          // If this is a skills category, animate its progress bars in too
          if (entry.target.classList.contains('skills-category')) {
            entry.target.querySelectorAll('.skill-progress').forEach(bar => {
              bar.style.width = bar.dataset.targetWidth;
            });
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    elements.forEach(element => {
      element.style.animationPlayState = 'paused';
      observer.observe(element);
    });
  };

  // Initialize animations
  animateElements();

  // Language Switcher
  const languageSwitcher = document.getElementById('languageSwitcher');
  let currentLanguage = localStorage.getItem('language') || 'en';

  if (languageSwitcher) {
    languageSwitcher.addEventListener('click', () => {
      currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
      updateLanguage();
      languageSwitcher.classList.remove('icon-pop');
      void languageSwitcher.offsetWidth; // restart animation
      languageSwitcher.classList.add('icon-pop');
    });

    function updateLanguage() {
      // Update button text
      const langSpan = languageSwitcher.querySelector('span');
      if (langSpan) {
        langSpan.textContent = currentLanguage === 'en' ? 'EN' : 'AR';
      }

      // Update all elements with data attributes
      document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        const attr = `data-${currentLanguage}`;
        const text = element.getAttribute(attr);
        
        if (text) {
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
          } else {
            element.innerHTML = text;
          }
        }
      });

      // Update direction for RTL languages
      document.body.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLanguage;

      // Save language preference
      localStorage.setItem('language', currentLanguage);
    }

    // Initialize language
    updateLanguage();
  }

  // Theme Switcher
  const themeSwitcher = document.getElementById('themeSwitcher');
  let darkMode = localStorage.getItem('darkMode') !== 'false';

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      darkMode = !darkMode;
      updateTheme();
      themeSwitcher.classList.remove('icon-pop');
      void themeSwitcher.offsetWidth; // restart animation
      themeSwitcher.classList.add('icon-pop');
    });

    function updateTheme() {
      const logoImg = document.querySelector('.logo-img');
      const heroImage = document.querySelector('.hero-image img');

      if (darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
      }

      // Update images if they exist
      if (logoImg && heroImage) {
        const logoDark = 'https://i.ibb.co/5XFhFN6d/Web-Logo-1.png';
        const logoLight = 'https://i.ibb.co/4gf8Kg9K/Web-Logo-2.png';
        
        logoImg.src = darkMode ? logoDark : logoLight;
        heroImage.src = darkMode ? logoDark : logoLight;
      }

      localStorage.setItem('darkMode', darkMode);

      // Smooth theme transition
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);
    }

    // Initialize theme
    updateTheme();
  }

  // Form Submission
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');

  if (form && statusMsg) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      statusMsg.style.display = 'block';
      statusMsg.textContent = currentLanguage === 'ar' ? 'جاري الإرسال...' : 'Sending...';
      statusMsg.style.color = 'var(--primary)';

      const isConfigured = GOOGLE_SHEET_WEB_APP_URL && !GOOGLE_SHEET_WEB_APP_URL.includes('PASTE_YOUR');

      const payload = {
        name: form.querySelector('#name')?.value || '',
        phone: form.querySelector('#phone')?.value || '',
        email: form.querySelector('#email')?.value || '',
        subject: form.querySelector('#subject')?.value || '',
        message: form.querySelector('#message')?.value || ''
      };

      try {
        if (isConfigured) {
          // 'no-cors' + text/plain avoids a CORS preflight that Apps Script
          // doesn't handle; we can't read the response back, but the row
          // still gets written to the Sheet successfully.
          await fetch(GOOGLE_SHEET_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          });
        } else {
          console.warn('⚠️ GOOGLE_SHEET_WEB_APP_URL is not set yet in Script.js — the form is currently only simulating submission.');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        statusMsg.style.color = 'green';
        statusMsg.textContent = currentLanguage === 'ar' ? '✔️ تم الإرسال بنجاح!' : '✔️ Message sent successfully!';
        form.reset();
        
        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 3000);
      } catch (error) {
        statusMsg.style.color = 'red';
        statusMsg.textContent = currentLanguage === 'ar' 
          ? '❌ حدث خطأ، يرجى المحاولة مرة أخرى' 
          : '❌ Something went wrong. Please try again.';
      }
    });
  }

  // Fix for GitHub Pages hash navigation
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView();
        }, 100);
      }
    }
  });
});

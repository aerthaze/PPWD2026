// Dark Mode
const DARK_KEY = 'portfolioDark';

function applyDark(dark) {
  document.body.classList.toggle('body-malam', dark);

  const hero = document.querySelector('.hero, .hero-malam');
  if (hero) {
    hero.classList.toggle('hero',       !dark);
    hero.classList.toggle('hero-malam',  dark);
  }

  const about = document.querySelector('.about, .about-malam');
  if (about) {
    about.classList.toggle('about',       !dark);
    about.classList.toggle('about-malam',  dark);
  }

  const btn = document.getElementById('dark-mode-btn');
  if (btn) {
    btn.textContent = dark ? '☀' : '🌙';
    btn.classList.toggle('is-active', dark);
  }
}

function initDarkMode() {
  const btn = document.getElementById('dark-mode-btn');
  const saved = localStorage.getItem(DARK_KEY) === 'true';
  applyDark(saved);

  if (btn) {
    btn.onclick = () => {
      const isDark = !document.body.classList.contains('body-malam');
      applyDark(isDark);
      localStorage.setItem(DARK_KEY, isDark);
    };
  }
}

// BGM Audio Control
function playBGM() {
  const bgm = document.getElementById('bgm');
  if (bgm && bgm.paused) {
    bgm.play().catch(err => console.warn('Autoplay blocked:', err));
  }
}

// Click Sound Effect
function playClickSound() {
  const clickAudio = document.getElementById('click-sound');
  if (clickAudio) {
    const sound = clickAudio.cloneNode();
    sound.volume = 0.7;
    sound.play().catch(() => {});
  }
}

// Bunyikan click sound di setiap klik
document.addEventListener('pointerdown', playClickSound, true);

// Typing Effect
let typingTimer = null;
const names = ['Web Developer', 'Motion Designer', 'UI/UX Designer'];
let nameIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const currentName = names[nameIndex];
  typingText.textContent = isDeleting
    ? currentName.substring(0, charIndex - 1)
    : currentName.substring(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  let delay = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentName.length) {
    delay = 500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    nameIndex = (nameIndex + 1) % names.length;
    delay = 500;
  }

  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(typeEffect, delay);
}

// Scroll Animations
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Bersihkan trigger lama sebelum re-init
  ScrollTrigger.getAll().forEach(t => t.kill());
  gsap.registerPlugin(ScrollTrigger);

  const fadeUp = (selector, stagger = 0.15) => {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    gsap.from(els, {
      scrollTrigger: {
        trigger: els[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger,
      ease: 'power2.out'
    });
  };

  fadeUp('.teks h1', 0);
  fadeUp('.hero .nes-container', 0);
  fadeUp('.hero-malam .nes-container', 0);
  fadeUp('.hero-content h1', 0);

  const aboutCard = gsap.utils.toArray('.about-singkat .nes-container');
  if (aboutCard.length) {
    gsap.from(aboutCard, {
      scrollTrigger: {
        trigger: aboutCard[0],
        start: 'top 92%',  
        toggleActions: 'play none none none',
      },
      y: 70,
      opacity: 0,
      scale: 0.9,
      duration: 0.9,
      ease: 'back.out(1.6)'
    });
  }

  fadeUp('#about-me');
  fadeUp('.skill-row', 0.12);

  const socialLinks = gsap.utils.toArray('.social-links a');
  if (socialLinks.length) {
    gsap.set(socialLinks, { y: 20, opacity: 0 });

    ScrollTrigger.create({
      trigger: '.social-links',
      start: 'top 100%',
      once: true,
      onEnter() {
        gsap.to(socialLinks, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: 'back.out(1.5)',
          clearProps: 'y,opacity'
        });
      }
    });

    ScrollTrigger.refresh();
  }
}

// seamless musik
function initSpaNavigation() {
  function getFilename(path) {
    const file = path.split('/').pop().split('?')[0].split('#')[0];
    return file === '' ? 'index.html' : file;
  }

  function updateActiveNav(targetUrl) {
    const targetFile = getFilename(new URL(targetUrl, window.location.href).pathname);
    document.querySelectorAll('.nav-links a').forEach(a => {
      const linkFile = getFilename(a.getAttribute('href') || '');
      if (linkFile === targetFile) {
        a.classList.add('is-primary');
      } else {
        a.classList.remove('is-primary');
      }
    });
  }

  async function loadPage(url, push = true) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        window.location.href = url;
        return;
      }
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // update title
      if (doc.title) {
        document.title = doc.title;
      }

      const newSections = doc.querySelectorAll('section');
      const currentSections = document.querySelectorAll('section');

      if (newSections.length > 0) {
        currentSections.forEach(s => s.remove());
        const footer = document.querySelector('footer');
        newSections.forEach(s => {
          if (footer) {
            footer.parentNode.insertBefore(s, footer);
          } else {
            document.body.appendChild(s);
          }
        });
      }

      // Update nav link aktif
      updateActiveNav(url);

      const isDark = localStorage.getItem(DARK_KEY) === 'true';
      applyDark(isDark);

      playBGM();

      // scroll ke atas
      window.scrollTo(0, 0);

      if (document.getElementById('typing-text')) {
        charIndex = 0;
        isDeleting = false;
        typeEffect();
      }
      initScrollAnimations();

      if (push) {
        history.pushState({ url }, '', url);
      }
    } catch (err) {
      console.warn('SPA Navigation error, falling back to full load:', err);
      window.location.href = url;
    }
  }

  // sound click
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-links a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      return;
    }

    e.preventDefault();
    const targetUrl = new URL(href, window.location.href).href;
    if (targetUrl !== window.location.href) {
      loadPage(targetUrl, true);
    }
  });

  // Handle tombol Back/Forward browser
  window.addEventListener('popstate', () => {
    loadPage(window.location.href, false);
  });
}

// Initial Page Load
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initSpaNavigation();

  const screen     = document.getElementById('loading-screen');
  const startBtn   = document.getElementById('loading-blink');
  const progressEl = document.querySelector('.nes-progress');

  // Jika sudah pernah load sebelumnya atau bukan di index
  if (!screen || !startBtn || sessionStorage.getItem('portfolioLoaded')) {
    if (screen) screen.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (document.getElementById('typing-text')) typeEffect();
    initScrollAnimations();

    // Jalankan BGM pada klik interaksi pertama jika sudah pernah load
    const resumeAudio = () => {
      playBGM();
      document.removeEventListener('click', resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
    return;
  }

  // Tampilan loading screen pertama kali
  document.body.style.overflow = 'hidden';
  startBtn.style.visibility = 'hidden';
  startBtn.style.opacity    = '0';

  if (progressEl) progressEl.value = 0;

  const counter = { val: 0 };
  gsap.to(counter, {
    val: 100,
    duration: 2.2,
    ease: 'power1.inOut',
    onUpdate() {
      if (progressEl) progressEl.value = Math.round(counter.val);
    },
    onComplete() {
      gsap.to(startBtn, {
        visibility: 'visible',
        opacity: 1,
        duration: 0.3,
        ease: 'none',
        onComplete() {
          gsap.to(startBtn, {
            opacity: 0,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'none'
          });
        }
      });
    }
  });

  screen.addEventListener('click', () => {
    playBGM();

    gsap.to(screen, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete() {
        screen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        sessionStorage.setItem('portfolioLoaded', 'true');
        if (document.getElementById('typing-text')) typeEffect();
        initScrollAnimations();
      }
    });
  }, { once: true });
});

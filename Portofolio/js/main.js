// ==========================================================
// 0. DARK MODE TOGGLE (fitur interaktif tambahan)
// ==========================================================
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
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

// ==========================================================
// 1. MOBILE HAMBURGER MENU
// ==========================================================
function setupMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ==========================================================
// 2. TYPING EFFECT (khusus Home)
// ==========================================================
function setupTypingEffect() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const names = ['Muhammad Farras Haidar Revanezka', 'Web Developer', 'Mahasiswa SI'];
    let nameIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentName = names[nameIndex];
        if (isDeleting) {
            typingText.textContent = currentName.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentName.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentName.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            nameIndex = (nameIndex + 1) % names.length;
            delay = 500;
        }

        setTimeout(typeEffect, delay);
    }

    typeEffect();
}

// ==========================================================
// 3. GENERATE PROJECT CARDS (khusus Home)
// ==========================================================
function setupProjectCards() {
    const projectGrid = document.getElementById('project-grid');
    if (!projectGrid) return;

    const projects = [
        { title: 'Website Profil', desc: 'Website profil dengan HTML & CSS murni.' },
        { title: 'Kalkulator JS', desc: 'Kalkulator interaktif menggunakan JavaScript.' },
        { title: 'Form Interaktif', desc: 'Form pendaftaran dengan validasi input.' }
    ];

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.desc}</p>
        `;

        card.addEventListener('click', () => {
            alert(`Anda memilih proyek: ${project.title}`);
        });

        projectGrid.appendChild(card);
    });
}

// ==========================================================
// 4. CONTACT FORM (khusus Contact)
// ==========================================================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        status.textContent = 'Pesan berhasil dikirim. Terima kasih!';
        status.style.color = 'var(--primary)';
        form.reset();
    });
}

// ==========================================================
// INIT
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupMobileNav();
    setupTypingEffect();
    setupProjectCards();
    setupContactForm();
});
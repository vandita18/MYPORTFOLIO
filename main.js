const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ===== Mobile menu ===== */
const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');

function setMenu(open){
    navMenu.classList.toggle('show', open);
    navToggle.setAttribute('aria-expanded', open);
    navToggle.innerHTML = open ? "<i class='bx bx-x'></i>" : "<i class='bx bx-menu'></i>";
}

navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('show')));
$$('.nav__link').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ===== Theme toggle ===== */
const themeToggle = $('#theme-toggle');
const root = document.documentElement;

function updateThemeIcon(){
    const isDark = root.dataset.theme === 'dark';
    themeToggle.innerHTML = isDark ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
}
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    updateThemeIcon();
});

/* ===== Header shadow, scroll progress, back-to-top ===== */
const header = $('#header');
const progress = $('#scroll-progress');
const toTop = $('#to-top');

function onScroll(){
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', y > 20);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

/* ===== Active nav link ===== */
const sections = $$('main section[id]');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.nav__link').forEach(l => l.classList.remove('active-link'));
        $(`.nav__link[href="#${entry.target.id}"]`)?.classList.add('active-link');
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(sec => sectionObserver.observe(sec));

/* ===== Reveal on scroll (staggered) ===== */
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
    });
}, { threshold: 0.12 });

$$('.reveal').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = (siblings.indexOf(el) * 0.1) + 's';
    revealObserver.observe(el);
});

/* ===== Animated counters ===== */
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        let n = 0;
        const step = () => {
            n++;
            el.textContent = n;
            if (n < target) setTimeout(step, 1200 / target);
        };
        step();
        obs.unobserve(el);
    });
}, { threshold: 0.6 });
$$('.stat__num').forEach(el => counterObserver.observe(el));

/* ===== Typing effect ===== */
const typed = $('#typed');
const words = ['React apps', 'AI-powered tools', 'clean UIs', 'TypeScript projects'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion){
    let w = 0, i = words[0].length, deleting = true;
    const tick = () => {
        const word = words[w];
        i += deleting ? -1 : 1;
        typed.textContent = word.slice(0, i);

        let delay = deleting ? 50 : 100;
        if (!deleting && i === word.length){ deleting = true; delay = 1800; }
        else if (deleting && i === 0){ deleting = false; w = (w + 1) % words.length; delay = 300; }
        setTimeout(tick, delay);
    };
    setTimeout(tick, 2000);
}

/* ===== Copy email ===== */
const toast = $('#toast');
function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove('show'), 2000);
}

$('#copy-email').addEventListener('click', async () => {
    const email = $('#email-link').textContent.trim();
    try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard ✓');
    } catch (e) {
        showToast(email);
    }
});

/* ===== Footer year ===== */
$('#year').textContent = new Date().getFullYear();

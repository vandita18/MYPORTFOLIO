const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if(navToggle){
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

/* Active link */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');

    let scrollY = window.pageYOffset;

    sections.forEach(sec => {
        const sectionTop = sec.offsetTop - 50;
        const sectionHeight = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__link[href*=' + id + ']')?.classList.add('active-link');
        }
    });
});

/* Scroll animation */
ScrollReveal().reveal('.home__data, .about__img, .skills__data, .work__img', {
    delay: 200,
    distance: '50px',
    origin: 'bottom'
});

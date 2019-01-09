import Glide from '@glidejs/glide';

// Hamburger menu
const toggler = document.querySelector('.menu-toggle');

toggler.addEventListener('click', (e) => {
  e.preventDefault();
  const currentTogler = e.currentTarget;
  currentTogler.classList.toggle('is-active');
  const menuDropdown = currentTogler.parentNode;
  menuDropdown.classList.toggle('open');
  menuDropdown.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    currentTogler.classList.remove('is-active');
    menuDropdown.classList.remove('open');
  }));
});

const pageHeroLogo = document.querySelector('.page-hero__logo');
const siteMenu = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  // height of img divided because of transform positioning.
  // const bottomOfLogo = pageHeroLogo.offsetTop
  // + (pageHeroLogo.clientHeight / 2) - 30;
  const bottomOfLogo = pageHeroLogo.offsetTop
    - (pageHeroLogo.clientHeight / 2) - 30;

  if (bottomOfLogo > window.pageYOffset && siteMenu.classList.contains('scrolled')) {
    siteMenu.classList.remove('scrolled');
  } else if (bottomOfLogo < window.pageYOffset) {
    siteMenu.classList.add('scrolled');
  }
});


new Glide('.page-about_gallery', {
  type: 'carousel',
  // perView: 3,
}).mount();

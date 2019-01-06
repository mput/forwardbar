// Hamburger menu
const toggler = document.querySelector('.menu-toggle');

toggler.addEventListener('click', (e) => {
  e.preventDefault();
  const currentTogler = e.currentTarget;
  currentTogler.classList.toggle('is-active');
  currentTogler.parentNode.classList.toggle('open');
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

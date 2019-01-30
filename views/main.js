// import '@babel/polyfill';
import WebFonts from 'webfontloader';
import Siema from 'siema';
import disableScroll from 'disable-scroll';

import './blocks/common/polyfill';
import './blocks/nav-tabs/nav-tabs';
import './blocks/accordion/accordion';
import './blocks/fullscreen-gallery/fullscreen-gallery';

WebFonts.load({
  google: {
    families: ['Exo 2:300,400:cyrillic', 'Open Sans:300,400,400i,600:cyrillic'],
  },
});

// Hamburger menu
const toggler = document.querySelector('.menu-toggle');

toggler.addEventListener('click', (e) => {
  e.preventDefault();
  const currentTogler = e.currentTarget;
  if (currentTogler.classList.contains('is-active')) {
    disableScroll.off();
  } else {
    disableScroll.on();
  }
  currentTogler.classList.toggle('is-active');
  const menuDropdown = currentTogler.parentNode;
  menuDropdown.classList.toggle('open');
  menuDropdown.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    disableScroll.off();
    currentTogler.classList.remove('is-active');
    menuDropdown.classList.remove('open');
  }));
});

const pageHeroLogo = document.querySelector('.page-hero__logo');
const siteMenu = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  const bottomOfLogo = pageHeroLogo.offsetTop
    - (pageHeroLogo.clientHeight / 2) - 30;

  if (bottomOfLogo > window.pageYOffset && siteMenu.classList.contains('scrolled')) {
    siteMenu.classList.remove('scrolled');
  } else if (bottomOfLogo < window.pageYOffset) {
    siteMenu.classList.add('scrolled');
  }
});


const carousels = document.querySelectorAll('.carousel');

Siema.prototype.addBullets = function addBullets() {
  const count = this.innerElements.length;
  const bulletsContainer = this.selector.parentNode.querySelector('.carousel__bullets');
  if (count === 0 || !bulletsContainer) {
    return false;
  }
  bulletsContainer.innerHtml = '';
  for (let i = 0; i < count; i += 1) {
    const btn = document.createElement('button');
    btn.dataset.index = i;
    btn.classList.add('carousel__bullet');
    if (i === this.currentSlide) {
      btn.classList.add('active');
    }
    btn.classList.add('carousel__bullet');
    btn.addEventListener('click', () => this.goTo(i));
    bulletsContainer.appendChild(btn);
  }

  // const remeberChange = this.config.onChange;

  this.config.onChange = function onChange() {
    setTimeout(() => {
      this.resizeHandler();
      console.log('change with bullets');
    }, 400);
    this.selector.parentNode.querySelector('.carousel__bullets .active').classList.remove('active');
    this.selector.parentNode.querySelector('.carousel__bullets').children[this.currentSlide].classList.add('active');
  };
  return true;
};

carousels.forEach((carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const siema = new Siema({
    selector: track,
    duration: 400,
    loop: carousel.dataset.loop,
    perPage: Number(carousel.dataset.perPage) || {
      720: 2,
      960: 3,
    },
    onInit() {
      setTimeout(() => {
        this.resizeHandler();
      }, 400);
    },
    onChange() {
      setTimeout(() => {
        this.resizeHandler();
        console.log('change');
      }, 400);
    },
  });
  const leftBtn = carousel.querySelector('.carousel__arrow--left');
  const rightBtn = carousel.querySelector('.carousel__arrow--right');
  if (leftBtn && rightBtn) {
    leftBtn.addEventListener('click', () => siema.prev());
    rightBtn.addEventListener('click', () => siema.next());
  }
  siema.addBullets();

  if (Number(carousel.dataset.autoPlay)) {
    setInterval(() => siema.next(), Number(carousel.dataset.autoPlay));
  }
});

// disable outline for pressed buttons, but still works;
document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('mousedown', e => e.preventDefault());
});

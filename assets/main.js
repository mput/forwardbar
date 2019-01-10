import Siema from 'siema';

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


const carousels = document.querySelectorAll('.carousel');

const addBullet = (elm, count) => {
  for (let i = 0; i < count; i += 1) {
    const btn = document.createElement('button');
    btn.dataset.index = i;
    btn.classList.add('carousel__bullet');
    if (i === 0) {
      btn.classList.add('active');
    }
    elm.appendChild(btn);
  }
};

carousels.forEach((carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const siema = new Siema({
    selector: track,
    loop: true,
  });
  const leftBtn = carousel.querySelector('.carousel__arrow--left');
  const rightBtn = carousel.querySelector('.carousel__arrow--right');
  leftBtn.addEventListener('click', () => siema.prev());
  rightBtn.addEventListener('click', () => siema.next());

  const bulletsContainer = carousel.querySelector('.carousel__bullets');
  if (bulletsContainer) {
    addBullet(bulletsContainer, siema.innerElements.length);
    const bullets = [...bulletsContainer.children];
    bullets.forEach((blt) => {
      blt.addEventListener('click', () => {
        siema.goTo(blt.dataset.index);
      });
    });
    siema.config.onChange = () => {
      bulletsContainer.querySelector('.active').classList.remove('active');
      bullets[siema.currentSlide].classList.add('active');
    };
  }
});

// disable outline for pressed buttons, but still works;
document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('mousedown', e => e.preventDefault());
});

import Siema from 'siema';

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


  this.config.onChange = function onChange() {
    setTimeout(() => {
      this.resizeHandler();
    }, 400);
    this.selector.parentNode.querySelector('.carousel__bullets .active').classList.remove('active');
    this.selector.parentNode.querySelector('.carousel__bullets').children[this.currentSlide].classList.add('active');
  };
  return true;
};

const carouselInit = () => carousels.forEach((carousel) => {
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

carouselInit();

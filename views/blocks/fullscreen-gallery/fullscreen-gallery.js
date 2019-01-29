import disableScroll from 'disable-scroll';

const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

importAll(require.context('../../img/menu/', true, /\.jpg$/));

function noscroll() {
  window.scrollTo(document.documentElement.scrollLeft, document.documentElement.scrollTop);
  console.log(document.documentElement.scrollLeft, document.documentElement.scrollTop);
}

const gallery = document.querySelector('.fullscreen-gallery');
const clozeBtn = document.querySelector('.fullscreen-gallery__button');
const nextBtn = gallery.querySelector('.photo-arrow--right');
const prevBtn = gallery.querySelector('.photo-arrow--left');
const galleryImg = gallery.querySelector('img');
const links = document.querySelectorAll('.fullscreen-gallery__link');
let curElm;

const getNext = n => n === links.length - 1 ? 0 : n + 1;
const getPrev = n => n === 0 ? links.length - 1 : n - 1;

const getRealUrl = (elm) => {
  const getLinkUrl = linkElm => `./${linkElm.getAttribute('href')}`;
  const linkUrl = getLinkUrl(elm);
  return cache[linkUrl];
};

const openImage = (linkNumber) => {
  curElm = linkNumber;
  const elm = links[linkNumber];
  galleryImg.src = getRealUrl(elm);
  const figcaption = gallery.querySelector('.fullscreen-gallery__figcaption');
  figcaption.innerHTML = elm.dataset.text;
};

const deactivateGallery = () => {
  gallery.classList.remove('show');
  disableScroll.off();
};

const activateGallery = () => {
  gallery.classList.add('active');
  setTimeout(() => {
    gallery.classList.add('show');
  }, 1);
  disableScroll.on();
};

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const elm = e.currentTarget;
    const elmNumber = Array.from(links).findIndex(node => elm.isSameNode(node));
    activateGallery();
    openImage(elmNumber);
  });
});

// gallery.addEventListener('click', (e) => {
//   e.preventDefault();
//   if (e.currentTarget.isSameNode(e.target)) {
//     deactivateGallery();
//   }
// });

clozeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  deactivateGallery();
});

nextBtn.addEventListener('click', () => openImage(getNext(curElm)));
prevBtn.addEventListener('click', () => openImage(getPrev(curElm)));
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      openImage(getNext(curElm));
      break;
    case 'ArrowLeft':
      openImage(getPrev(curElm));
      break;
    default:
  }
});

gallery.addEventListener('transitionend', (e) => {
  if (!e.currentTarget.classList.contains('show')) {
    e.currentTarget.classList.remove('active');
  }
}, false);

const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

importAll(require.context('../../img/menu/', true, /\.jpg$/));

console.log(cache);

const gallery = document.querySelector('.fullscreen-gallery');
const nextBtn = gallery.querySelector('.photo-arrow--right');
const prevBtn = gallery.querySelector('.photo-arrow--left');
const galleryImg = gallery.querySelector('img');
const links = document.querySelectorAll('.fullscreen-gallery__link');
let curElm;

const getNext = n => n === links.length - 1 ? 0 : n + 1;
const getPrev = n => n === 0 ? links.length - 1 : n - 1;

const getRealUrl = (number) => {
  console.log('getREal', number);
  const getLinkUrl = linkElm => `./${linkElm.getAttribute('href')}`;
  const linkUrl = getLinkUrl(links[number]);
  return cache[linkUrl];
};

const openImage = (linkNumber) => {
  curElm = linkNumber;
  galleryImg.src = getRealUrl(linkNumber);
};


const activateGallery = (imgNumber) => {
  gallery.classList.add('active');
  openImage(imgNumber);

  gallery.addEventListener('click', (e) => {
    if (e.currentTarget.isSameNode(e.target)) {
      gallery.classList.remove('active');
    }
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
};

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const elm = e.currentTarget;
    const elmNumber = Array.from(links).findIndex(node => elm.isSameNode(node));
    activateGallery(elmNumber);
  });
});


// openImage('./solyanka.jpg');

const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

importAll(require.context('../../img/menu/', true, /\.jpg$/));

console.log(cache);

const gallery = document.querySelector('.fullscreen-gallery');
const galleryImg = gallery.querySelector('img');

const links = document.querySelectorAll('.fullscreen-gallery__link');

const openImage = (link) => {
  galleryImg.src = cache[link];
};

openImage('./solyanka.jpg');

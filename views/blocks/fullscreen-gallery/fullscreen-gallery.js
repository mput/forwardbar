import disableScroll from 'disable-scroll';

const imgCache = {};
function importAll(r) {
  r.keys().forEach((key) => {
    imgCache[key] = r(key);
  });
}
importAll(require.context('../../img/menu/', true, /\.jpg$/));

const buildImgDataObject = (imgElements) => {
  const imgDataObject = {};
  imgElements.forEach((imgElement) => {
    const { imgSection } = imgElement.dataset;
    if (!imgDataObject[imgSection]) {
      imgDataObject[imgSection] = [];
    }
    imgDataObject[imgSection].push(imgElement.dataset);
  });
  return imgDataObject;
};

const galleryInit = (galleryElm) => {
  const clozeBtn = galleryElm.querySelector('.fullscreen-gallery__button');
  const changeButtons = galleryElm.querySelectorAll('.fullscreen-gallery__changeButton');
  const showImgLinks = document.querySelectorAll('a[data-img-name]');
  const galleryImg = galleryElm.querySelector('img');
  const figcaption = galleryElm.querySelector('.fullscreen-gallery__figcaption');

  const imgNamesObject = buildImgDataObject(showImgLinks);
  let currentImageIndex;
  let currentSectionImgDatas;
  const images = [];

  const getNextIndex = n => (n === currentSectionImgDatas.length - 1 ? 0 : n + 1);
  const getPrevIndex = n => (n === 0 ? currentSectionImgDatas.length - 1 : n - 1);
  const getRealUrl = index => imgCache[`./${currentSectionImgDatas[index].imgName}`];

  const showImg = (index) => {
    galleryImg.src = '';
    figcaption.innerHTML = ' ';
    currentImageIndex = index;
    const imgData = currentSectionImgDatas[index];
    const imgUrl = getRealUrl(index);
    const imgDescription = imgData.description;
    galleryImg.src = imgUrl;
    galleryImg.onload = () => {
      figcaption.innerHTML = imgDescription;
      images[index] = galleryImg;
      [getPrevIndex(currentImageIndex), getNextIndex(currentImageIndex)].forEach((ind) => {
        if (!images[ind]) {
          const img = new Image();
          img.src = getRealUrl(ind);
          images[ind] = img;
        }
      });
    };
  };

  const openGallery = (event) => {
    event.preventDefault();
    galleryElm.classList.add('active');
    setTimeout(() => galleryElm.classList.add('show'), 0);
    disableScroll.on();

    const { imgSection, imgName } = event.currentTarget.dataset;
    currentSectionImgDatas = imgNamesObject[imgSection];
    const imageIndex = currentSectionImgDatas.findIndex(imgData => imgData.imgName === imgName);
    showImg(imageIndex);
  };
  const closeGallery = (event) => {
    event.preventDefault();
    galleryElm.classList.remove('show');
    disableScroll.off();
  };
  const changeImg = (event) => {
    event.preventDefault();
    const { direction } = event.currentTarget.dataset;
    if (direction === 'next') showImg(getNextIndex(currentImageIndex));
    if (direction === 'prev') showImg(getPrevIndex(currentImageIndex));
  };

  showImgLinks.forEach(showImgLink => showImgLink.addEventListener('click', openGallery));
  changeButtons.forEach(changeButton => changeButton.addEventListener('click', changeImg));
  clozeBtn.addEventListener('click', closeGallery);
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowRight':
        showImg(getPrevIndex(currentImageIndex));
        break;
      case 'ArrowLeft':
        showImg(getNextIndex(currentImageIndex));
        break;
      default:
    }
  });
  galleryElm.addEventListener('transitionend', (e) => {
    if (!e.currentTarget.classList.contains('show')) {
      e.currentTarget.classList.remove('active');
    }
  }, false);
};

galleryInit(document.querySelector('.fullscreen-gallery'));

import WebFonts from 'webfontloader';
import SmoothScroll from 'smooth-scroll';

import './blocks/common/polyfill';
import './blocks/carousel/carousel';
import './blocks/menu-toggle/menu-toggle';
import './blocks/page-hero/page-hero';
import './blocks/nav-tabs/nav-tabs';
import './blocks/accordion/accordion';
import './blocks/fullscreen-gallery/fullscreen-gallery';

const reqFavicons = require.context('./img/favicon', true, /\.(png|jpg|gif|svg|ico)/);
reqFavicons.keys().forEach(reqFavicons);

WebFonts.load({
  google: {
    families: ['Exo 2:300,400:cyrillic', 'Open Sans:300,400,400i,600:cyrillic'],
  },
});

SmoothScroll('[data-scroll]', {
  speed: 900,
  speedAsDuration: true,
  easing: 'easeInOutCubic',
});

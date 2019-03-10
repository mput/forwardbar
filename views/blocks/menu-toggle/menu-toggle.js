import disableScroll from 'disable-scroll';

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

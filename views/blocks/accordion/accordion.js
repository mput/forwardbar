const tabs = document.querySelectorAll('.accordion');

const toogleItem = (e) => {
  e.preventDefault();
  const item = e.target.closest('.accordion').querySelector('.accordion__item');
  if (item.style.maxHeight) {
    item.style.maxHeight = null;
  } else {
    item.style.maxHeight = `${item.scrollHeight}px`;
  }
};

const addButtonEvent = (tab) => {
  const buttons = tab.querySelectorAll('.accordion__handler');
  buttons.forEach(btn => btn.addEventListener('click', toogleItem));
};

tabs.forEach(tab => addButtonEvent(tab));

const tabs = document.querySelectorAll('.nav-tabs');

const changePane = (e) => {
  e.preventDefault();
  const navTab = e.target.closest('.nav-tabs');
  const tabItem = e.target.closest('.nav-tabs__item');
  const tabId = tabItem.dataset.tab;
  const currentActiveTab = navTab.querySelector('.nav-tabs__item.active');
  const currentActivePane = navTab.querySelector('.nav-tabs__pane.active');
  const nextActivePane = navTab.querySelector(`#${tabId}`);

  currentActiveTab.classList.remove('active');
  tabItem.classList.add('active');
  currentActivePane.classList.remove('active', 'show');
  nextActivePane.classList.add('active', 'show');
};

const addButtonEvent = (tab) => {
  const buttons = tab.querySelectorAll('.nav-tabs__link');
  buttons.forEach(btn => btn.addEventListener('click', changePane));
};

tabs.forEach(tab => addButtonEvent(tab));

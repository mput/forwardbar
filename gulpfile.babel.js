import fs, { link } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { DateTime } from 'luxon';

const dateFormat = 'dd.mm.yy';

async function getLastMenu() {
  const getLastMenuUrl = async (indexUrl, linkSelector) => {
    const { window: { document } } = await JSDOM.fromURL(indexUrl);
    const linkElm = document.querySelectorAll(linkSelector)[0];
    return linkElm.href;
  };

  const getDomOfArticle = async (url) => {
    const { window: { document } } = await JSDOM.fromURL(url);
    return document.querySelector('.article');
  };

  const getDatesFromHeader = (text) => {
    const [start, end] = text.match(/(\d{2}).(\d{2})/gm)
      .map(date => DateTime.fromFormat(date, 'dd.mm'))
      .map(date => date.toFormat(dateFormat));
    return { start, end };
  };

  const getMenu = (nodes, startDate) => {
    const nextDay = date => DateTime
      .fromFormat(date, dateFormat)
      .plus({ days: 1 })
      .toFormat(dateFormat);
    const weekdays = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
    const getWeekday = note => weekdays.find(day => note.toLowerCase().includes(day));

    const menu = [];
    let curDate = startDate;
    let state = 'before'; // 'in';
    let day = {};
    nodes.forEach((node) => {
      const note = node.textContent;
      const weekday = getWeekday(note);
      if (state === 'before' && !weekday) {
        return;
      }
      if (state === 'in' && weekday) {
        menu.push(day);
        day = {};
      }
      if (state === 'before' && weekday) {
        state = 'in';
      }
      if (weekday) {
        day.weekday = weekday;
        day.date = curDate;
        curDate = nextDay(curDate);
        day.menu = [];
      }
      if (!weekday) {
        day.menu.push(note.trim());
      }
    });
    menu.push(day);
    return menu;
  };

  const menuIndexUrl = 'https://vk.com/@lonestrikerbar';
  const linkSelector = '.author_page_block a';
  const lastMenuUrl = await getLastMenuUrl(menuIndexUrl, linkSelector);
  const article = await getDomOfArticle(lastMenuUrl);
  const dates = getDatesFromHeader(article.querySelector('h1').textContent);
  const menu = getMenu(article.childNodes, dates.start);
  if (menu[menu.length - 1].date !== dates.end) {
    console.error('Last date in header is wrong, or menu is wrong.', dates.end);
  }
  return menu;
}

const isMenuChanged = (menu, oldMenuFile = false) => {

};

const saveMenu = () => {

};

const updateMenu = () => {
  // exit with 0 - if new menu saved
  // exit with 1 - if menu stayed the same
  // exit with 10 - if some error happened
  try {
    const menu = getLastMenu();
    const menuFile = './lunchMunu.yml';
    if (isMenuChanged(menu, menuFile)) {
      saveMenu(menu, menuFile);
      return 0;
    }
    return 1;
  } catch (e) {
    console.error(e);
    return 10;
  }
};

export { getLastMenu };

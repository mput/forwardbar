import { JSDOM } from 'jsdom';
import { DateTime } from 'luxon';
import fs from 'fs';
import axios from 'axios';
import _ from 'lodash';

const fsPromise = fs.promises;

const dateFormat = 'dd.LL.yy';

async function getLastMenu(index = 0) {
  const getLastMenuUrl = async (indexUrl, linkSelector) => {
    const { window: { document } } = await JSDOM.fromURL(indexUrl);
    const linkElm = document.querySelectorAll(linkSelector)[index];
    return linkElm.href;
  };

  const getDomOfArticle = async (url) => {
    const { window: { document } } = await JSDOM.fromURL(url);
    return document.querySelector('.article');
  };

  const getDatesFromHeader = (text) => {
    const [start, end] = text.match(/(\d{2}).(\d{2})/gm)
      .map(date => DateTime.fromFormat(date, 'dd.LL'))
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

const getOldMenu = async (source, adress) => {
  let rawJSON;
  try {
    if (source === 'file') {
      rawJSON = await fsPromise.readFile(adress, 'utf8');
    }
    if (source === 'url') {
      rawJSON = await axios.get(adress);
    }
  } catch (e) {
    return false;
  }
  return JSON.parse(rawJSON);
};

const saveMenu = async (menu, fileName) => {
  await fsPromise.writeFile(fileName, JSON.stringify(menu));
};

const updateMenu = async () => {
  // exit with 0 - if new menu saved
  // exit with 1 - if menu stayed the same
  // exit with 10 - if some error happened
  const menuFileDestination = './views/data/lunchMunu.json';

  try {
    const newMenu = await getLastMenu();
    const oldMenu = await getOldMenu('file', menuFileDestination);
    if (_.isEqual(newMenu, oldMenu)) {
      console.log('Menu stayed the same, no need to update');
      process.exit(10);
    }
    await saveMenu(newMenu, menuFileDestination);
    console.log('New menu was saved');
  } catch (e) {
    console.error(e);
    console.log('Unpredicted error occured');
    process.exit(1);
  }
  process.exit(0);
};

updateMenu();

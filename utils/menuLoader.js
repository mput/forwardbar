import { JSDOM } from 'jsdom';
import { DateTime } from 'luxon';
import fs from 'fs';

const fsPromise = fs.promises;

const menuFileDestination = './views/data/lunchMunu.json';
const menuIndexUrl = 'https://vk.com/@lonestrikerbar';
const dateFormat = 'dd.LL.yy';

async function getLastMenu(beforeIdx = 0) {
  const getLastMenuUrl = async (indexUrl, selector) => {
    const { window: { document } } = await JSDOM.fromURL(indexUrl);
    const linkElm = document.querySelectorAll(selector)[beforeIdx];
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

const loadMenu = async () => {
  const menu = await getLastMenu();
  await fsPromise.writeFile(menuFileDestination, JSON.stringify(menu));
};


const isLunchOutdated = (lunchdata) => {
  const firstDayDataRaw = lunchdata[0].date;
  const firstDayData = DateTime.fromFormat(firstDayDataRaw, dateFormat);
  const weekBefore = DateTime.local().minus({ week: 1 });
  const weekAfter = DateTime.local().plus({ week: 1 });
  console.log(`First day of Lunch menu is: ${firstDayData.toFormat(dateFormat)}`);
  return (firstDayData < weekBefore || firstDayData > weekAfter);
};

const getMenu = () => {
  try {
    const lunchMenu = JSON.parse(fs.readFileSync(menuFileDestination, 'utf8'));
    if (isLunchOutdated(lunchMenu)) {
      console.log('Lunch menu was loaded but outdated, link to VK will be showed');
      return false;
    }
    return lunchMenu;
  } catch (e) {
    console.error(e);
    console.log('Lunch menu wasn\'t loaded, link to VK will be showed');
    return false;
  }
};

export { loadMenu, getMenu };

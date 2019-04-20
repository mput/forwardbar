import yaml from 'js-yaml';
import fs from 'fs';

const menuDataPath = './views/data/menu.yml';

const getRawData = path => yaml.safeLoad(fs.readFileSync(path, 'utf8'));

const proceedData = (data) => {
  const proceedItems = itemsData => Object.keys(itemsData)
    .map(name => ({
      name,
      description: itemsData[name].description,
      price: itemsData[name].price,
      img: itemsData[name].img,
    }));
  const proceedTypes = typesData => Object.keys(typesData)
    .map(typeName => ({
      name: typeName,
      items: proceedItems(typesData[typeName]),
    }));
  return Object.keys(data).reduce((acc, chapterName) => {
    const types = proceedTypes(data[chapterName]);
    return { ...acc, [chapterName]: types };
  }, {});
};

export default () => {
  const menuDataRaw = getRawData(menuDataPath);
  return proceedData(menuDataRaw);
};

import fs from 'fs';
import path from 'path';

const fsPromises = fs.promises;

export async function organize() {
  const sourceDir = path.join(__dirname, 'views');
  const destDir = path.join(sourceDir, 'blocks');

  const scssNames = async (dirName) => {
    const files = await fsPromises.readdir(dirName);
    const scss = files
      .filter(name => path.basename(name) !== 'styles.scss')
      .filter(name => path.extname(name) === '.scss');
    return scss;
  };
  const getDestDirName = name => path.join(destDir, path.parse(name).name);
  const getSrcDstNames = name => ({
    src: path.join(sourceDir, name),
    dst: path.join(getDestDirName(name), name),
  });

  const names = await scssNames(sourceDir);

  await Promise.all(names.map(name => fsPromises
    .mkdir(getDestDirName(name))
    .catch(e => e)));

  await Promise.all(names
    .map(name => getSrcDstNames(name))
    .map(({ src, dst }) => fsPromises
      .copyFile(src, dst)
      .then(() => fsPromises.unlink(src))
      .catch(e => e)));
}

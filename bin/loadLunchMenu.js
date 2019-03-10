import { loadMenu } from '../utils/menuLoader';

loadMenu().then(
  () => {
    console.log('New menu was saved');
    process.exit(0);
  },
  (e) => {
    console.error(e);
    console.log('Unpredicted error');
    process.exit(1);
  },
);

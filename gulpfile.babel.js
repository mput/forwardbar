// import gulp from 'gulp';
import connect from 'gulp-connect';

export function hello(cb) {
  console.log('Hello gulp');
  cb();
}

function defaultTask(cb) {
  console.log('Form gulp');
  // place code for your default task here
  cb();
}

export default defaultTask;

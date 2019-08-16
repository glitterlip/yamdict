import { app, dialog } from 'electron';

const path = require('path');
const fs = require('fs');
const contentsPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../../') : path.resolve(app.getAppPath(), '../../');


const Bootstrap = () => {

  checkDicts();
  checkConfigs();
};
const checkDicts = () => {
  dialog.showMessageBox({title:'checking',message:'check'});
  const dictPath = resPath + '/dicts';

  if (!fs.existsSync(dictPath)) {
    fs.mkdirSync(dictPath);
  }

  let dicts = fs.readdirSync(contentsPath + '/dicts');

  dicts.map((dict) => {
    let dest = dictPath + '/' + dict;
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(contentsPath + '/dicts' + '/' + dict, dest);
    }
  });

};
const checkConfigs = () => {

  const dbPath = resPath + '/databases';
  const builtinPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../') : path.resolve(app.getAppPath(), '../../');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);

  }
  if (!fs.existsSync(dbPath + '/notes')) {
    fs.mkdirSync(dbPath + '/notes');
  }

  try {
    fs.copyFileSync(builtinPath + '/databases/config.json', dbPath + '/config.json');
    fs.copyFileSync(builtinPath + '/databases/notes/note.json', dbPath + '/notes/note.json');
  } catch (e) {
    dialog.showMessageBox({ title: 'ok', message: e.message });

  }

};


export { Bootstrap };

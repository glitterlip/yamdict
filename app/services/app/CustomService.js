import { app } from 'electron';
import { History } from '../history/history';
import { findWord } from '../dict/DictService';
import { mainWindow } from '../../main.dev';
import { google } from 'translation.js';
const path=require('path')

const registerCustomeProtocol = () => {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }
  const args = [];
  if (!app.isPackaged) {
    args.push(path.resolve(process.argv[1]));
  }
  args.push('--');
  const PROTOCOL = 'yamdict';
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);

  app.on('second-instance', (event, argv) => {
  });

  app.on('open-url', (event, urlStr) => {
    invoke(urlStr);
  });
};

const invoke = (urlStr) => {

  const urlObj = new URL(urlStr);
  const { searchParams, host } = urlObj;
  let word = searchParams.get('word');

  if (host === 'search') {
    search(word);

  } else if (host === 'translate') {
    translate(word);
  }


};

function search(word) {
  let history = History();
  let res = findWord(word);
  res.history = history.find(word);
  history.add(word);

  mainWindow.webContents.send('search-results', res);
}

function translate(word) {
  mainWindow.show();
  google.translate(word).then(result => {

    mainWindow.webContents.send('translate-result', result);
  });
}

export { registerCustomeProtocol };

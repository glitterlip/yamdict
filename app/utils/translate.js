import { google } from 'translation.js';
const { ipcMain, dialog, app } = require('electron');

const registerTranslateEvent = () => {
  ipcMain.on('translate-request', (event, arg) => {
    google.translate(arg).then(result => {
      event.sender.send('translate-result', result);
    });
  });

  ipcMain.on('read-request', (event, arg) => {
    google.audio(arg).then(uri => {
      event.sender.send('read-result', uri);
    });

  });
};

export { registerTranslateEvent };

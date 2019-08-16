import { google } from 'translation.js';
const { ipcMain, dialog, app } = require('electron');

const registerTranslateEvent = () => {
  ipcMain.on('translate-request', (event, arg) => {
    console.log(arg); // prints "ping"
    google.translate(arg).then(result => {
      console.log(result); // prints "ping"

      event.sender.send('translate-result', result);
    });


  });

  ipcMain.on('read-request', (event, arg) => {
    google.audio(arg).then(uri => {
      console.log(uri);
      event.sender.send('read-result', uri);

    });


  });
};

export { registerTranslateEvent };

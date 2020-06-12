/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { copyFolder } from './utils/file';
import { registerTray } from './utils/tray';
import { registerDictService } from './services/dict/DictService';
// import robot from 'robotjs';

const { useCapture } = require('./utils/Capture/capture-main');
const path = require('path');
const fs = require('fs');
const os = require('os');
// const ioHook = require('iohook');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
let mainWindow = null;
let win = null;
let captureWins = [];

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

boot();

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    titleBarStyle: 'hiddenInset'
  });


  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  useCapture();

  registerTray();
  registerDictService(ipcMain, mainWindow);


  // ioHook.start(true);
  //
  // let mouseDownAt;
  // ioHook.on('mousedown', (event) => {
  //   if (event.button === 1) {
  //     mouseDownAt = +new Date();
  //   } else {
  //     mouseDownAt = 0;
  //   }
  // });
  //
  //
  // ioHook.on('mouseup', async (event) => {
  //   if (mouseDownAt && (new Date() - mouseDownAt >= 500)) {
  //
  //     const text = await getSelectedText();
  //
  //     console.log(text);
  //   }
  //
  // });
  //
  //
  // const getSelectedText = () => {
  //   return new Promise<string>((resolve, reject) => {
  //     const lastText = clipboard.readText('clipboard');
  //
  //     const platform = process.platform;
  //
  //     if (platform === 'darwin') {
  //       robot.keyTap('c', 'command');
  //     } else {
  //       robot.keyTap('c', 'control');
  //     }
  //
  //     setTimeout(() => {
  //       const content = clipboard.readText('clipboard') || '';
  //       clipboard.writeText(lastText);
  //
  //       resolve(content);
  //     }, 100);
  //   });
  // };


});
export { mainWindow };
require('./boot');

function boot() {
  global.appPath = process.env.NODE_ENV === 'development' ? __dirname : path.resolve(app.getAppPath(), '../../');
  global.resPath = path.resolve(app.getPath('userData'));
  const dbPath = resPath + '/databases';
  const dictsPath = resPath + '/dicts';
  const builtinPath = process.env.NODE_ENV === 'development' ? __dirname : path.resolve(app.getAppPath(), '../../');

  let version = app.getVersion();
  if (!fs.existsSync(resPath)) {
    fs.mkdirSync(resPath);
    fs.writeFileSync(resPath + `/${version}.local`, `${Date.now()}/${version}`);

  }
  if (!fs.existsSync(dbPath)) {
    copyFolder(builtinPath + '/databases', dbPath);
  }

  if (!fs.existsSync(dictsPath)) {
    copyFolder(builtinPath + '/dicts/', dictsPath);

  }

  if (!fs.existsSync(`${resPath}/podcasts/subscribes`)) {
    fs.mkdirSync(`${resPath}/podcasts`);
    fs.mkdirSync(`${resPath}/podcasts/subscribes/`);
    fs.mkdirSync(`${resPath}/podcasts/downloads/`);

  }
}

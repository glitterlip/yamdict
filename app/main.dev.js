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
import { app, BrowserWindow, globalShortcut,ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { copyFolder } from './utils/file';
import { registerTray} from './utils/tray';
import { registerDictService } from './services/dict/DictService';

const path = require('path');
const fs = require('fs');
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
let mainWindow = null;
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
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
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
    width: 960,
    height: 680,
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

  registerTray();
  registerDictService(ipcMain,mainWindow);

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
}

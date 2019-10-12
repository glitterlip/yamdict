import { globalShortcut, Menu } from 'electron';
import { appPath } from './config';

const electron = require('electron');
const { app, BrowserWindow, ipcMain, Tray } = require('electron');

let tray;
let trayWindow;

const registerTray = () => {
  createWindow();
  tray = new Tray(appPath + '/tray/flag.png');
  tray.on('click', function(event) {
    let position = getWindowPosition();
    toggleWindow(position.x,position.y);

  });
  globalShortcut.register('Cmd+Shift+X', () => {
    let position = electron.screen.getCursorScreenPoint();
    toggleWindow(position.x + 50, position.y + 50);
  });

  const template = [{
    label: 'Application',
    submenu: [
      { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
      { type: 'separator' },
      {
        label: 'Quit', accelerator: 'Command+Q', click: function() {
          app.quit();
        }
      }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]
  }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

};
const toggleWindow = (x = false, y = false) => {
  if (trayWindow.isVisible()) {
    trayWindow.hide();
  } else {
    showWindow(x, y);
  }
};


const createWindow = () => {
  trayWindow = new BrowserWindow({
    width: 300,
    height: 150,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      webSecurity: false
    }
  });
  trayWindow.loadURL(`file://${appPath + '/tray/tray.html'}`);


  trayWindow.on('blur', () => {
    trayWindow.hide();
  });

};

const showWindow = (x = false, y = false) => {
  const position = getWindowPosition();
  trayWindow.setPosition(x ? x : position.x, y ? y : position.y, false);
  trayWindow.show();
  trayWindow.focus();
};

const getWindowPosition = () => {
  const windowBounds = trayWindow.getBounds();//托盘菜单窗口
  const trayBounds = tray.getBounds();//托盘图标

  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};


export { registerTray, toggleWindow };

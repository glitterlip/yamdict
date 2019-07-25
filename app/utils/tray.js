const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const path = require('path');

let tray;
let trayWindow;

const registerTray = () => {
  createWindow();
  console.log(trayWindow);
  tray = new Tray(path.join(__dirname, '../flag.png'));
  tray.on('click', function(event) {
    console.log(trayWindow);
    toggleWindow(trayWindow);

    // Show devtools when command clicked
    // if (window.isVisible() && process.defaultApp && event.metaKey) {
    //   window.openDevTools({ mode: 'detach' });
    // }
  });


};
const toggleWindow = () => {
  if (trayWindow.isVisible()) {
    trayWindow.hide();
  } else {
    showWindow();
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
    transparent: false,
    webPreferences: {
      backgroundThrottling: false
    }
  });
  trayWindow.loadURL(`file://${path.join(__dirname, '../tray.html')}`);


  // Hide the window when it loses focus
  trayWindow.on('blur', () => {
    if (!trayWindow.webContents.isDevToolsOpened()) {
      trayWindow.hide();
    }
  });
};

const showWindow = () => {
  const position = getWindowPosition();
  trayWindow.setPosition(position.x, position.y, false);
  trayWindow.show();
  trayWindow.focus();
};

const getWindowPosition = () => {
  const windowBounds = trayWindow.getBounds();//托盘菜单窗口
  const trayBounds = tray.getBounds();//托盘图标
  console.log(windowBounds, trayBounds);

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};


export { registerTray, toggleWindow };

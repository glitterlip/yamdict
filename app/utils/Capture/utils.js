const { remote, screen } = require('electron');


let currentWindow = remote.getCurrentWindow();

exports.getCurrentScreen = () => {
  let { x, y } = currentWindow.getBounds();
  console.log(screen.getAllDisplays());
  let current = screen.getAllDisplays().filter(d => d.bounds.x === x && d.bounds.y === y)[0];
  console.log(screen.getAllDisplays());
  return screen.getAllDisplays()[0];
};

exports.isCursorInCurrentWindow = () => {
  let { x, y } = screen.getCursorScreenPoint();
  let {
    x: winX, y: winY, width, height
  } = currentWindow.getBounds();
  return x >= winX && x <= winX + width && y >= winY && y <= winY + height;
};

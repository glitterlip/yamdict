import { globalShortcut } from 'electron';
import { toggleWindow } from '../../utils/tray';


const init = () => {
  globalShortcut.register('Super+Alt+X', () => {
    toggleWindow();
    // dialog.showMessageBox({
    //   type: 'info',
    //   message: '你按下了全局注册的快捷键'
    // });
  });


};
export { init };

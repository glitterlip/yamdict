import { globalShortcut } from 'electron';
import { toggleWindow } from '../../utils/tray';


const init = () => {
  globalShortcut.register('Super+Alt+X', () => {
    toggleWindow();

  });


};
export { init };

import { registerTranslateEvent } from './utils/translate';
import { registerConfig } from './utils/config';
import { registerDictService, registerErrorService } from './utils/Error/main';
import { app, dialog } from 'electron';
import { Bootstrap } from './services/app/BootstrapService';


try {
  Bootstrap();

} catch (e) {
  console.log( e.message);
}
registerErrorService();
// registerTray();
registerConfig();
registerDictService();
registerTranslateEvent();
// init();

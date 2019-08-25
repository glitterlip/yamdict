import { registerTranslateEvent } from './utils/translate';
import { registerConfig } from './utils/config';
import { registerDictService, registerErrorService } from './utils/Error/main';
import { Bootstrap } from './services/app/BootstrapService';
import {init} from './services/app/AppService';

try {
  Bootstrap();

} catch (e) {
  console.log(e.message);
}
registerErrorService();
registerConfig();
registerDictService();
registerTranslateEvent();
// init();

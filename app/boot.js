import { registerTranslateEvent } from './utils/translate';
import { registerConfig } from './utils/config';
import { registerErrorService } from './utils/Error/main';
import {registerCustomeProtocol} from './services/app/CustomService';

registerErrorService();
registerConfig();
registerTranslateEvent();
registerCustomeProtocol();


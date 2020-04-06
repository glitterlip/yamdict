import { registerTranslateEvent } from './utils/translate';
import { registerConfig } from './utils/config';
import {registerCustomeProtocol} from './services/app/CustomService';

registerConfig();
registerTranslateEvent();
registerCustomeProtocol();


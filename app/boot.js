import { registerTranslateEvent } from './utils/translate';
import { registerConfig } from './utils/config';
import { registerCustomeProtocol } from './services/app/CustomService';
// import { registerIoHook } from './services/app/HookService';

registerConfig();
registerTranslateEvent();
registerCustomeProtocol();
// registerIoHook();

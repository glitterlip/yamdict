import { registerTranslateEvent } from './utils/translate';
import { registerConfig } from './utils/config';
import { registerErrorService } from './utils/Error/main';


registerErrorService();
registerConfig();
registerTranslateEvent();


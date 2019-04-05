import Window, {getWindowStack} from './Window';
import {
  WindowLifecycleEvents,
  EVT_WINDOW_CREATED,
  EVT_WINDOW_MOUNTED,
  EVT_WINDOW_TITLE_WILL_SET,
  EVT_WINDOW_TITLE_DID_SET,
  EVT_WINDOW_WILL_ACTIVATE,
  EVT_WINDOW_DID_ACTIVATE,
  EVT_WINDOW_WILL_MINIMIZE,
  EVT_WINDOW_DID_MINIMIZE,
  EVT_WINDOW_WILL_MAXIMIZE,
  EVT_WINDOW_DID_MAXIMIZE,
  EVT_WINDOW_WILL_CLOSE,
  EVT_WINDOW_DID_CLOSE,
  EVT_WINDOW_WILL_HIDE,
  EVT_WINDOW_DID_HIDE,
  EVT_WINDOW_WILL_UNHIDE,
  EVT_WINDOW_DID_UNHIDE
} from './windowEvents';

export default Window;

export {
  getWindowStack,
  WindowLifecycleEvents,
  EVT_WINDOW_CREATED,
  EVT_WINDOW_MOUNTED,
  EVT_WINDOW_TITLE_WILL_SET,
  EVT_WINDOW_TITLE_DID_SET,
  EVT_WINDOW_WILL_ACTIVATE,
  EVT_WINDOW_DID_ACTIVATE,
  EVT_WINDOW_WILL_MINIMIZE,
  EVT_WINDOW_DID_MINIMIZE,
  EVT_WINDOW_WILL_MAXIMIZE,
  EVT_WINDOW_DID_MAXIMIZE,
  EVT_WINDOW_WILL_CLOSE,
  EVT_WINDOW_DID_CLOSE,
  EVT_WINDOW_WILL_HIDE,
  EVT_WINDOW_DID_HIDE,
  EVT_WINDOW_WILL_UNHIDE,
  EVT_WINDOW_DID_UNHIDE
}
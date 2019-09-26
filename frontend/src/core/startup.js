/**
 * Shell Desktop Core startup.
 *  
 * @module core/startup
 */

// Initializes the ShellCore services
import Core from './Core';
import ShellDesktop, {
  ViewportFocusMonitor,
  ViewportSizeMonitor,
  P2PController,
  AppControlCentral,
  LocalUserController,
  WindowStackCentral
} from './ShellDesktop';
import { DOM_ROOT_ID } from 'config';

let _hasStarted = false;

/**
 * Starts up the Shell Desktop Core.
 */
const startup = async () => {
  try {
    // TODO: Move hasStarted (or equiv.) check to Core
    if (_hasStarted) {
      console.warn('Client system has already started');
      return;
    } else {
      // Display temporary "Launching" notice
      const rootEl = document.getElementById(DOM_ROOT_ID);
      rootEl.innerHTML = 'Launching Core & Desktop services';

      const core = new Core();

      const localUserController = new LocalUserController(core);

      // Mount the Shell Desktop
      const desktop = new ShellDesktop(localUserController);
      
      // Mount the Shell Desktop services
      new ViewportFocusMonitor(desktop);
      new ViewportSizeMonitor(desktop);
      new AppControlCentral(desktop);
      new WindowStackCentral(desktop);
      
      new P2PController(desktop);

      _hasStarted = true;
    }
  } catch (exc) {
    throw exc;
  }
};

export default startup; 
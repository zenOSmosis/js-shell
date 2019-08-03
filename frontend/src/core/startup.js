/**
 * Shell Desktop Core startup.
 *  
 * @module core/startup
 */

// Initializes the ShellCore services
import Core from './Core';
import ShellDesktop from './ShellDesktop';
import P2PMonitor from './p2p/P2PMonitor';
import config from 'config';

const { DOM_ROOT_ID } = config;

let _hasStarted = false;

/**
 * Starts up the Shell Desktop Core.
 */
const startup = () => {
  // TODO: Move hasStarted (or equiv.) check to Core
  if (_hasStarted) {
    console.warn('Client system has already started');
    return;
  } else {
    // Display temporary "Launching" notice
    const rootEl = document.getElementById(DOM_ROOT_ID);
    rootEl.innerHTML = 'Launching Core & Desktop services';

    const core = new Core();

    // Mount the Shell Desktop
    const desktop = new ShellDesktop(core);
    
    // Mount the P2PMonitor to the Desktop
    new P2PMonitor(desktop);

    _hasStarted = true;
  }
};

export default startup; 
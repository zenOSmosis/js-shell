// Initializes the ShellCore services
import Core from './Core';
import ShellDesktop from './ShellDesktop';
import config from 'config';
/*
import CoreNetworkController from 'process/ShellCore/CoreNetworkController';
*/

const { DOM_ROOT_ID } = config;

let hasStarted = false;

/**
 * Client-side system startup routine.
 * 
 * This should be automatically invoked when the client services startup.
 */
const startup = () => {
  if (hasStarted) {
    console.warn('Client system has already started');
    return;
  } else {
    // Display "Launching" notice
    const rootEl = document.getElementById(DOM_ROOT_ID);
    rootEl.innerHTML = 'Launching...';

    const core = new Core();

    // Mount the Shell Desktop
    new ShellDesktop(core);

    hasStarted = true;
  }
};

export default startup; 
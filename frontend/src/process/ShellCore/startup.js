// Initializes the ShellCore services
import Core from './Core';
import ShellDesktop from './ShellDesktop';
/*
import CoreNetworkController from 'process/ShellCore/CoreNetworkController';
*/

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
    const core = new Core();

    // Mount the Shell Desktop
    new ShellDesktop(core);

    hasStarted = true;
  }
};

export default startup; 
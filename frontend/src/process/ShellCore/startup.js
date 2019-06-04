// Initializes the ShellCore services

import Core from 'process/ShellCore/Core';

/*
import CoreCPUTimer from 'process/ShellCore/CoreCPUTimer';
import CoreNetworkController from 'process/ShellCore/CoreNetworkController';
import CoreReactGUI from 'process/ShellCore/CoreReactGUI';
import Desktop from 'process/ShellCore/Desktop';*/

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
    
    /*
    new CoreCPUTimer(core);

    new CoreNetworkController(core);
    
    const reactGUI = new CoreReactGUI(core);
    new Desktop(reactGUI);
    */

    hasStarted = true;
  }
};

export default startup; 
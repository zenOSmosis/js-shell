import Core from 'process/ClientCore/Core';
import CoreCPUTimer from 'process/ClientCore/CoreCPUTimer';
import CoreHTTPWorker from 'process/ClientCore/CoreHTTPWorker';
import CoreSocketIOWorker from 'process/ClientCore/CoreSocketIOWorker';
import CoreReactGUI from 'process/ClientCore/CoreReactGUI';
import Desktop from 'process/ClientCore/Desktop';

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
    new CoreCPUTimer(core);

    new CoreHTTPWorker(core);
    new CoreSocketIOWorker(core);
    
    const reactGUI = new CoreReactGUI(core);
    new Desktop(reactGUI);

    hasStarted = true;
  }
};

export default startup;
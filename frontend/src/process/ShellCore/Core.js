import ClientProcess from 'process/ClientProcess';
import CoreCPUTimer from './CoreServices/CoreCPUTimer';
// import CoreNetwork from './CoreServices/CoreNetwork';

let isCoreInit = false;

// This should be treated as a singleton
export default class Core extends ClientProcess {
  constructor() {
    super(false, (proc) => {
      if (isCoreInit) {
        throw new Error('Core is already initialized');
      }

      const className = proc.getClassName();

      console.debug(`Initializing ${className}`);

      // Core services
      new CoreCPUTimer(proc);
      // new CoreNetwork(proc);

      isCoreInit = true;

      console.debug(`${className} has initialized`);
    });
  }
}
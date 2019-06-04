import ClientProcess from 'process/ClientProcess';
import CoreCPUTimer from './CoreServices/CoreCPUTimer';
import CoreNetwork from './CoreServices/CoreNetwork';
import ShellDesktop from './GUIServices/ShellDesktop';

// TODO: Implement heartbeat monitoring from other processes

// This should be treated as a singleton
export default class Core extends ClientProcess {
  constructor() {
    super(false, (proc) => {
      console.debug('Initializing core');

      // Core services
      new CoreCPUTimer(proc);
      new CoreNetwork(proc);

      console.debug('Core has initialized');

      // Shell Desktop environment
      new ShellDesktop(proc);
    });
  }
}
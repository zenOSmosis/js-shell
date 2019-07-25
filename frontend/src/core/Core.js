import ClientProcess from 'process/ClientProcess';
import P2PMonitor from './P2PMonitor';

// This should be treated as a singleton
export default class Core extends ClientProcess {
  constructor() {
    super(false, (core) => {
      if (!core.getIsRootProcess()) {
        throw new Error('Core is not the root process');
      }

      const className = core.getClassName();

      console.debug(`Initializing ${className}`);

      new P2PMonitor(core);

      console.debug(`${className} has initialized`);
    });
  }
}
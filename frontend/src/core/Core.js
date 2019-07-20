import ClientProcess from 'process/ClientProcess';

// This should be treated as a singleton
export default class Core extends ClientProcess {
  constructor() {
    super(false, (proc) => {
      if (!proc.getIsRootProcess()) {
        throw new Error('Core is not the root process');
      }

      const className = proc.getClassName();

      console.debug(`Initializing ${className}`);

      console.debug(`${className} has initialized`);
    });
  }
}
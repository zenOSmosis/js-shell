import ClientProcess from 'process/ClientProcess';


let _hasStarted = false;

/**
 * The root process of the Shell Desktop.
 * 
 * @extends ClientProcess
 */
class Core extends ClientProcess {
  constructor() {
    if (_hasStarted) {
      throw new Error('Client system has already started');
    } else {
      _hasStarted = true;
    }

    super(false, (core) => {
      if (!core.getIsRootProcess()) {
        throw new Error('Core is not the root process');
      }

      const className = core.getClassName();

      console.debug(`Initializing ${className}`);

      // Important! If this is called, HMR support is broken at this point
      // @see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#Notes
      window.onbeforeunload = (e) => {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
      };

      console.debug(`${className} has initialized`);
    });
  }
}

export default Core;
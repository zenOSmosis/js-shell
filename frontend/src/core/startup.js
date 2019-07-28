/**
 * Shell Desktop Core startup.
 *  
 * @module core/startup
 */

// Initializes the ShellCore services
import Core from './Core';
import ShellDesktop from './ShellDesktop';

console.warn('TODO: Implement @apps, @... directory aliasing');

let hasStarted = false;

/**
 * Starts up the Shell Desktop Core.
 */
const startup = () => {
  // TODO: Move hasStarted (or equiv.) check to Core
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
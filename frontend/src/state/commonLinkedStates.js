/**
 * TODO: Remove this; some code here can't be shared between main thread and worker
 * threads
 * 
 * A collection of LinkedState instances which are intended to be shared
 * between various core services.
 */

import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from './DesktopLinkedState';
import AppRegistryLinkedState from './AppRegistryLinkedState';
import SocketLinkedState from './SocketLinkedState';

/**
 * Prevents a LinkedState instance from being able to be destroyed, by
 * overriding the destroy method usage with a thrown error.
 * 
 * @param {LinkedState} linkedStateInstance 
 */
const blockLinkedStateDestruction = (linkedStateInstance) => {
  linkedStateInstance.destroy = () => {
    throw new Error('Cannot destroy this LinkedState instance', linkedStateInstance);
  };
};

/**
 * Constructs a new LinkedState instance, blocking it from being able to be
 * destructed.
 * 
 * TODO: Replace blockLinkedStateDestruction (if present elsewhere) w/ this function.
 * 
 * @param {LinkedState} LinkedStateClass Important!  This should NOT be an
 * instance of LinkedState, but the class itself.
 * @return {LinkedState} A constructed instance of the LinkedState
 */
const createPersistentLinkedState = (LinkedStateClass) => {
  const instance = new LinkedStateClass();
  blockLinkedStateDestruction(instance);

  return instance;
};

const commonDesktopLinkedState = createPersistentLinkedState(DesktopLinkedState);
const commonAppRegistryLinkedState = createPersistentLinkedState(AppRegistryLinkedState);
const commonSocketLinkedState = createPersistentLinkedState(SocketLinkedState);

export {
  commonDesktopLinkedState,
  commonAppRegistryLinkedState,
  commonSocketLinkedState,
  EVT_LINKED_STATE_UPDATE
};
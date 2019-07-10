/**
 * A collection of LinkedState instances which are intended to be shared
 * between various core services.
 */

import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from './DesktopLinkedState';
import AppLinkedState from './AppLinkedState';
import SocketLinkedState from './SocketLinkedState';
import blockLinkedStateDestruction from 'utils/blockLinkedStateDestruction';

/**
 * Constructs a new LinkedState instance, blocking it from being able to be
 * destructed.
 * 
 * TODO: Replace blockLinkedStateDestruction w/ this function.
 * 
 * @param {*} LinkedStateClass 
 */
const createPersistentLinkedState = (LinkedStateClass) => {
  const instance = new LinkedStateClass();
  blockLinkedStateDestruction(instance);

  return instance;
};

const commonDesktopLinkedState = createPersistentLinkedState(DesktopLinkedState);
const commonAppLinkedState = createPersistentLinkedState(AppLinkedState);
const commonSocketLinkedState = createPersistentLinkedState(SocketLinkedState);

export {
  commonDesktopLinkedState,
  commonAppLinkedState,
  commonSocketLinkedState,
  EVT_LINKED_STATE_UPDATE
};
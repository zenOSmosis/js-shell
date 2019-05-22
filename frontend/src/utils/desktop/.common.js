// TODO: Create commonDesktopLinkedState here, not there
import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import AppLinkedState from 'state/AppLinkedState';

const commonDesktopLinkedState = new DesktopLinkedState();
const commonAppLinkedState = new AppLinkedState();

export {
  commonDesktopLinkedState,
  commonAppLinkedState,
  EVT_LINKED_STATE_UPDATE
};
// TODO: Create commonDesktopLinkedState here, not there
import { commonDesktopLinkedState as desktopLinkedState, EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import AppLinkedState from 'state/AppLinkedState';

const commonAppLinkedState = new AppLinkedState();

export {
  desktopLinkedState, // TODO: Export as commondDesktopLinkedState
  commonAppLinkedState,
  EVT_LINKED_STATE_UPDATE
};
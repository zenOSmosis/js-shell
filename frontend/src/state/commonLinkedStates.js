// TODO: Create commonDesktopLinkedState here, not there
import DesktopLinkedState, { EVT_LINKED_STATE_UPDATE } from './DesktopLinkedState';
import AppLinkedState from './AppLinkedState';
import blockLinkedStateDestruction from 'utils/blockLinkedStateDestruction';

const commonDesktopLinkedState = new DesktopLinkedState();
blockLinkedStateDestruction(commonDesktopLinkedState);

const commonAppLinkedState = new AppLinkedState();
blockLinkedStateDestruction(commonAppLinkedState);

export {
  commonDesktopLinkedState,
  commonAppLinkedState,
  EVT_LINKED_STATE_UPDATE
};
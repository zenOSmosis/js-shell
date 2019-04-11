import config from '../config';
import LinkedState, {EVT_BROADCAST_STATE_UPDATE} from './LinkedState';

export {
  EVT_BROADCAST_STATE_UPDATE
};

// TODO: Use UUID
const DESKTOP_LINKED_SCOPE_NAME = 'desktop-linked-scope';

export default class DesktopLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_LINKED_SCOPE_NAME, {
      contextMenuIsTrapping: config.DESKTOP_CONTEXT_MENU_IS_TRAPPING,
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      }
    });
  }
}

const desktopLinkedState = new DesktopLinkedState();

export {
  desktopLinkedState
};
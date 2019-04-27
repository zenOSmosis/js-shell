import config from '../config';
import hocConnect from './hocConnect';
import LinkedState, {EVT_LINKED_STATE_UPDATE} from './LinkedState';
import uuidv4 from 'uuid/v4';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = `desktop-linked-state-${uuidv4()}`;

export default class DesktopLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_LINKED_SCOPE_NAME, {
      desktopComponent: null,
      contextMenuIsTrapping: config.DESKTOP_CONTEXT_MENU_IS_TRAPPING,
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      }
    });
  }

  setContextMenuIsTrapping(contextMenuIsTrapping) {
    this.setState({
      contextMenuIsTrapping
    });
  }
}
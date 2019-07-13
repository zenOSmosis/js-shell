import EventEmitter from 'events';
import { commonAppRegistryLinkedState } from 'state/commonLinkedStates';

/**
 * An app registration creates a new app available in any app menus in the
 * Desktop.
 * 
 * The items in the Dock represent a filtered subset of all available
 * registrations.
 * 
 * An app registration is an in-memory object, so this class should be
 * instantiated, per referenced app, each time the Desktop loads.
 */
export default class AppRegistration extends EventEmitter {
  constructor(runProps) {
    super();

    const {
        title,
        iconSrc,
        mainWindow,
        allowMultipleWindows: propsAllowMultipleWindows 
    } = runProps;

    this._isLaunched = false;

    this._title = title;
    this._iconSrc = iconSrc;
    this._mainWindow = mainWindow;

    // Convert to boolean from run property
    this._allowMultipleWindows = (propsAllowMultipleWindows ? true : false);

    // Add this app registration to the registry
    commonAppRegistryLinkedState.addAppRegistration(this);
  }

  getIsLaunched() {
    return this._isLaunched;
  }

  launch() {
    console.warn('TODO: Implement AppRegistration launch', this);
    return;
  }

  getTitle() {
    return this._title;
  }

  getIconSrc() {
    return this._iconSrc;
  }

  getMainWindow() {
    return this._mainWindow;
  }

  unregister() {
    // Remove this app registration from the registry
    commonAppRegistryLinkedState.removeAppRegistration(this);
  }
}
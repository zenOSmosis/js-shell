import config from '../config';
// import Window from 'components/Desktop/Window';
// import AppConfig from '../utils/desktop/AppConfig';
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
      // Whether, or not, the Desktop should capture right-click context menu
      contextMenuIsTrapping: config.DESKTOP_CONTEXT_MENU_IS_TRAPPING,
      
      // Setting this will generate a new Desktop Notification
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      },

      // The most recent active Desktop window
      activeWindow: null,

      // URL redirect location
      redirectLocation: '/',

      // A list of currently running apps
      launchedAppConfigs: [],

      // The background image location of the Desktop
      backgroundURI: config.DESKTOP_DEFAULT_BACKGROUND_URI
    });
  }

  /**
   * Registers a launched Desktop app.
   * 
   * Note, technically, this launches an app, however it's best to call
   * appConfig.launch().
   *
   * @param {AppConfig} appConfig 
   */
  registerLaunchedAppConfig(appConfig) {
    const {launchedAppConfigs} = this.getState();

    launchedAppConfigs.push(appConfig);

    this.setState({
      launchedAppConfigs
    });
  }

  /**
   * Unregisters a launched Desktop app.
   * 
   * Note, technically, this closes an app, however it's best to call
   * appConfig.launch().
   * 
   * @param {*} appConfig 
   */
  unregisterLaunchedAppConfig(appConfig) {
    let {launchedAppConfigs} = this.getState();

    const appConfigUUID = appConfig.getUUID();

    launchedAppConfigs = launchedAppConfigs.filter((appConfig) => {
      const testUUID = appConfig.getUUID();

      return appConfigUUID !== testUUID;
    });

    this.setState({
      launchedAppConfigs
    });
  }

  /**
   * Sets the currently active Desktop window.
   *
   * @param {object} activeWindow TODO: Use Window property.  It currently
   * conflicts w/ DOM Window. 
   */
  setActiveWindow(activeWindow) {
    const {activeWindow: prevActiveWindow} = this.getState();

    if (!Object.is(activeWindow, prevActiveWindow)) {
      this.setState({
        activeWindow
      });
    }
  }

  getActiveWindow() {
    const {activeWindow} = this.getState();

    return activeWindow;
  }

  /**
   * Sets the Desktop's background URI.
   *
   * @param {string} backgroundURI 
   */
  setBackgroundURI(backgroundURI) {
    this.setState({
      backgroundURI
    });
  }

  /**
   * Sets whether or not the Desktop should trap the right-click context menu.
   * 
   * @param {boolean} contextMenuIsTrapping 
   */
  setContextMenuIsTrapping(contextMenuIsTrapping) {
    this.setState({
      contextMenuIsTrapping
    });
  }

  /**
   * Retrieves whether or not the Desktop is trapping the right-click context menu.
   * 
   * @return {boolean}
   */
  getContextMenuIsTrapping() {
    const {contextMenuIsTrapping} = this.getState();

    return contextMenuIsTrapping;
  }
}

const commonDesktopLinkedState = new DesktopLinkedState();
export {
  commonDesktopLinkedState
};

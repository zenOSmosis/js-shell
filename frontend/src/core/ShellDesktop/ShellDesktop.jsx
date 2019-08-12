import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

import createDesktopNotification from 'utils/desktop/createDesktopNotification';
import ClientGUIProcess, { EVT_BEFORE_EXIT } from 'process/ClientGUIProcess';
import { EVT_LINKED_STATE_UPDATE } from 'state/LinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';
import SocketLinkedState from 'state/SocketLinkedState';

import config from 'config';

const { DOM_ROOT_ID } = config;

/**
 * @type {ShellDesktop}
 */
let _shellDesktopProcess = null;

/**
 * Shell Desktop GUI Process mounts the root component of the application to
 * the DOM, and wraps it with a ClientGUIProcess.
 * 
 * @extends ClientGUIProcess
 */
class ShellDesktop extends ClientGUIProcess {
  constructor(...args) {
    if (_shellDesktopProcess) {
      throw new Error('Cannot have more than one ShellDesktop process');
    }

    super(...args);

    this._desktopLinkedState = null;
    this._socketLinkedState = null;
    this._areCommonEventsInit = false;

    // Set the process flag
    _shellDesktopProcess = this;
  }

  /**
   * Initializes the Shell Desktop.
   * 
   * @return {Promise<void>}
   */
  async _init() {
    try {
      this._desktopLinkedState = new DesktopLinkedState();

      this._desktopLinkedState.setShellDesktopProcess(this);

      this._socketLinkedState = new SocketLinkedState();

      this.on(EVT_BEFORE_EXIT, () => {
        this._desktopLinkedState.destroy();
        this._desktopLinkedState = null;

        this._socketLinkedState.destroy();
        this._socketLinkedState = null;
      });

      this.setTitle('Shell Desktop');

      const rootEl = document.getElementById(DOM_ROOT_ID);

      // Mounts the App component to the base ReactComponent
      this.setView(App);

      const ReactComponent = this.getReactComponent();
      
      // Mounts the base ReactComponent to the DOM
      ReactDOM.render(<ReactComponent />, rootEl);

      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.register();

      // TODO: Include provisioning for working with DesktopChildGUIProcess
      // focus / blur functionality, including automatically focusing the
      // Desktop if all DesktopChildGUIProcess instances are closed

      this._initCommonEvents();

      // Initialize the super
      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Initializes events for the Desktop.
   */
  _initCommonEvents() {
    if (this._areCommonEventsInit) {
      throw new Error('Common events are already init');
    } else {
      this._areCommonEventsInit = true;
    }

    // Desktop
    this._desktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      const { contextMenuIsTrapping } = updatedState;

      if (typeof contextMenuIsTrapping !== 'undefined') {
        if (contextMenuIsTrapping) {
          createDesktopNotification({
            message: 'Context Menu is trapping'
          });
        } else {
          createDesktopNotification({
            message: 'Context Menu is not trapping'
          });
        }
      }
    });

    // Socket.io
    this._socketLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      const { connectionStatus: updatedConnectionStatus } = updatedState;

      if (typeof updatedConnectionStatus !== 'undefined') {
        createDesktopNotification({
          message: `Socket.io ${updatedConnectionStatus}`
        });
      }
    });
  }
}

const getShellDesktopProcess = () => {
  return _shellDesktopProcess;
};

export default ShellDesktop;
export {
  getShellDesktopProcess
};
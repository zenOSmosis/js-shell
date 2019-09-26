import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { DOM_ROOT_ID, PROJECT_NAME } from 'config';
import preventPullToRefresh from 'utils/preventPullToRefresh';

import * as serviceWorker from 'utils/reactServiceWorker';

import {
  _handleSocketConnectionStatusUpdate,
} from 'utils/desktop';
import AppRuntime from '../AppRuntime';
import { EVT_BEFORE_EXIT } from 'process/ClientGUIProcess';
import { EVT_LINKED_STATE_UPDATE } from 'state/LinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';
import SocketLinkedState, {
  STATE_CONNECTION_STATUS,
  CONNECTION_STATUS_CONNECTED
} from 'state/SocketLinkedState';

import AppRegistration from '../AppRegistration';

/**
 * @type {ShellDesktop}
 */
let _shellDesktopProcess = null;

/**
 * Shell Desktop GUI Process mounts the root component of the application to
 * the DOM, and wraps it with a ClientGUIProcess.
 * 
 * @extends AppRuntime
 */
class ShellDesktop extends AppRuntime {
  constructor(parentProcess) {
    if (_shellDesktopProcess) {
      throw new Error('Cannot have more than one ShellDesktop process');
    }

    const shellRegistration = (() => {
      const shellRegistration = new AppRegistration({
        title: PROJECT_NAME,
        // menus: [],
        view: () => {
          return (
            <App />
          );
        }
      });

      return shellRegistration;
    })();

    super(shellRegistration, [], parentProcess);

    this._desktopLinkedState = null;
    this._socketLinkedState = null;
    this._areCommonEventsInit = false;

    this._localUser = null;

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
        this._socketLinkedState = null
      });

      const rootEl = document.getElementById(DOM_ROOT_ID);

      const ReactComponent = this.getReactComponent();
      
      // Mounts the base ReactComponent to the DOM
      ReactDOM.render(<ReactComponent />, rootEl);

      preventPullToRefresh(rootEl);

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
    /*
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
    */

    // Socket.io
    this._socketLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      const { [STATE_CONNECTION_STATUS]: updatedConnectionStatus } = updatedState;

      if (updatedConnectionStatus !== undefined) {
        // No need to be specific; it's either connnected or not
        // Specifics are handled directly in the state, if necessary
        const isConnected = (updatedConnectionStatus === CONNECTION_STATUS_CONNECTED);
        _handleSocketConnectionStatusUpdate(isConnected);
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
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

// Registers default Shell Desktop apps
// TODO: If refactoring this to another location, update the reference to that
// location in apps/defaultApps.js comments
import 'apps/defaultApps';

import registerCommonDesktopEventsHandler from 'utils/desktop/registerCommonEventsHandler';
import ClientGUIProcess from 'process/ClientGUIProcess';

import config from 'config';

const { DOM_ROOT_ID } = config;

// This should be treated as a singleton
export default class ShellDesktop extends ClientGUIProcess {
  async _init() {
    try {
      const rootEl = document.getElementById(DOM_ROOT_ID);

      const ReactComponent = this.getReactComponent();
      
      // Mounts the base ReactComponent to the DOM
      ReactDOM.render(<ReactComponent />, rootEl);

      // Mounts the App component to the base ReactComponent
      this.setReactRenderer(App);

      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.register();

      registerCommonDesktopEventsHandler();

      // Initialize the super
      await super._init();
    } catch (exc) {
      throw exc;
    }
  }
}
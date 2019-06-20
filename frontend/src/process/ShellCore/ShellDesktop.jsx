import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

import registerCommonDesktopEventsHandler from 'utils/desktop/registerCommonEventsHandler';
import ClientGUIProcess from 'process/ClientGUIProcess';

// DOM element ID to draw the ShellDesktop in
const DOM_ROOT_ID = 'root';

// This should be treated as a singleton
export default class ShellDesktop extends ClientGUIProcess {
  _init() {
    this.setImmediate(() => {
      // TODO: Make dynamic root address(?)
      const rootEl = document.getElementById(DOM_ROOT_ID);

      const ReactComponent = this.getReactComponent();

      console.warn('ROOT COMPONENT', ReactComponent);

      // Mounts the base ReactComponent to the DOM
      ReactDOM.render(<ReactComponent />, rootEl);

      // Mounts the App component to the base ReactComponent
      this.setReactRenderer(App);

      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.register();

      registerCommonDesktopEventsHandler();

      super._init();
    });
  }
}
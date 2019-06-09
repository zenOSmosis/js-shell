import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

import registerCommonDesktopEventsHandler from 'utils/desktop/registerCommonEventsHandler';
import ClientGUIProcess from 'process/ClientGUIProcess';

// This should be treated as a singleton
export default class ShellDesktop extends ClientGUIProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      proc.setImmediate(() => {
        // TODO: Make dynamic root address(?)
        const rootEl = document.getElementById('root');

        const ReactComponent = proc.getReactComponent();

        console.warn('ROOT COMPONENT', ReactComponent);

        // Mounts the base ReactComponent to the DOM
        ReactDOM.render(<ReactComponent />, rootEl);

        // Mounts the App component to the base ReactComponent
        proc.setReactRenderer(App);
      });

      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.register();

      registerCommonDesktopEventsHandler();
    });
  }
}
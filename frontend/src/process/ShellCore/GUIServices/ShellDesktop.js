import registerCommonDesktopEventsHandler from 'utils/desktop/registerCommonEventsHandler';
import ClientGUIProcess from 'process/ClientGUIProcess';
// import Desktop from './Desktop';

import React from 'react';
import ReactDOM from 'react-dom';
// TODO: Use a copy of this file, instead
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

// This should be treated as a singleton
export default class ShellDesktop extends ClientGUIProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      console.debug('Starting React w/ Shell Desktop extensions');

      console.warn('TODO: Implement Local Storage');

      console.warn('TODO: Implement proc.setReactRenderer() so that this component will remove if closed');

      // Launch React interface
      // Skipping proc.setReactRenderer() out of simplicity

      // TODO: Remove component if killing process
      (() => {
        const rootEl = document.getElementById('root');

        proc.on('update', () => {
          const ReactComponent = proc.getReactComponent();

          ReactDOM.render(<ReactComponent />, rootEl);
        });

        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        serviceWorker.register();
      })();

      proc.setReactRenderer((props) => {
        return (
          <App />
        )
      });

      console.warn('TODO: Rework common desktop events handling');
      registerCommonDesktopEventsHandler();

      // TODO: Kill the desktop if killing this process

      // Confirm before trying to unload
      // TODO: Move to shutdown routine
      /*
      (() => {
        window.onbeforeunload = () => {
          return 'Are you sure you wish to shut down?';
        };
      })();
      */
    }, parentProcess);
  }
}
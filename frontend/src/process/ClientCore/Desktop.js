import registerCommonDesktopEventsHandler from 'utils/desktop/registerCommonEventsHandler';
import ClientGUIProcess from '../ClientGUIProcess';

import React from 'react';
import ReactDOM from 'react-dom';
// TODO: Use a copy of this file, instead
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

// This should be treated as a singleton
export default class Desktop extends ClientGUIProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      // Binds common Desktop events (e.g. Socket connect / disconnect; context menu; etc.)
      registerCommonDesktopEventsHandler();

      console.debug('proc', proc);

      // Launch React interface
      // TODO: Utilize proc.setReactRenderer()
      // TODO: Remove component if killing process
      (() => {
        const rootEl = document.getElementById('root');

        // Rendering directly to document.body is not ideal because it may cause
        // issues w/ Google Font Loader or third party browser extensions
        // @see https://github.com/facebook/create-react-app/issues/1568
        ReactDOM.render(<App />, rootEl);

        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        serviceWorker.register();
      })();

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
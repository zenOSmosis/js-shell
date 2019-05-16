// Note, currently the mere inclusion of this registers all of the default apps
import defaultApps from 'apps/defaultApps';

import registerCommonDesktopEventsHandler from 'utils/desktop/registerCommonEventsHandler';

import React from 'react';
import ReactDOM from 'react-dom';
// TODO: Use a copy of this file, instead
import App from 'App';
import * as serviceWorker from 'utils/reactServiceWorker';

let hasStarted = false;

/**
 * Client-side system startup routine.
 * 
 * This should be automatically invoked when the client services startup.
 */
const startup = () => {
  if (hasStarted) {
    console.warn('Client system has already started');
    return;
  } else {
    console.debug('Starting client system');

    console.warn('TODO: Implement Local Storage');

    // Binds common Desktop events (e.g. Socket connect / disconnect; context menu; etc.)
    registerCommonDesktopEventsHandler();

    console.debug('default apps', defaultApps);
  
    // Launch React interface
    (() => {
      // Rendering directly to document.body is not ideal because it may cause
      // issues w/ Google Font Loader or third party browser extensions
      // @see https://github.com/facebook/create-react-app/issues/1568
      ReactDOM.render(<App />, document.getElementById('root'));
  
      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.register();
    })();
    
    // Confirm before trying to unload
    // TODO: Move to shutdown routine
    (() => {
      window.onbeforeunload = () => {
        return 'Are you sure you wish to shut down?';
      };
    })();
  
    hasStarted = true;
  }
};

export default startup;
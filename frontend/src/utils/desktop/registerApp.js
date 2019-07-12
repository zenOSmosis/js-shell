import { commonAppLinkedState } from 'state/commonLinkedStates';
import createDesktopNotification from './createDesktopNotification';
import App from 'core/App';

// Registers an app for use w/ the system / Dock
// Note: When hot module replacement (HMR) is run, this function is executed
// again.  This includes internal provisions for handling of HMR situations.
const registerApp = (appProps) => {

  // TODO: Verify appProps for API compatibility

  // TODO: Don't create new app process until the app is launched
  const newApp = new App(appProps);

  const existingApp = getExistingHMRApp(newApp);

   // Don't re-add if app is already existing
  if (!existingApp) {
    // New registration; not using HMR

    commonAppLinkedState.addApp(newApp);
  } else {
    // Existing app registration (via HMR)
    // TODO: Move this out of here into a more centralized handler
    createDesktopNotification(`"${existingApp.getTitle()}" app source code updated`);
  }

  return existingApp || newApp;
};

/**
 * TODO: Document, exactly, what this does
 * 
 * @param {Window} appWindow 
 */
const getWindowFilename = (appWindow) => {
  if (!appWindow) {
    return;
  }

  const {_source: appSource} = appWindow;
  if (!appSource) {
    return;
  }

  const {fileName: appFilename} = appSource;

  return appFilename;
};

// TODO: Document, exactly, what this does
// Note, currently this checks by looking at getMainWindow, and then
// backtracking to the window's filename.  This would be more robust by not
// requiring a window to be set.
const getExistingHMRApp = (app) => {
  if (!module.hot) {
    return;
  }

  const apps = commonAppLinkedState.getApps();

  const appMainWindow = app.getMainWindow();
  const appFilename = getWindowFilename(appMainWindow);
  if (!appFilename) {
    // No app found; return void
    return;
  }

  for (let i = 0; i < apps.length; i++) {
    const testApp = apps[i];
    const testAppMainWindow = testApp.getMainWindow();
    const testAppFilename = getWindowFilename(testAppMainWindow);

    if (appFilename === testAppFilename) {
      return testApp;
    }
  }

  return;
};

export default registerApp;

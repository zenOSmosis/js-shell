import { commonAppLinkedState } from 'state/commonLinkedStates';
import createDesktopNotification from './createDesktopNotification';
import App from 'process/App';

// Registers an app for use w/ the system / Dock
const createApp = (appProps) => {
  const newApp = new App(appProps);
  const existingApp = getExistingHMRApp(newApp);

   // Don't re-add if app is already existing
  if (!existingApp) {
    commonAppLinkedState.addApp(newApp);
  } else {
    // Existing app registration
    // TODO: Move this out of here into a more centralized handler
    createDesktopNotification(`"${existingApp.getTitle()}" app source code updated`);
  }

  return existingApp || newApp;
};

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

export default createApp;

import { commonAppRegistryLinkedState } from 'state/commonLinkedStates';
import createDesktopNotification from './createDesktopNotification';
// import AppRuntime from 'core/AppRuntime';
import AppRegistration from 'core/AppRegistration';

// Registers an app for use w/ the system / Dock
// Note: When hot module replacement (HMR) is run, this function is executed
// again.  This includes internal provisions for handling of HMR situations.
const registerApp = (appProps) => {

  // TODO: Verify appProps for API compatibility

  // TODO: Don't create new app process until the app is launched
  const newAppRegistration = new AppRegistration(appProps); // AppRuntime should be when the app is launched, not registered

  const existingAppRegistration = getExistingHMRApp(newAppRegistration);

   // Don't re-add if app is already existing
  if (existingAppRegistration) {
    // Remove new app registration
    console.warn('Skipping existing app registration unregister'); // TODO: Remove
    // newAppRegistration.unregister();

    // Existing app registration (via HMR)
    // TODO: Move this out of here into a more centralized handler
    createDesktopNotification(`"${existingAppRegistration.getTitle()}" app source code updated`);
  }

  return existingAppRegistration || newAppRegistration;
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

  console.warn('TODO: Re-implement existing HMR detection based on icon, instead of window');
  return;

  const apps = commonAppRegistryLinkedState.getAppRegistrations();

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

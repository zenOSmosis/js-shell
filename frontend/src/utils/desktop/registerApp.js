import { commonAppRegistryLinkedState } from 'state/commonLinkedStates';
import createDesktopNotification from './createDesktopNotification';
// import AppRuntime from 'core/AppRuntime';
import AppRegistration from 'core/AppRegistration';
import { EVT_BEFORE_EXIT } from 'process/ClientProcess';

// Registers an app for use w/ the system / Dock
// Note: When hot module replacement (HMR) is run, this function is executed
// again.  This includes internal provisions for handling of HMR situations.
const registerApp = (appProps) => {
  // TODO: Verify appProps for API compatibility

  // TODO: Don't create new app process until the app is launched
  const newAppRegistration = new AppRegistration(appProps); // AppRuntime should be when the app is launched, not registered

  const existingAppRegistration = getExistingHMRAppRegistration(newAppRegistration);

  // Don't re-add if app is already existing
  if (existingAppRegistration) {
    const existingAppTitle = existingAppRegistration.getTitle();

    // TODO: If existing app is already open, re-associate existing views w/
    // new app(?)

    // Existing app registration (via HMR)
    // TODO: Move this out of here into a more centralized handler
    createDesktopNotification(`"${existingAppTitle}" app source code updated`);

    const unregister = async () => {
      try {
        // Remove existing app registration
        await existingAppRegistration.unregister();

        createDesktopNotification(`Existing ${existingAppTitle} unregistered`);
      } catch (exc) {
        throw exc;
      }
    };

    (async () => {
      try {
        // If app is not launched...
        if (!existingAppRegistration.getIsLaunched()) {
          // Unregister existing app (because it is replaced w/ updated code via HMR)
          await unregister();
        } else {
          // app is launched...

          // Defer unload until close
          // TODO: Prompt user after close if existing should be unregisterd
          // TODO: Dynamically update "existing" app icon indicating that it is stale

          createDesktopNotification(`Deferring existing ${existingAppTitle} unregistration until close`);

          const app = existingAppRegistration.getAppRuntime();

          app.once(EVT_BEFORE_EXIT, async () => {
            try {
              await unregister();
            } catch (exc) {
              throw exc;
            }
          });
        }
      } catch (exc) {

      }
    })();
  }

  return existingAppRegistration || newAppRegistration;
};

// TODO: Document, exactly, what this does
// Note, currently this checks by looking at getMainWindow, and then
// backtracking to the window's filename.  This would be more robust by not
// requiring a window to be set.
const getExistingHMRAppRegistration = (appRegistration) => {
  if (!module.hot) {
    return;
  }

  const appRegistrations = commonAppRegistryLinkedState.getAppRegistrations();
  const lenAppRegistrations = appRegistrations.length;

  for (let i = 0; i < lenAppRegistrations; ++i) {
    const testAppRegistration = appRegistrations[i];

    // Skip checking if test app registration is the current app registration
    if (Object.is(testAppRegistration, appRegistration)) {
      continue;
    }

    // Check if icon src is the same
    // TODO: Implement more versatile checking
    const testIconSrc = testAppRegistration.getIconSrc();
    const iconSrc = appRegistration.getIconSrc();
    if (testIconSrc === iconSrc) {
      return testAppRegistration;
    }
  }
};

export default registerApp;

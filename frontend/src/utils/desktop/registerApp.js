import { commonAppRegistryLinkedState } from 'state/commonLinkedStates';
import createDesktopNotification from './createDesktopNotification';
// import AppRuntime from 'core/AppRuntime';
import AppRegistration from 'core/AppRegistration';
import { EVT_BEFORE_EXIT } from 'process/ClientProcess';

/**
 * Registers an app for use w/ the system / Dock.
 * 
 * Note: When hot module replacement (HMR) is run, this function is executed
 * again.  This includes internal provisions for handling of HMR situations.
 * 
 * @param {object} appProps Props to create the AppRegistration
 * @return {AppRegistration} Constructed AppRegistration instance
 */
const registerApp = (appProps) => {
  // TODO: Verify appProps for API compatibility

  // TODO: Don't create new app process until the app is launched
  const newAppRegistration = new AppRegistration(appProps); // AppRuntime should be when the app is launched, not registered

  // Existing applications already in memory, as a result of source code edits during runtime
  const hmrMatchedRegistrations = getMatchedAppRegistrations(newAppRegistration);

  if (hmrMatchedRegistrations.length) {
    const lenHMRMatchedRegistrations = hmrMatchedRegistrations.length;

    const existingAppTitle = hmrMatchedRegistrations[0].getTitle();

    // Let users know which app has been updated
    createDesktopNotification(`"${existingAppTitle}" app source code updated`);

    for (let i = 0; i < lenHMRMatchedRegistrations; i++) {
      const hmrMatchedRegistration = hmrMatchedRegistrations[i];
  
      // TODO: Break out into its own function
      (async () => {
        try {
          // If app is not launched...
          if (!hmrMatchedRegistration.getIsLaunched()) {
            // Unregister existing app (because it is replaced w/ updated code via HMR)
            await unregister(hmrMatchedRegistration);
          } else {
            // app is launched...
            
            // TODO: Prompt user after close if existing should be unregisterd
            // TODO: Dynamically update "existing" app icon indicating that it is stale
  
            createDesktopNotification(`Deferring existing ${existingAppTitle} unregistration until close`);
  
            const app = hmrMatchedRegistration.getAppRuntime();
  
            // Defer unload until close
            app.once(EVT_BEFORE_EXIT, async () => {
              try {
                await unregister(hmrMatchedRegistration);
              } catch (exc) {
                throw exc;
              }
            });
          }
        } catch (exc) {
          throw exc;
        }
      })();
    }
  }

  // return hmrMatchedRegistrations[0] || newAppRegistration;
  return newAppRegistration;
};

/**
 * Internally handles unregistration of existing apps which have been updated
 * via HMR.
 *
 * @param {AppRegistration} hmrMatchedRegistration 
 * @return {Promise<void>}
 */
const unregister = async (hmrMatchedRegistration) => {
  try {
    const existingAppTitle = hmrMatchedRegistration.getTitle();

    // Remove existing app registration
    await hmrMatchedRegistration.unregister();

    createDesktopNotification(`Existing ${existingAppTitle} unregistered`);
  } catch (exc) {
    throw exc;
  }
};

/**
 * Retrieves matched app registrations based on the given app registration.
 * 
 * (e.g. ~ if the icons are the same, assume the app is the same)
 * 
 * @param {AppRegistration} appRegistration
 * @return {AppRegistration[]}
 */
const getMatchedAppRegistrations = (appRegistration) => {
  if (!module.hot) {
    return;
  }

  const appRegistrations = commonAppRegistryLinkedState.getAppRegistrations();
  const lenAppRegistrations = appRegistrations.length;

  // TODO: Rename
  const hmrMatchedRegistrations = [];

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
      hmrMatchedRegistrations.push(testAppRegistration);
    }
  }

  return hmrMatchedRegistrations;
};

export default registerApp;

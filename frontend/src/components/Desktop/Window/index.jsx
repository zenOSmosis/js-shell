import Window, {getWindowStack} from './Window';
// import hocConnect from 'state/hocConnect';
// import AppRegistryLinkedState from 'state/AppRegistryLinkedState';

export default Window;
export {
  getWindowStack
};
/*

const AppRegistryWindow = hocConnect(Window, AppRegistryLinkedState, (updatedState, linkedScope) => {
  const appRegistrations = linkedScope.getAppRegistrations();
  console.debug('window-----updated state', updatedState);

  const { focusedAppRuntime } = updatedState;


  return {
    appRegistrations
  };
});

export default AppRegistryWindow;

*/
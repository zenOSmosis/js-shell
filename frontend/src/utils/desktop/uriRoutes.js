import { desktopLinkedState, EVT_LINKED_STATE_UPDATE } from './.common.js';

// TODO: Take into consideration if desktop is locked, etc.

const initURIRouteHandler = (() => {
  let _isInit = false;

  return () => {
    if (_isInit) {
      console.warn('URI route handling is already set up');
    }

    console.debug('Registering URI Route update handler');

    desktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      console.warn('TODO: Set up URI route handling', updatedState);
    });

    _isInit = true;
  };
})();

let uriRouteHashMaps = [];

const addURIRouteHash = (routeHash, onNavigateTo) => {
  uriRouteHashMaps.push({
    routeHash,
    onNavigateTo
  });
};

/*
const getActionWithURIRouteHash = (routeHash) => {
  const totalHashMaps = uriRouteHashMaps.length;

  for (let i = 0; i < totalHashMaps; i++) {
    if (uriRouteHashMaps.routeHash === routeHash) {
      const {onNavigateTo} = uriRouteHashMaps[i];

      return onNavigateTo;
    }
  }
};
*/

/*
const removeURIRouteHash = (routeHash) => {

};
*/

export {
  initURIRouteHandler,
  addURIRouteHash
};
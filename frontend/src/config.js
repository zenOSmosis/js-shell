// Default dynamic app configuration

// TODO: Clean this up

// Note: Some of these values may be overridden by other parts of the program

// import getRequestURI from './utils/fileSystem/getRequestURI';

import parseURL from './utils/parseURL';

let config = {
  DOM_ROOT_ID: 'root',

  // HOST_PORT: 443
};

// TODO: Enable this to work w/o window
if (typeof window !== 'undefined') {
  const parsedWinURL = parseURL(window.href);

  config = Object.assign(config, {
    HOST_REST_URI: `${parsedWinURL.protocol}//${parsedWinURL.hostname}`,
  }); 
}

config = Object.assign(config, {
  SOCKET_IO_URI: config.HOST_REST_URI,

  HOST_ICON_URI_PREFIX: `${config.HOST_REST_URI}/icons?iconName=`,

  // TODO: Replace hardcded path here
  DESKTOP_DEFAULT_BACKGROUND_URI: '/dev/null', // TODO: Debug issue where Chrome displays border around page if this is set to null
  
  // If the Desktop should intercept the context menu by default
  DESKTOP_CONTEXT_MENU_IS_TRAPPING: true,

  // TODO: Make distinction between if running in windowed, full-screen (touch) mode, (or others?)
  DESKTOP_WINDOW_MIN_WIDTH: 500,
  DESKTOP_WINDOW_MIN_HEIGHT: 460
});

export default config;
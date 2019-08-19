// Default dynamic app configuration

// TODO: Clean this up

// Note: Some of these values may be overridden by other parts of the program

// import getRequestURL from './utils/fileSystem/getRequestURL';

import parseURL from './utils/parseURL';

let config = {
  DOM_ROOT_ID: 'root'
};

// TODO: Enable this to work w/o global window object
if (typeof window !== 'undefined') {
  const parsedWinURL = parseURL(window.location.href);

  config = Object.assign(config, {
    HOST_REST_URL: `${parsedWinURL.protocol}//${parsedWinURL.hostname}`,
  }); 
}

config = Object.assign(config, {
  SOCKET_IO_URL: config.HOST_REST_URL,

  HOST_ICON_URL_PREFIX: config.HOST_REST_URL + `/icons/`,
  HOST_FILES_URL_PREFIX: config.HOST_REST_URL + `/files/?filePath=`,

  // TODO: Replace hardcded path here
  DESKTOP_DEFAULT_BACKGROUND_URL: config.HOST_REST_URL +  '/pictures/mojave.jpg', // TODO: Debug issue where Chrome displays border around page if this is set to null
  
  // If the Desktop should intercept the context menu by default
  DESKTOP_CONTEXT_MENU_IS_TRAPPING: false,

  DESKTOP_UNTITLED_WINDOW_DEFAULT_TITLE: '[ Untitled Window ]',

  // TODO: Make distinction between if running in windowed, full-screen (touch) mode, (or others?)
  DESKTOP_WINDOW_MIN_WIDTH: 500,
  DESKTOP_WINDOW_MIN_HEIGHT: 460
});

// TODO: Implement named exports for config properties
export default config;
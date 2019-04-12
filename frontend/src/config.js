// Default dynamic app configuration
// Note: Some of these values may be overridden by other parts of the program

import parseURL from './utils/parseURL';
const parsedWinURL = parseURL(window.href);

let config = {
  HOST_PORT: 3001
};

config = Object.assign(config, {
  HOST_REST_URI: `${parsedWinURL.protocol}//${parsedWinURL.hostname}:${config.HOST_PORT}`,
});

config = Object.assign(config, {
  SOCKET_IO_URI: config.HOST_REST_URI,

  HOST_ICON_URI_PREFIX: `${config.HOST_REST_URI}/icons?iconName=`,

  // TODO: Replace hardcded path here
  DESKTOP_DEFAULT_BACKGROUND_URI: `${config.HOST_REST_URI}/files?filePath=/home/jeremy/Pictures/wallpapers/tree-hands.jpg`,
  
  DESKTOP_CONTEXT_MENU_IS_TRAPPING: true,

  DESKTOP_WINDOW_MIN_WIDTH: 300,
  DESKTOP_WINDOW_MIN_HEIGHT: 300
});

export default config;
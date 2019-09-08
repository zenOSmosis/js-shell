// Default dynamic app configuration

import parseURL from './utils/parseURL';

export const PROJECT_NAME = 'Shell Desktop';

export const DOM_ROOT_ID = 'root';

export const HOST_REST_URL = (() => {
  // TODO: Enable this to work w/o global window object
  if (typeof window !== 'undefined') {
    const parsedWinURL = parseURL(window.location.href);

    return `${parsedWinURL.protocol}//${parsedWinURL.hostname}`
  }
})();

export const SOCKET_IO_URL = HOST_REST_URL;
export const HOST_ICON_URL_PREFIX = `${HOST_REST_URL}/icons/`;
export const HOST_FILES_URL_PREFIX = `${HOST_REST_URL}/files/?filePath=`;

export const DESKTOP_DEFAULT_BACKGROUND_URL = 'https://source.unsplash.com/1600x900/?nature,water';

export const DESKTOP_CONTEXT_MENU_IS_TRAPPING = false;

export const DESKTOP_UNTITLED_WINDOW_DEFAULT_TITLE = '[ Untitled Window ]';

export const DESKTOP_WINDOW_MIN_WIDTH = 500;
export const DESKTOP_WINDOW_MIN_HEIGHT = 460;

export const DONATION_LINKS = [
  {
    title: 'PayPal',
    url: 'https://paypal.me/zenOSmosis'
  },
  {
    title: 'Buy me a coffee',
    url: 'https://www.buymeacoffee.com/Kg8VCULYI'
  }
];
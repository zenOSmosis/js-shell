// Default dynamic app configuration

import parseUrl from './utils/parseUrl';

const _parsedUrl = parseUrl(window.location.href);
const { protocol, hostname } = _parsedUrl;

export const PROJECT_NAME = 'Shell Desktop';

export const DOM_ROOT_ID = 'root';

export const HOST_REST_URL = (() => {
  // TODO: Enable this to work w/o global window object
  if (typeof window !== 'undefined') {
    return `${protocol}//${hostname}`;
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

const { REACT_APP_WEB_RTC_USERNAME, REACT_APP_WEB_RTC_PASSWORD } = process.env;

// TODO: Use environment variables
export const WEB_RTC_ICE_SERVERS = [
  {
    urls: [
      `stun:${hostname}:3478`,
      `stun:${hostname}:65435`,
      `stun:${hostname}:65436`,
      `stun:${hostname}:65437`,
      `stun:${hostname}:65438`,
      `stun:${hostname}:65439`
    ],
    username: REACT_APP_WEB_RTC_USERNAME,
    credential: REACT_APP_WEB_RTC_PASSWORD
  }
];
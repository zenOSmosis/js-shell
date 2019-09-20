// TODO: Convert to ES6 import / export

import path from 'path';

export const EXPRESS_CUSTOM_RESPONSE_HEADERS = {
  ['X-Powered-By']: 'zenOSmosis'
};

export const HTTP_LISTEN_PORT = 3001;
export const PATH_PUBLIC = path.resolve(__dirname, '../', 'public'); // TODO: Rename to PUBLIC_PATH
export const FRONTEND_PROXY_URL = 'http://frontend:3000';
export const TERMINAL_COMMAND =  'xterm';

/*
// Freedesktop.org app parsing
// @see https://www.freedesktop.org
FREEDESKTOP_FILE_EXTENSIONS: ['.desktop'],
FREEDESKTOP_ENCODING_TYPE: 'utf8',
FREEDESKTOP_APP_READ_DIRECTORIES: [
  `${process.env.HOME}/.local/share/applications`,
  `${process.env.HOME}/.gnome/apps`,
  '/usr/share/applications',
  '/usr/local/share/applications'
],

// Freedesktop.org icon parsing
// ex XPM icon: Python 2.7 / 3.6 apps
FREEDESKTOP_ICON_FILE_EXTENSIONS: [
  '.png',
  '.svg',
  '.xpm'
],
FREEDESKTOP_ICON_READ_DIRECTORIES: [
  `${process.env.HOME}/.local/share/icons`,
  '/usr/share/icons'
],

WALLPAPER_LOCATIONS: [
  '/usr/share/wallpapers',
  `${process.env.HOME}/Pictures`,
  `${process.env.HOME}/.local/share/wallpapers`,
  `${process.env.HOME}/.kde/share/wallpapers`
],
WALLPAPER_FILE_EXTENSIONS: [
  '.jpg',
  '.jpeg',
  '.png'
]
};
*/
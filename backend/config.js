const config = {
  TERMINAL_COMMAND: 'xterm',
  
  // Freedesktop.org app parsing
  // @see https://www.freedesktop.org
  FREEDESKTOP_FILE_EXTENSIONS: ['.desktop'],
  FREEDESKTOP_ENCODING_TYPE: 'utf8',
  FREEDESKTOP_APP_READ_DIRECTORIES: [
    `${process.env.HOME}/.local/share/applications`,
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
  ]
};

module.exports = config;
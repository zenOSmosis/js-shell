// Freedesktop icon files
// @see https://wiki.archlinux.org/index.php/icons

const fs = require('fs');
const fetchFilePaths = require('../fetchFilePaths');

const DEFAULT_ICON_READ_DIRECTORIES = [
  `${process.env.HOME}/.local/share/icons/`,
  '/usr/share/icons/hicolor'
];


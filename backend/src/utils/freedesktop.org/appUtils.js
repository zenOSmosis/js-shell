// Freedesktop text files
// @see https://specifications.freedesktop.org/menu-spec/latest/

const config = require('config');
const fs = require('fs');
const fetchRecursiveFilePaths = require('../fileSystem/fetchRecursiveFilePaths');
const {fetchIconPath} = require('./iconUtils');

const ERROR_MSG_NOT_FREEDESKTOP_FILE = 'Not a freedesktop entry file';

const fetchFreedesktopEntryPaths = async (readDirectories = config.FREEDESKTOP_APP_READ_DIRECTORIES) => {
  try {
    const appDesktopPaths = [];

    for (let i = 0; i < readDirectories.length; i++) {
      const dir = readDirectories[i];
  
      const dirPaths = await fetchRecursiveFilePaths(dir, config.FREEDESKTOP_FILE_EXTENSIONS);
  
      dirPaths.forEach((dirPath) => {
        appDesktopPaths.push(dirPath);
      });
    }

    return appDesktopPaths;
  } catch (exc) {
    throw exc;
  }
};

const parseFreedesktopFile = (freedesktopFilePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(freedesktopFilePath, config.FREEDESKTOP_ENCODING_TYPE, (err, data) => {
      if (err) {
        return reject(err);
      }

      const lines = data.split('\n');

      if (!lines.includes('[Desktop Entry]')) {
        return reject(ERROR_MSG_NOT_FREEDESKTOP_FILE);
      }

      const meta = (() => {
        const meta = {};

        lines.forEach(line => {
          const kvp = line.split('=');

          if (!kvp[1]) {
            return;
          }

          if (kvp.length > 2) {
            kvp[1] = (() => {
              let override = '';
              for (let i = 1; i < kvp.length; i++) {
                if (i > 1) {
                  override += '=';
                }
                override += kvp[i];
              }

              override = override.trim();

              return override;
            })();
          }

          const key = kvp[0];
          const value = kvp[1];

          meta[key] = value;
        });

        return {
          freedesktopFilePath,
          meta
        }
      })();

      return resolve(meta);
    });
  });
};

const _toBoolean = (value) => {
  if (!value) {
    return false;
  }

  return (value.toUpperCase() === 'TRUE' ||
          value == '1') ? true : false;
};

const _toArray = (str, delimiter = ';') => {
  if (!str) {
    return [];
  } else {
    str = str.toString();
  }

  let values = str.split(delimiter);
  values = values.filter((value) => {
    return value.length ? true : false;
  });

  return values;
}

const fetchFreedesktopApps = async (readDirectories = config.FREEDESKTOP_APP_READ_DIRECTORIES) => {
  try {
    // Acquire paths for all freedesktop entries
    const listPaths = await fetchFreedesktopEntryPaths(readDirectories);

    let apps = [];

    for (let i = 0; i < listPaths.length; i++) {
      const listPath = listPaths[i];

      try {
        const freedesktopParse = await parseFreedesktopFile(listPath);
        apps.push(freedesktopParse);
      } catch (exc) {
        if (exc !== ERROR_MSG_NOT_FREEDESKTOP_FILE) {
          throw exc;
        }
      }
    }

    apps = apps.map((app) => {
      const {meta} = app;
      let exec = meta.Exec;

      const name = meta.Name;
      const description = meta.Comment;
      const categories = _toArray(meta.Categories);
      const keywords = _toArray(meta.Keywords);
      const opensInTerminal = _toBoolean(meta.Terminal);
      const noDisplay = _toBoolean(meta.NoDisplay);
      const startupNotify = _toBoolean(meta.StartupNotify);

      if (opensInTerminal) {
        // Prepend terminal command to execution string
        exec = `${config.TERMINAL_COMMAND} ${exec}`;
      }

      // Parse command and arguments
      // TODO: This needs work and is error-prone
      const {command, args} = (() => {
        const execParts = exec.split(' ');
        let command = execParts[0];

        // Remove quotations from command, if present
        // (SmartGit is a culprit here)
        command = (() => {
          do {
            command = command.replace('"', '');
          } while (command.includes('"'));
          return command;
        })();

        execParts.shift();
        let args = execParts;

        args = args.filter(arg => {
          return !arg.includes('%');
        });

        return {
          command,
          args
        };
      })();

      return Object.assign(app, {
        name,
        description,
        categories,
        keywords,
        opensInTerminal,
        noDisplay,
        startupNotify,
        exec,
        spawn: {
          command,
          args
        }
      });
    });

    for (let i = 0; i < apps.length; i++) {
      let app = apps[i];
      if (app.meta.Icon) {
        app.iconPath = await fetchIconPath(app.meta.Icon);
        // console.log(app.meta.Icon);
      }
    }

    // Alphabetically sort apps
    // @see https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
    apps = apps.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return apps;
  } catch (exc) {
    throw exc;
  }
};

module.exports = {
  fetchFreedesktopApps
};
const apps = require('./apps');
const appCategories = require('./appCategories');
const systemCommand = require('./systemCommand');
const portAudio = require('./portAudio');
const wallpapers = require('./wallpapers');
const {fetchSystemInformation, fetchSystemInformationModes} = require('./systemInformation');

/**
 * Initializes socket.io routes for the given socket connection.
 * 
 * TODO: Adjust socket param type to reflect actual type (instead of generic
 * object).
 * 
 * @param {object} socket A socket.io socket.
 */
const initSocket = (socket) => {
  console.log(`Initializing Socket.io routes for socket with id: ${socket.id}`);

  socket = _convertSocket(socket);

  socket.on('fetch-apps', apps);
  socket.on('fetch-app-categories', appCategories);
  socket.on('system-command', systemCommand);
  socket.on('fetch-sys-info', fetchSystemInformation);
  socket.on('fetch-sys-info-modes', fetchSystemInformationModes);

  socket.on('port-audio:fetch-devices', portAudio.fetchDevices);
  socket.on('port-audio:fetch-host-apis', portAudio.fetchHostAPIs);

  socket.on('wallpapers:fetch-wallpaper-paths', wallpapers.fetchWallpaperPaths);
  
  console.log(`Initialized Socket.io routes for socket with id: ${socket.id}`);
};

/**
 * Adds auto acknowledgement (and any other unifying features) to socket.
 * 
 * Auto-acknowledgement prevents errors from being thrown if the 'ack'
 * parameter is not set in any of the Socket.io routes.
 * 
 * @param {*} socket 
 */
const _convertSocket = (socket) => {
  const oSocketOn = socket.on;

  socket.on = (...args) => {
    let ack = args[1];
    if (typeof ack !== 'function') {
      ack = () => null;
    }

    args[1] = ack;

    return oSocketOn.apply(socket, args);
  };

  return socket;
};

module.exports = {
  initSocket
};
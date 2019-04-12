const ping = require('./ping');
const fileSystem = require('./fileSystem');
const error = require('./error');
const apps = require('./apps');
const appCategories = require('./appCategories');
const systemCommand = require('./systemCommand');
const portAudio = require('./portAudio');
const wallpapers = require('./wallpapers');
const {fetchSystemInformation, fetchSystemInformationModes} = require('./systemInformation');
const routes = require('./routes');

const {
  SOCKET_API_DEBUG_ERROR,
  SOCKET_API_ROUTE_PING,
  SOCKET_API_ROUTE_FILESYSTEM,
  SOCKET_API_ROUTE_FETCH_APPS,
  SOCKET_API_ROUTE_FETCH_APP_CATEGORIES,
  SOCKET_API_ROUTE_SYSTEM_COMMAND,
  SOCKET_API_ROUTE_FETCH_SYS_INFO,
  SOCKET_API_ROUTE_FETCH_SYS_INFO_MODES,
  SOCKET_API_ROUTE_PORT_AUDIO_FETCH_DEVICES,
  SOCKET_API_ROUTE_PORT_AUDIO_FETCH_HOST_APIS,
  SOCKET_API_ROUTE_WALLPAPERS_FETCH_WALLPAPER_PATHS
} = routes;

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

  // TODO: Remove this
  socket = _convertSocket(socket);

  socket.on(SOCKET_API_DEBUG_ERROR, error);
  socket.on(SOCKET_API_ROUTE_PING, ping);
  socket.on(SOCKET_API_ROUTE_FILESYSTEM, fileSystem);
  socket.on(SOCKET_API_ROUTE_FETCH_APPS, apps);
  socket.on(SOCKET_API_ROUTE_FETCH_APP_CATEGORIES, appCategories);

  socket.on(SOCKET_API_ROUTE_SYSTEM_COMMAND, systemCommand); // TODO: Convert
  socket.on(SOCKET_API_ROUTE_FETCH_SYS_INFO, fetchSystemInformation);  // TODO: Convert
  socket.on(SOCKET_API_ROUTE_FETCH_SYS_INFO_MODES, fetchSystemInformationModes);  // TODO: Convert

  socket.on(SOCKET_API_ROUTE_PORT_AUDIO_FETCH_DEVICES, portAudio.fetchDevices);  // TODO: Convert
  socket.on(SOCKET_API_ROUTE_PORT_AUDIO_FETCH_HOST_APIS, portAudio.fetchHostAPIs);  // TODO: Convert

  socket.on(SOCKET_API_ROUTE_WALLPAPERS_FETCH_WALLPAPER_PATHS, wallpapers.fetchWallpaperPaths);  // TODO: Convert

  console.log(`Initialized Socket.io routes for socket with id: ${socket.id}`);
};

/**
 * TODO: REMOVE THIS
 * 
 * Adds auto acknowledgement (and any other unifying features) to socket.
 * 
 * Auto-acknowledgement prevents errors from being thrown if the 'ack'
 * parameter is not set in any of the Socket.io routes.
 * 
 * TODO: Rename this
 * 
 * @param {object} socket
 * @return {object} The converted socket.
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
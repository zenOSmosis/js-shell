export const SOCKET_API_ROUTE_FETCH_NODE_ENV = 'api/fetch-env';
export const SOCKET_API_ROUTE_FETCH_NODE_UPTIME = 'api/fetch-node-uptime';

export const SOCKET_API_ROUTE_FETCH_GIT_BRANCH = 'api/fetch-git-branch';
export const SOCKET_API_ROUTE_FETCH_GIT_COMMIT_DATE = 'api/fetch-git-commit-date';
export const SOCKET_API_ROUTE_FETCH_GIT_PUBLIC_SIGNATURE = 'api/fetch-git-public-signature';
export const SOCKET_API_ROUTE_FETCH_GIT_SHORT_HASH = 'api/fetch-git-short-hash';

export const SOCKET_API_ROUTE_ECHO = 'api/echo';
export const SOCKET_API_ROUTE_DEBUG_ERROR = 'api/debug:error';
export const SOCKET_API_ROUTE_PING = 'api/host:ping'; // ping is a reserved Socket.io word

export const SOCKET_API_ROUTE_SOCKET_FS = 'api/socketFS';

// Old
// export const SOCKET_API_ROUTE_FILESYSTEM = 'api/fileSystem';

export const SOCKET_API_ROUTE_FETCH_SYSTEM_TIME = 'api/fetch-system-time';
export const SOCKET_API_ROUTE_FETCH_X_APPS = 'api/fetch-apps';
export const SOCKET_API_ROUTE_FETCH_X_APP_CATEGORIES = 'api/fetch-app-categories';
export const SOCKET_API_ROUTE_SYSTEM_COMMAND = 'api/system-command';
export const SOCKET_API_ROUTE_FETCH_SYS_INFO = 'api/fetch-sys-info';
export const SOCKET_API_ROUTE_FETCH_SYS_INFO_MODES = 'api/fetch-sys-info-modes';
export const SOCKET_API_ROUTE_PORT_AUDIO_FETCH_DEVICES = 'api/port-audio:fetch-devices';
export const SOCKET_API_ROUTE_PORT_AUDIO_FETCH_HOST_APIS = 'api/port-audio:fetch-host-apis';

export const SOCKET_API_ROUTE_WEB_SEARCH = 'api/web-search';

// TODO: Rename to SOCKET_API_ROUTE_FETCH_WALLPAPER_PATHS
export const SOCKET_API_ROUTE_WALLPAPERS_FETCH_WALLPAPER_PATHS = '/api/wallpapers:fetch-wallpaper-paths';

// P2P
export const SOCKET_API_ROUTE_FETCH_SOCKET_IDS = 'api/fetch-peer-ids';
export const SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA = 'api/send-peer-message';

// Socket channels
export const SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL = 'api/create-xterm-socket-channel';

// User
export const SOCKET_API_ROUTE_SET_USER_DATA = 'api/user/setUserData';
export const SOCKET_API_ROUTE_GET_USER_DATA = 'api/user/getUserData';

export const SOCKET_API_ROUTE_REQUEST_DISCONNECT = 'api/request-disconnect';
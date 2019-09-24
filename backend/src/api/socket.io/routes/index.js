/**
 * API routing for the client Socket.io connection.
 */

import {
  // debugError
  SOCKET_API_ROUTE_DEBUG_ERROR,

  // echo
  SOCKET_API_ROUTE_ECHO,

  // git
  SOCKET_API_ROUTE_FETCH_GIT_BRANCH,
  SOCKET_API_ROUTE_FETCH_GIT_COMMIT_DATE,
  SOCKET_API_ROUTE_FETCH_GIT_PUBLIC_SIGNATURE,
  SOCKET_API_ROUTE_FETCH_GIT_SHORT_HASH,

  // node
  SOCKET_API_ROUTE_FETCH_NODE_ENV,
  SOCKET_API_ROUTE_FETCH_NODE_UPTIME,

  // p2p
  SOCKET_API_ROUTE_FETCH_SOCKET_IDS,
  SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA,

  // ping
  SOCKET_API_ROUTE_PING, // ping is a reserved Socket.io word

  // socketChannel
  SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL,

  // socketFS
  SOCKET_API_ROUTE_SOCKET_FS,

  // systemTime
  SOCKET_API_ROUTE_FETCH_SYSTEM_TIME,

  // user
  SOCKET_API_ROUTE_SET_USER_DATA,
  // SOCKET_API_ROUTE_GET_USER_DATA,

  // webSearch
  SOCKET_API_ROUTE_WEB_SEARCH,

  SOCKET_API_ROUTE_REQUEST_DISCONNECT
} from './routes';

import debugError from './debugError';
import echo from './echo';
import {
  fetchGitBranch,
  fetchGitCommitDate,
  fetchGitPublicSignature,
  fetchGitShortHash
} from './git';
import { fetchNodeEnv, fetchNodeUptime } from './node';
import {
  fetchSocketIds as p2pFetchSocketIds,
  routeSocketPeerData as p2pRouteSocketPeerData
} from './p2p';
import ping from './ping';
import { createXTermSocketChannel } from './socketChannel';
import socketFS from './socketFS';
import systemTime from './systemTime';
import {
  setUserData
} from './user';
import webSearch from './webSearch';

/**
 * Initializes socket.io routes for the given socket connection.
 * 
 * TODO: Adjust socket param type to reflect actual type (instead of generic
 * object).
 * 
 * @param {object} socket A socket.io socket.
 */
const initSocketAPIRoutes = (socket, io) => {
  console.log(`Initializing Socket.io routes for socket with id: ${socket.id}`);

  // debugError
  socket.on(SOCKET_API_ROUTE_DEBUG_ERROR, debugError);

  // echo
  socket.on(SOCKET_API_ROUTE_ECHO, echo);

  // git
  socket.on(SOCKET_API_ROUTE_FETCH_GIT_BRANCH, fetchGitBranch);
  socket.on(SOCKET_API_ROUTE_FETCH_GIT_COMMIT_DATE, fetchGitCommitDate);
  socket.on(SOCKET_API_ROUTE_FETCH_GIT_PUBLIC_SIGNATURE, fetchGitPublicSignature);
  socket.on(SOCKET_API_ROUTE_FETCH_GIT_SHORT_HASH, fetchGitShortHash);

  // node
  socket.on(SOCKET_API_ROUTE_FETCH_NODE_ENV, fetchNodeEnv);
  socket.on(SOCKET_API_ROUTE_FETCH_NODE_UPTIME, fetchNodeUptime);

  // p2p
  socket.on(SOCKET_API_ROUTE_FETCH_SOCKET_IDS,  p2pFetchSocketIds);
  socket.on(SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA, (socketPeerDataPacket, ack) => {
    p2pRouteSocketPeerData({
      socket,
      socketPeerDataPacket
    }, ack);
  });

  // ping
  socket.on(SOCKET_API_ROUTE_PING, ping);

  // socketChannel
  socket.on(SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL, (options = {}, ack) => {
    // Add socket to existing options
    options = { ...(options || {}), ...{ socket } };

    // Subsequent communications over this socket route handled internally via
    // SocketChannel
    createXTermSocketChannel(options, ack);
  });

  // socketFS
  socket.on(SOCKET_API_ROUTE_SOCKET_FS, socketFS);

  // systemTime
  socket.on(SOCKET_API_ROUTE_FETCH_SYSTEM_TIME, systemTime);

  socket.on(SOCKET_API_ROUTE_SET_USER_DATA, (userData = {}, ack) => {
    setUserData(userData, socket, ack);
  });

  // webSearch
  socket.on(SOCKET_API_ROUTE_WEB_SEARCH, webSearch);

  // Handle client disconnect request
  socket.on(SOCKET_API_ROUTE_REQUEST_DISCONNECT, () => {
    socket.disconnect();
  });

  console.log(`Initialized Socket.io routes for socket with id: ${socket.id}`);
};

export {
  initSocketAPIRoutes
};
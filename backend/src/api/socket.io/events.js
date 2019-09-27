// TODO: Document accordingly
// Ideas:
//  - https://hashnode.com/post/which-is-the-best-way-to-create-a-documentation-for-socketio-with-jsdoc-cixubvry3004dkg53u8rrxu4v
//  - https://codeday.me/es/qa/20190215/189801.html

/**
 * @event
 * ...
 */
export const SOCKET_API_EVT_AUTHENTICATION_ERROR = 'api/evt/authentication-error';

/**
 * @event
 * ...
 */
export const SOCKET_API_EVT_PEER_ID_CONNECT = 'api/evt/peer-connect';

/**
 * @event
 * ...
 */
export const SOCKET_API_EVT_PEER_ID_DISCONNECT = 'api/evt/peer-disconnect';

/**
 * Emitted to clients when a peer's details have changed.
 */
export const SOCKET_API_EVT_PEER_DETAIL = 'api/evt/peer-detail';

/**
 * Emitted to clients when a peer has a data message for the other party.
 * 
 * @type {SocketPeerDataPacket}
 */
export const SOCKET_API_EVT_PEER_DATA = 'api/evt/peer-data';
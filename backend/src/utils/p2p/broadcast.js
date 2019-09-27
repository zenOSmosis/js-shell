/**
 * Broadcasts a message to all peers except for the sender.
 * 
 * @param {SocketIO.Socket} senderSocket 
 * @param {string} eventName
 * @param {any} eventData? 
 */
const broadcast = (senderSocket, eventName, eventData = null) => {
  senderSocket.broadcast.emit(eventName, eventData);
};

export default broadcast;
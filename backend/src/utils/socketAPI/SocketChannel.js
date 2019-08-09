const EventEmitter = require('events');
const makeUUID = require('uuidv4');

const EVT_CONNECT = 'connect';
const EVT_DATA = 'data';
const EVT_BEFORE_DISCONNECT = 'beforeDisconnect';
const EVT_DISCONNECT = 'disconnect';

/**
 * Client / Server bidirectional communications on top of an existing
 * Socket.io socket connection.
 * 
 * It's like a virtual socket on a socket, w/ it's own event connect /
 * disconnect events.
 */
class SocketChannel extends EventEmitter {
  /**
   * @param {Object} socket socket.io socket.
   * @param {string} channelID? If null, this instance is the host instance.
   */
  constructor(socket, channelID = null) {
    super();

    this._socket = socket;

    this._channelID = channelID || `socketChannel/${makeUUID()}`;

    this._init();

    // Simulate connect in next tick
    // (process.nextTick may not be available on client, hence the timeout)
    setTimeout(() => {
      this.emit(EVT_CONNECT);
    }, 1);
  }

  /**
   * @return {string}
   */
  getChannelID() {
    return this._channelID;
  }

  _init() {
    this._socket.on(this.getChannelID(), this._handleRawSocketData.bind(this));
  }

  _deinit() {
    this._socket.off(this.getChannelID(), this._handleRawSocketData.bind(this));
  }

  /**
   * Emits data over the underlying Socket.io connection, encapsulated in an object.
   * 
   * @param {string} evtName
   * @param {any} data
   */
  emit(evtName, data) {
    // Send artbitrary event data over Socket.io
    this._socket.emit(this.getChannelID(), {
      evtName,
      data
    });
  }

  write(data) {
    return this.emit(EVT_DATA, data);
  }

  _handleRawSocketData(socketData) {
    const { evtName, data } = socketData;

    // Pass underneath this instance, so we don't re-emit over Socket.io
    super.emit(evtName, data);
  };

  /**
   * Converts a string to an ArrayBuffer.
   * 
   * This could be a bad approach...
   * @see https://github.com/xtermjs/xterm.js/issues/1972
   * 
   * The original work came from:
   * @see http://stackoverflow.com/a/11058858 (modified to work w/ Unit8Array)
   * 
   * @param {string}
   * @return {ArrayBuffer} 
   */
  str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  /**
   * Converts an ArrayBuffer to a string.
   *
   * This could be a bad approach...
   * @see https://github.com/xtermjs/xterm.js/issues/1972
   * 
   * The original work came from:
   * @see http://stackoverflow.com/a/11058858 (modified to work w/ Unit8Array)
   * 
   * @param {ArrayBuffer} buf
   * @return {string}
   */
  ab2str(buf) {
    const str = String.fromCharCode.apply(null, new Uint8Array(buf));
    return str;
  }

  disconnect() {
    this.emit(EVT_BEFORE_DISCONNECT);

    // Remove all listeners to the channel
    this.removeAllListeners();

    // Stop the Socket.io from listening
    this._deinit();
  }
}

module.exports = {
  SocketChannel,
  EVT_CONNECT,
  EVT_DATA,
  EVT_BEFORE_DISCONNECT,
  EVT_DISCONNECT
};
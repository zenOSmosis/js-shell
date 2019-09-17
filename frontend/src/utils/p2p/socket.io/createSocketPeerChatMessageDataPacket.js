import createSocketPeerDataPacket from './createSocketPeerDataPacket';
import P2PLinkedState, { ACTION_CACHE_CHAT_MESSAGE } from 'state/P2PLinkedState';
import { getSocketID } from 'utils/socket.io';

const createSocketPeerChatMessageDataPacket = (toSocketPeerID, messageBody) => {
  const fromSocketPeerID = getSocketID();

  if (!fromSocketPeerID) {
    throw new Error('Socket is not connected. Cannot create a new Socket Peer data packet.');
  }

  const dataPacket = createSocketPeerDataPacket(toSocketPeerID, 'chatMessage', {
    messageBody
  }, true);

  const p2pLinkedState = new P2PLinkedState();
  p2pLinkedState.dispatchAction(ACTION_CACHE_CHAT_MESSAGE, dataPacket);
  p2pLinkedState.destroy();

  return dataPacket;
};

export default createSocketPeerChatMessageDataPacket;
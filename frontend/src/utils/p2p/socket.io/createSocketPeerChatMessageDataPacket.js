import createSocketPeerDataPacket from './createSocketPeerDataPacket';

const createSocketPeerChatMessageDataPacket = (toSocketPeerID, messageBody) => {
  const dataPacket = createSocketPeerDataPacket(toSocketPeerID, 'chatMessage', messageBody, true);

  return dataPacket;
};

export default createSocketPeerChatMessageDataPacket;
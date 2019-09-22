import createSocketPeerDataPacket from './createSocketPeerDataPacket';

const createSocketPeerReceivedReceiptDataPacket = (toSocketPeerId, originPacketUuid) => {
  const dataPacket = createSocketPeerDataPacket(toSocketPeerId, 'receivedReceipt', {
    originPacketUuid
  }, false);

  return dataPacket;
};

export default createSocketPeerReceivedReceiptDataPacket;
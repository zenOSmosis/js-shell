import createSocketPeerDataPacket from './createSocketPeerDataPacket';

const createSocketPeerReceivedReceiptDataPacket = (toSocketPeerID, originPacketUUID) => {
  const dataPacket = createSocketPeerDataPacket(toSocketPeerID, 'receivedReceipt', {
    originPacketUUID
  }, false);

  return dataPacket;
};

export default createSocketPeerReceivedReceiptDataPacket;
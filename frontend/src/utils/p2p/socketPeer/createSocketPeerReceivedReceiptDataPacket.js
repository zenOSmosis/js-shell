import createSocketPeerDataPacket from './createSocketPeerDataPacket';

const createSocketPeerReceivedReceiptDataPacket = (toPeerId, originPacketUuid) => {
  const dataPacket = createSocketPeerDataPacket(toPeerId, 'receivedReceipt', {
    originPacketUuid
  }, false);

  return dataPacket;
};

export default createSocketPeerReceivedReceiptDataPacket;
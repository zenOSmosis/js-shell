
// TODO: Call this from core/p2p/P2PMonitor

import sendSocketPeerData from './sendSocketPeerDataPacket';

const handleReceivedSocketPeerData = async (receivedSocketPeerDataPacket) => {
  try {
    const {
      fromSocketPeerID: senderSocketPeerID,
      uuid: senderMessageUUID,
      isRequestingReadReceipt: isSenderRequestingReadReceipt
    } = receivedSocketPeerDataPacket;

    // Route message accordingly

    if (isSenderRequestingReadReceipt) {
      // Handle read receipt
      const readReceiptSocketPeerDataPacket = {
        toSocketPeerID: senderSocketPeerID,
        fromSocketPeerID: senderSocketPeerID,
        readReceiptForUUID: senderMessageUUID,

        // Setting this to true would cause an infinite loop of read receipts
        // being passed back and forth
        isRequestingReadReceipt: false
      };

      await sendSocketPeerData(readReceiptSocketPeerDataPacket);
    }
  } catch (exc) {
    throw exc;
  }
};

export default handleReceivedSocketPeerData;
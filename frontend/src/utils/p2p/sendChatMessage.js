// import socket from 'utils/socket.io';

const sendChatMessage = async (remoteSocketPeerID, messageBody) => {
  try {
    console.warn('TODO: Properly handle chat message sending', {
      remoteSocketPeerID,
      messageBody
    });

    // socket.emit(...)

    // TODO: Handle read receipt
  } catch (exc) {
    throw exc;
  }
};

export default sendChatMessage;
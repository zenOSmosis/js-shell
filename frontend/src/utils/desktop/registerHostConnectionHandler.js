import socket from 'utils/socket.io';
import createDesktopNotification from 'utils/desktop/createDesktopNotification';

const onConnect = () => {
  createDesktopNotification({
    message: 'Connected to host',
    description: 'A Socket.io connection has been established to the host machine'
  });
};

const onDisconnect = () => {
  createDesktopNotification({
    message: 'Disconnected from host',
    description: 'The Socket.io connection has been dropped from the host machine'
  });
};

let isRegistered = false;

/*
* Registers Desktop events related to connection / disconnection to / from the
* host's Socket connection.
*/
const registerHostConnectionHandler = () => {
  if (isRegistered) {
    console.warn('Host Connection Handler has already been registered');
    return;
  }

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);

  isRegistered = true;
};

export default registerHostConnectionHandler;
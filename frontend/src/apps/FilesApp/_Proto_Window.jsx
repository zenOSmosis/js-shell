import React from 'react';
import Window from 'components/Desktop/Window';
import SocketFSFilePicker from 'components/SocketFSFilePicker';

const ProtoWindow = (props) => {
  return (
    <Window
      {...props}
    >
      <SocketFSFilePicker />
    </Window>
  );
};

export default ProtoWindow;
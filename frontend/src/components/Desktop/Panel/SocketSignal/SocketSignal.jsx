import React from 'react';
import WifiIcon from 'components/componentIcons/WifiIcon';
import NoWifiIcon from 'components/componentIcons/NoWifiIcon';
import TransparentButton from 'components/TransparentButton';
import SocketLinkedState from 'state/SocketLinkedState';
import hocConnect from 'state/hocConnect';

const SocketSignal = (props) => {
  const { isConnected } = props;

  return (
    <TransparentButton title={`Socket.io ${isConnected ? '' : 'dis'}connected`}>
      {isConnected ? <WifiIcon /> : <NoWifiIcon />}
    </TransparentButton>
  );
};

export default hocConnect(SocketSignal, SocketLinkedState, (updatedState) => {
  const { isConnected } = updatedState;

  if (typeof isConnected !== 'undefined') {
    return {
      isConnected
    };
  }
});
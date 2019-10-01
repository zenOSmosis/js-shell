import React, { Component } from 'react';
import { Icon } from 'antd';
import Peer from 'utils/p2p/Peer.class';
import TransparentButton from 'components/TransparentButton';
import WebRTCPeer from 'utils/p2p/WebRTCPeer.class';

class Header extends Component {
  render() {
    const { remotePeerId } = this.props;

    const remotePeer = Peer.getPeerWithId(remotePeerId);
    if (!remotePeer) {
      return false;
    }

    const nickname = remotePeer.getNickname();

    return (
      <div style={{backgroundColor: 'rgba(255,255,255,.8)', color: '#000', fontSize: '1.4rem', fontWeight: 'bold'}}>
        {nickname}
        <TransparentButton onClick={ evt => WebRTCPeer.initiateConnection(remotePeer) }>
          <Icon type="phone" />
        </TransparentButton>

        <button onClick={ evt => WebRTCPeer.disconnectConnection(remotePeer) }>
          disconnect
        </button>
      </div>
    );
  }
}

export default Header;
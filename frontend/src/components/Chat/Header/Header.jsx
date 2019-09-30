import React, { Component } from 'react';
import { Icon } from 'antd';
import Peer from 'utils/p2p/Peer.class';
import TransparentButton from 'components/TransparentButton';
import { initiateWebRTCConnection } from 'utils/p2p/webRTC';

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
        <TransparentButton onClick={ evt => initiateWebRTCConnection(remotePeer) }>
          <Icon type="phone" />
        </TransparentButton>
      </div>
    );
  }
}

export default Header;
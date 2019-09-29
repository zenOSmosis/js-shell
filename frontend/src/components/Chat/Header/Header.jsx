import React, { Component } from 'react';
import { Icon } from 'antd';
import { getPeerWithId } from 'utils/p2p/Peer.class';

class Header extends Component {
  render() {
    const { remotePeerId } = this.props;

    const remotePeer = getPeerWithId(remotePeerId);
    if (!remotePeer) {
      return false;
    }

    const nickname = remotePeer.getNickname();

    return (
      <div style={{backgroundColor: 'rgba(255,255,255,.8)', color: '#000', fontSize: '1.4rem', fontWeight: 'bold'}}>
        {nickname} <Icon type="phone" />
      </div>
    );
  }
}

export default Header;
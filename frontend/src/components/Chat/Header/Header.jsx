import React, { Component } from 'react';
import { Icon } from 'antd';
import Peer from 'utils/p2p/Peer.class';
import TransparentButton from 'components/TransparentButton';
import MicrophoneIcon from 'components/componentIcons/MicrophoneIcon';
import WebRTCPeer from 'utils/p2p/WebRTCPeer.class';
import style from './Header.module.scss';

class Header extends Component {
  render() {
    const { remotePeerId } = this.props;

    const remotePeer = Peer.getPeerWithId(remotePeerId);
    if (!remotePeer) {
      return false;
    }

    const nickname = remotePeer.getNickname();

    const isWebRTCConnected = remotePeer.getIsWebRTCConnected();
    const isWebRTCConnecting = remotePeer.getIsWebRTCConnecting();
    // const webRTCConnectError = remotePeer.getWebRTCConnectError();

    return (
      <div className={style['chat-header']}>
        {nickname}

        {
          isWebRTCConnecting &&
          <span>WebRTC Connecting...</span>
        }

        {
          !isWebRTCConnected &&
          <TransparentButton onClick={ evt => WebRTCPeer.initConnection(remotePeer) }>
            <Icon type="phone" />
          </TransparentButton>
        }

        {
          isWebRTCConnected &&
          <button onClick={ evt => WebRTCPeer.disconnectConnection(remotePeer) }>
            disconnect
          </button>
        }

        <div>
          <MicrophoneIcon />
        </div>
      </div>
    );
  }
}

export default Header;
import React, { Component } from 'react';
import CallControls from '../CallControls';
import WebRTCPeer, { EVT_DISCONNECT } from 'utils/p2p/WebRTCPeer.class';
import {
  captureUserMediaStream,
  stopMediaStream
} from 'utils/mediaStream';
import styles from './Header.module.scss';

class Header extends Component {
  async initWebRTCConnectionAndUserMediaStreamWithPeer() {
    try {
      const { remotePeer } = this.props;
      const { hasAudioInput, hasVideoInput } = this.state;

      const userMediaStream = await captureUserMediaStream({
        audio: hasAudioInput,
        video: hasVideoInput
      });

      const webRTCPeer = await WebRTCPeer.initConnection(remotePeer, userMediaStream);

      webRTCPeer.once(EVT_DISCONNECT, () => {
        stopMediaStream(userMediaStream);
      });

      return webRTCPeer;
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { remotePeer } = this.props;

    if (!remotePeer) {
      return false;
    }

    const nickname = remotePeer.getNickname();

    // const isWebRTCConnected = remotePeer.getIsWebRTCConnected();
    const isWebRTCConnecting = remotePeer.getIsWebRTCConnecting();
    // const webRTCConnectError = remotePeer.getWebRTCConnectError();

    return (
      <div className={styles['chat-header']}>
        {nickname}

        {
          isWebRTCConnecting &&
          <span>WebRTC Connecting...</span>
        }

        <CallControls remotePeer={remotePeer} />
      </div>
    );
  }
}

export default Header;
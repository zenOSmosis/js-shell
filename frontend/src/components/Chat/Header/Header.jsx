import React, { Component } from 'react';
import { Icon } from 'antd';
import Peer from 'utils/p2p/Peer.class';
import TransparentButton from 'components/TransparentButton';
import MicrophoneIcon from 'components/componentIcons/MicrophoneIcon';
import ScreenShareIcon from 'components/componentIcons/ScreenShareIcon';
import WebcamIcon from 'components/componentIcons/WebcamIcon';
import WebRTCPeer, { EVT_DISCONNECT } from 'utils/p2p/WebRTCPeer.class';
import {
  captureUserMediaStream,
  stopMediaStream
} from 'utils/mediaStream';
import { fetchAggregatedMediaDeviceInfo } from 'utils/mediaDevices';
import style from './Header.module.scss';

class Header extends Component {
  async initWebRTCConnectionAndUserMediaStreamWithPeer(remotePeer) {
    try {
      const { hasAudioInput, hasVideoInput } = await fetchAggregatedMediaDeviceInfo();

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
          <TransparentButton onClick={ evt => this.initWebRTCConnectionAndUserMediaStreamWithPeer(remotePeer) }>
            <Icon type="phone" />
          </TransparentButton>
        }

        {
          isWebRTCConnected &&
          <button onClick={ evt => WebRTCPeer.disconnect(remotePeer) }>
            disconnect
          </button>
        }

        <div>
          <MicrophoneIcon /> { /* TODO: If clicked, init connection (or upgrade existing) w/ microphone */ }

          <ScreenShareIcon />

          <WebcamIcon />
        </div>
      </div>
    );
  }
}

export default Header;
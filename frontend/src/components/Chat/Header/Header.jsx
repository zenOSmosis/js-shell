import React, { Component } from 'react';
import PhoneCallIcon from 'components/componentIcons/PhoneCallIcon';
import PhoneHangupIcon from 'components/componentIcons/PhoneHangupIcon';
import MicrophoneIcon from 'components/componentIcons/MicrophoneIcon';
import ScreenShareIcon from 'components/componentIcons/ScreenShareIcon';
import WebcamIcon from 'components/componentIcons/WebcamIcon';
import WebRTCPeer, { EVT_DISCONNECT } from 'utils/p2p/WebRTCPeer.class';
import {
  captureUserMediaStream,
  stopMediaStream
} from 'utils/mediaStream';
import { fetchAggregatedMediaDeviceInfo } from 'utils/mediaDevices';
import styles from './Header.module.scss';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasAudioInput: null,
      hasVideoInput: null
    };
  }

  componentDidMount() {
    this.fetchAggregatedMediaDeviceInfo();
  }

  async fetchAggregatedMediaDeviceInfo() {
    try {
      const { hasAudioInput, hasVideoInput } = await fetchAggregatedMediaDeviceInfo();

      this.setState({
        hasAudioInput,
        hasVideoInput
      });
    } catch (exc) {
      throw exc;
    }
  }

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
    const {
      hasAudioInput,
      hasVideoInput
    } = this.state;

    if (!remotePeer) {
      return false;
    }

    const nickname = remotePeer.getNickname();

    const isWebRTCConnected = remotePeer.getIsWebRTCConnected();
    const isWebRTCConnecting = remotePeer.getIsWebRTCConnecting();
    // const webRTCConnectError = remotePeer.getWebRTCConnectError();

    return (
      <div className={styles['chat-header']}>
        {nickname}

        {
          isWebRTCConnecting &&
          <span>WebRTC Connecting...</span>
        }

        {
          !isWebRTCConnected
            ?
            <button
              style={{width: 40, height: 40, borderRadius: 40, margin: 4}}
              onClick={() => this.initWebRTCConnectionAndUserMediaStreamWithPeer(remotePeer)}
            >
              <PhoneCallIcon />
            </button>
            :
            <div style={{ display: 'inline-block' }}>
              {
                // TODO: Verify WebRTC is available before presenting any of these options
              }

              {
                hasAudioInput &&
                <button>
                  <MicrophoneIcon />
                </button>
              }

              {
                hasVideoInput &&
                <WebcamIcon />
              }

              <ScreenShareIcon />

              |
  
            <button onClick={evt => WebRTCPeer.disconnect(remotePeer)}>
                <PhoneHangupIcon />
              </button>
            </div>
        }

        <div>

        </div>
      </div>
    );
  }
}

export default Header;
import React, { Component } from 'react';
import {
  PhoneCallIcon,
  PhoneHangupIcon,
  ScreenShareIcon,
  MicrophoneIcon,
  WebcamIcon
} from 'components/componentIcons';
import LabeledComponent from 'components/LabeledComponent';
import styles from './CallControls.module.scss';
import { fetchAggregatedMediaDeviceInfo } from 'utils/mediaDevices';
import { captureUserMediaStream } from 'utils/mediaStream';

class CallControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasAudioInput: false,
      hasVideoInput: false
    };

    this._isUnmounting = false;
  }

  componentDidMount() {
    this.acquireAggregatedMediaDevices();
  }

  componentWillUnmount() {
    this._isUnmounting = true;
  }

  /**
   * @return {Promise<void>}
   */
  async acquireAggregatedMediaDevices() {
    try {
      const aggregatedMediaDevices = await fetchAggregatedMediaDeviceInfo();

      if (this._isUnmounting) {
        return;
      }

      const {
        hasAudioInput,
        hasVideoInput
      } = aggregatedMediaDevices;

      this.setState({
        hasAudioInput,
        hasVideoInput
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {Object[]}
   */
  getCallComponents() {
    const { remotePeer } = this.props;
    const { hasAudioInput, hasVideoInput } = this.state;

    if (!remotePeer.getIsOnline()) {
      return [];
    }

    const isWebRTCConnecting = remotePeer.getIsWebRTCConnecting();
    const isWebRTCConnected = remotePeer.getIsWebRTCConnected();

    if (isWebRTCConnecting) {
      const connectingComponents = [];
      
      connectingComponents.push({
        Component: PhoneHangupIcon,
        title: 'Hangup',
        onClick: () => {
          remotePeer.disconnectWebRTC();
        }
      });

      return connectingComponents;
    } else if (!isWebRTCConnected) {
      const outOfCallComponents = [
        {
          Component: PhoneCallIcon,
          title: 'Call',
          onClick: async () => {
            try {
              const mediaStream = await captureUserMediaStream({
                audio: hasAudioInput
              });

              remotePeer.setWebRTCOutgoingMediaStreams([mediaStream]);
              await remotePeer.initWebRTCConnection(true);
            } catch (exc) {
              throw exc;
            }
          }
        }
      ];

      return outOfCallComponents;
    } else {
      const inCallComponents = (() => {
        const inCallComponents = [];
  
        if (hasAudioInput) {
          inCallComponents.push({
            Component: MicrophoneIcon,
            title: 'Microphone'
          });
        }
  
        if (hasVideoInput) {
          inCallComponents.push({
            Component: WebcamIcon,
            title: 'Webcam'
          });
        }
  
        inCallComponents.push({
          Component: ScreenShareIcon,
          title: 'Share Screen'
        });
  
        inCallComponents.push({
          Component: PhoneHangupIcon,
          title: 'Hangup',
          onClick: () => {
            remotePeer.disconnectWebRTC();
          }
        });
  
        return inCallComponents;
      })();

      return inCallComponents;
    }
  }

  render() {
    // const { remotePeer } = this.props;

    const currentComponents = this.getCallComponents();

    return (
      <div className={styles['call-controls']}>
        {
          currentComponents.map((component, idx) => {
            const { Component, title, onClick } = component;

            return (
              <LabeledComponent key={idx} label={title}>
                <button onClick={onClick}>
                  <Component />
                </button>
              </LabeledComponent>
            );
          })
        }
      </div>
    );
  }
}

export default CallControls;
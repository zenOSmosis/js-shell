import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Peer from 'utils/p2p/Peer.class';
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
import { captureUserMediaStream, captureDisplayMediaStream } from 'utils/mediaStream';

/**
 * UI controls for creating a new call (request) or for managing an existing call.
 * 
 * @extends {React.Component}
 */
class CallControls extends Component {
  static propTypes = {
    remotePeer: PropTypes.instanceOf(Peer).isRequired
  };

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

              remotePeer.setWebRTCOutgoingMediaStream(mediaStream);
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
            title: 'Microphone',
            onClick: async () => {
              try {
                // TODO: Toggle existing media stream
  
                const displayMediaStream = await captureUserMediaStream({
                  audio: true
                });
  
                const audioTracks = displayMediaStream.getAudioTracks();
                const audioTrack = audioTracks[0];
  
                remotePeer.addWebRTCOutgoingMediaStreamTrack(audioTrack);
              } catch (exc) {
                throw exc;
              }
            }
          });
        }
  
        if (hasVideoInput) {
          inCallComponents.push({
            Component: WebcamIcon,
            title: 'Webcam',
            onClick: async () => {
              try {
                // TODO: Toggle existing media stream
  
                const displayMediaStream = await captureUserMediaStream({
                  video: true
                });
  
                const videoTracks = displayMediaStream.getVideoTracks();
                const videoTrack = videoTracks[0];
  
                remotePeer.addWebRTCOutgoingMediaStreamTrack(videoTrack);
              } catch (exc) {
                throw exc;
              }
            }
          });
        }
  
        inCallComponents.push({
          Component: ScreenShareIcon,
          title: 'Share Screen',
          onClick: async () => {
            try {
              // TODO: Toggle existing media stream

              const displayMediaStream = await captureDisplayMediaStream({
                audio: false,
                video: true
              });

              const videoTracks = displayMediaStream.getVideoTracks();
              const videoTrack = videoTracks[0];

              remotePeer.addWebRTCOutgoingMediaStreamTrack(videoTrack);
            } catch (exc) {
              throw exc;
            }
          }
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
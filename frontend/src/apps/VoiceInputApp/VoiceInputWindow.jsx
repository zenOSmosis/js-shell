import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import { Row, Column } from 'components/RowColumn';
import { Section } from 'components/Layout';
import VoiceInputLinkedState from './VoiceInputLinkedState';
import hocConnect from 'state/hocConnect';
import ConnectedAnalogVUMeter from './subComponents/ConnectedAnalogVUMeter';
import ConnectedMicAudioDetail from './subComponents/ConnectedMicAudioDetail';
import ConnectedTranscript from './subComponents/ConnectedTranscript';

class VoiceInputWindow extends Component {
  _appRuntime = null;

  componentDidMount() {
    const { appRuntime } = this.props;
    this._appRuntime = appRuntime;
  }

  startMicrophone() {
    this._appRuntime.setState({
      isMicRequested: true
    });
  }

  stopMicrophone() {
    this._appRuntime.setState({
      isMicRequested: false
    });
  }

  /**
   * @return {React.Component}
   */
  Component_ButtonStartMic = () => {
    return (
      <button
        onClick={(evt) => this.startMicrophone()}
        style={{ backgroundColor: 'green' }}
      >
        Start Microphone
      </button>
    );
  }

  /**
   * @return {React.Component}
   */
  Component_ButtonStopMic = () => {
    return (
      <button
        onClick={(evt) => this.stopMicrophone()}
        style={{ backgroundColor: 'red' }}
      >
        Stop Microphone
      </button>
    );
  };

  render() {
    const {
      isMicRequested,
      isMicOn,

      /*
      micSampleDuration,
      micSampleLength,
      micNumberOfChannels,
      micSampleRate,

      micAudioLevelRMS,
      micAudioLevelDB,

      transcript,

      isAudioWorkerOnline,

      audioWorkerDownsampleRate,

      wsBackendStatus,
      isSTTConnected,
      */

      ...propsRest
    } = this.props;

    return (
      <Window
        {...propsRest}
        toolbarRight={
          (() => {
            if (!isMicOn) {
              return (
                <this.Component_ButtonStartMic />
              );
            } else {
              return (
                <this.Component_ButtonStopMic />
              );
            }
          })()
        }
      >
        {
          !isMicOn &&
          <Center>
            <div>
              <p>Start the microphone, begin talking and I'll try to transcribe what you say.</p>

              <div>
                <this.Component_ButtonStartMic />
              </div>
            </div>
          </Center>
        }

        {
          isMicOn &&
          <Row style={{ height: '100%' }}>
            <Column>
              <Row>
                <Column>
                  <ConnectedAnalogVUMeter />
                </Column>
              </Row>

              <Row>
                <Column style={{ textAlign: 'left' }}>
                  <Section>
                    <ConnectedTranscript />
                  </Section>
                </Column>
              </Row>

              <Row style={{ height: '100%' }}>
                <Column>
                  <Center>
                    <ConnectedMicAudioDetail />
                  </Center>
                </Column>
              </Row>

              {
                /*
                 <Row>
                  <Column>
                    <div style={{ overflow: 'auto' }}>
                      <div style={{ float: 'right' }}>
                        Mic time: 00:00:00
                    </div>
                    </div>
                  </Column>
                </Row>
                */
              }

            </Column>
          </Row>
        }
      </Window>
    );
  }
}

const MicConnectedVoiceInputWindow = hocConnect(VoiceInputWindow, VoiceInputLinkedState, (updatedState) => {
  const { isMicRequested, isMicOn } = updatedState;

  const filteredState = {};

  if (typeof isMicRequested !== 'undefined') {
    filteredState.isMicRequested = isMicRequested;
  }

  if (typeof isMicOn !== 'undefined') {
    filteredState.isMicOn = isMicOn;
  }

  return filteredState;
});


export default MicConnectedVoiceInputWindow;
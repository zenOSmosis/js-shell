import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import { Row, Column } from 'components/RowColumn';
import AnalogVUMeter from 'components/AnalogVUMeter';
import { Section } from 'components/Layout';

export default class VoiceInputWindow extends Component {
  componentDidMount() {
    const { app } = this.props;
    this._app = app;
  }

  startMicrophone() {
    this._app.setState({
      isMicRequested: true
    });
  }

  stopMicrophone() {
    this._app.setState({
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

      micSampleDuration,
      micSampleLength,
      micNumberOfChannels,
      micSampleRate,

      micAudioLevelRMS,
      micAudioLevelDB,

      transcript,

      isAudioWorkerOnline,
      wsBackendStatus,

      audioWorkerDownsampleRate,

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
                  <AnalogVUMeter vuLevel={micAudioLevelRMS} />
                </Column>
              </Row>

              <Row>
                <Column style={{ textAlign: 'left' }}>
                  <Section>
                    Transcript:<br />
                    <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', textAlign: 'left' }}>
                      &nbsp;
                      {
                        transcript
                      }
                    </div>
                  </Section>
                </Column>
              </Row>

              <Row style={{ height: '100%' }}>
                <Column>
                  <Center>
                    <div>
                      <div>
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                STT API connection status
                              </td>
                              <td>
                                {wsBackendStatus}
                              </td>
                            </tr>

                            <tr>
                              <td>
                                Mic sample duration
                              </td>
                              <td>
                                {
                                  micSampleDuration &&
                                  <span>{micSampleDuration} seconds</span>
                                }
                              </td>
                            </tr>
                            
                            <tr>
                              <td>
                                Mic sample length
                              </td>
                              <td>
                                {micSampleLength} bytes
                              </td>
                            </tr>
                            
                            <tr>
                              <td>
                                Mic sample rate
                              </td>
                              <td>
                                {micSampleRate}
                              </td>
                            </tr>

                            <tr>
                              <td>
                                Mic channels
                              </td>
                              <td>
                                {micNumberOfChannels}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Audio level RMS
                              </td>
                              <td>
                                {micAudioLevelRMS}
                              </td>
                            </tr>

                            <tr>
                              <td>
                                Audio level DB
                              </td>
                              <td>
                                {
                                  micAudioLevelDB &&
                                  <span>{micAudioLevelDB} db</span>
                                }
                              </td>
                            </tr>

                            <tr>
                              <td>
                                Downsample Rate
                              </td>
                              <td>
                                {audioWorkerDownsampleRate}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </Center>
                </Column>
              </Row>

              <Row>
                <Column>
                  <div style={{ overflow: 'auto' }}>
                    <div style={{ float: 'right' }}>
                      Mic time: 00:00:00
                  </div>
                  </div>
                </Column>
              </Row>

            </Column>
          </Row>
        }
      </Window>
    );
  }
}
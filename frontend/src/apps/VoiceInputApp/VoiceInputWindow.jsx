import React, { Component } from 'react';
import appRegistration from './appRegistration';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import { Row, Column } from 'components/RowColumn';
import AnalogVUMeter from 'components/AnalogVUMeter';

export default class VoiceInputWindow extends Component {
  constructor(...args) {
    super(...args);

    this._appRuntime = appRegistration.getAppRuntime();
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

  render() {
    const {
      isMicRequested,
      isMicOn,

      micSampleDuration,
      micSampleLength,
      micNumberOfChannels,
      micSampleRate,

      isAudioWorkerOnline,
      connectedSTTBackends,

      ...propsRest
    } = this.props;

    return (
      <Window
        {...propsRest}
        appRegistration={appRegistration}
      >
        <Row style={{ height: '100%' }}>
          <Column>
            <Row>
              <Column>
                <AnalogVUMeter />
              </Column>
              <Column>
                <AnalogVUMeter />
              </Column>
            </Row>

            <Row style={{ height: '100%' }}>
              <Column>
                <Center>
                  {
                    !isMicOn &&
                    <div>
                      <button onClick={(evt) => this.startMicrophone()}>
                        Start Microphone
                      </button>
                    </div>
                  }

                  {
                    isMicOn &&
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              Mic sample duration
                            </td>
                            <td>
                              {micSampleDuration}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Mic sample length
                            </td>
                            <td>
                              {micSampleLength}
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
                              Audio level RMS
                            </td>
                            <td>
                              N/A
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Audio level DB
                            </td>
                            <td>
                              N/A
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
                              Downsample Rate
                            </td>
                            <td>
                              N/A
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                </Center>
              </Column>
            </Row>

            {
              isMicOn &&
              <Row>
                <Column>
                  <div style={{ overflow: 'auto' }}>
                    <div style={{ float: 'left' }}>

                      <button onClick={(evt) => this.stopMicrophone()}>
                        Stop Microphone
                      </button>
                    </div>
                    {
                      /*
                      <div style={{ float: 'right' }}>
                        00:00:00
                      </div>
                      */
                    }
                  </div>
                </Column>
              </Row>
            }

          </Column>
        </Row>
      </Window>
    );
  }
}
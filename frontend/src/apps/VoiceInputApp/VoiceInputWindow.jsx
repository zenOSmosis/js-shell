import React, {Component} from 'react';
import appRegistration from './appRegistration';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import { Row, Column } from 'components/RowColumn';
import AnalogVUMeter from 'components/AnalogVUMeter';

export default class HelloWorldWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        appRegistration={appRegistration}
      >
        <Row style={{height: '100%'}}>
          <Column>
            <Row>
              <Column>
                <AnalogVUMeter />
              </Column>
              <Column>
                <AnalogVUMeter />
              </Column>
            </Row>

            <Row style={{height: '100%'}}>
              <Column>
                <Center>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          Mic sample duration
                        </td>
                        <td>
                          N/A
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Mic sample length
                        </td>
                        <td>
                          N/A
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Mic sample rate
                        </td>
                        <td>
                          N/A
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
                          N/A
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Microphone Bitrate
                        </td>
                        <td>
                          N/A
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Downsample Bitrate
                        </td>
                        <td>
                          N/A
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Center>
              </Column>
            </Row>
            
            <Row>
              <Column>
                <div style={{position: 'absolute', bottom: 0, width: '100%', overflow: 'auto'}}>
                  <div style={{float: 'left'}}>
                    <button>
                      Stop Microphone
                    </button>
                  </div>
                  <div style={{float: 'right'}}>
                    00:00:00
                  </div>
                </div>
              </Column>
            </Row>

          </Column>
        </Row>
      </Window>
    );
  }
}
import React, { Component } from 'react';
import Button from '../../../../components/Button';
import LabeledSwitch from '../../../../components/LabeledSwitch';
// import { SegmentedControl, SegmentedControlItem } from '../../../../components/SegmentedControl';
import { Menu, MenuItem } from '../../../../components/Menu';
import { Select, Option } from '../../../../components/Select';
import { Layout, Content, Footer, Row, Column } from '../../../../components/Layout';
import LoadingSpinner from '../../../../components/spinners/LoadingSpinner';
import socketAPIRoutes from '../../../../utils/socketAPIRoutes';
import socket from '../../../../utils/socket.io';
import Cover from '../../../../components/Cover';
import Center from '../../../../components/Center';
import JSONEditor, { JSONEDITOR_MODE_CODE, JSONEDITOR_MODE_TREE, JSONEDITOR_MODE_VIEW } from '../../../../components/JSONEditor';

import { Input } from 'antd';
const { TextArea } = Input;

// TODO: Create separate components for Socket & REST connections
export default class HostConnection extends Component {
  state = {
    isQuerying: false,
    socketLatency: null,
    selectedSocketIOEventName: null,
    socketIOEventData: {},
    socketResponse: {},
    jsonEditorInputMode: JSONEDITOR_MODE_CODE // or tree
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ping();

    const { settingsWindow } = this.props;

    this.updateSubToolbar();
  }

  updateSubToolbar() {
    const { settingsWindow } = this.props;
    const { socketLatency } = this.state;

    settingsWindow.setSubToolbar(
      <Row>
        <Column style={{ textAlign: 'left' }}>
          <LabeledSwitch offLabel="Socket.io" onLabel="REST" />
        </Column>
        <Column style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline' }}>
            Ping roundtrip latency: {socketLatency} seconds<br />
            Last ping time: ... (ago)
            </div>
        </Column>
        <Column style={{ textAlign: 'right' }}>

        </Column>
      </Row>
    );
  }

  toggleInputMode() {
    let { jsonEditorInputMode } = this.state;

    jsonEditorInputMode = (jsonEditorInputMode === JSONEDITOR_MODE_CODE ? JSONEDITOR_MODE_TREE : JSONEDITOR_MODE_CODE);

    this.setState({
      jsonEditorInputMode
    });
  }

  ping() {
    const pingTime = new Date();
    socket.emit(socketAPIRoutes.SOCKET_API_ROUTE_PING, null, (data) => {
      console.debug('pong data', data);
      const pongTime = new Date();

      const socketLatency = (pongTime - pingTime) / 1000;

      this.setState({
        socketLatency
      }, () => {
        this.updateSubToolbar();
      });
    });
  }

  selectSocketIOEventName(selectedSocketIOEventName) {
    this.setState({
      selectedSocketIOEventName
    });
  }

  updateSocketIOEventData(socketIOEventData) {
    this.setState({
      socketIOEventData
    });
  }

  sendRequest() {
    const { selectedSocketIOEventName: eventName, socketIOEventData: eventData } = this.state;

    this.setState({
      isQuerying: true
    }, () => {
      // console.debug('emitting test event', eventName, eventData);
      socket.emit(eventName, eventData, (socketResponse) => {
        console.debug('socket response', socketResponse);

        if (typeof socketResponse === 'string' ||
          Array.isArray(socketResponse)) {
          // Convert socketResposne to an object
          socketResponse = Object.assign({}, {
            socketResponse
          });
        }

        this.setState({
          socketResponse,
          isQuerying: false
        });
      });
    });
  }

  render() {
    console.debug('socket api routes', socketAPIRoutes);

    // const { socketLatency } = this.state;

    return (

      <div>
        <Cover>
          <Layout>
            <Content style={{ overflow: 'auto' }}>
              <div style={{ textAlign: 'left' }}>
                <p>Emit event messages which correspond to socket API routes.</p>


                <div>
                  {
                    // Note: Using editor color
                  }

                  {
                    /*
                    <Menu mode="horizontal">
                      <MenuItem>Request</MenuItem>
                      <MenuItem>Response</MenuItem>
                    </Menu>
                    */
                  }

                  <Row>
                    <Column style={{borderRadius: 4, margin: 4}}>
                      Request:<br />
                      <div style={{ backgroundColor: '#3883FA' }}>
                        <span className="label">Socket.io API route</span>

                        <Select
                          defaultValue={this.state.selectedSocketIOEventName}
                          onChange={(value) => this.selectSocketIOEventName(value)}
                          style={{ width: 200 }}
                        >
                          {
                            Object.keys(socketAPIRoutes).map((key, idx) => {
                              const route = socketAPIRoutes[key];

                              return (
                                <Option key={idx} value={route}>{route}</Option>
                              );
                            })
                          }
                        </Select>
                        {
                          // <TextArea onChange={(value) => this.updateSocketIOEventData(value)} placeholder="Message data" defaultValue="{}" />
                        }

                        <LabeledSwitch onChange={(evt) => this.toggleInputMode()} offLabel={JSONEDITOR_MODE_CODE} onLabel={JSONEDITOR_MODE_TREE} />
                      </div>

                      {
                        // TODO: Replace newDate() with something more resistant to time change
                      }
                      <div key={`input ${new Date()}`} style={{ height: '100%', backgroundColor: '#fff' }}>
                        <JSONEditor
                          mode={this.state.jsonEditorInputMode} value={{}}
                          htmlElementProps={{
                            style: {
                              width: '100%',
                              height: '100%'
                            }
                          }}
                          onChange={evt => console.debug('json editor change', evt)}
                        />
                      </div>
                    </Column>

                    <Column style={{borderRadius: 4, margin: 4}}>
                      Response:<br />
                      {
                        // TODO: Replace newDate() with something more resistant to time change

                      }
                      <div key={`view ${new Date()}`} style={{ height: '100%', backgroundColor: '#fff' }}>
                        <JSONEditor
                          htmlElementProps={{
                            style: {
                              width: '100%',
                              height: '100%'
                            }
                          }}
                          mode={JSONEDITOR_MODE_VIEW}
                          value={this.state.socketResponse}
                        />
                      </div>

                    </Column>
                  </Row>

                </div>

              </div>
            </Content>

            <Footer style={{ textAlign: 'left' }}>
              <Row>
                <Column style={{ textAlign: 'left' }}>
                  ``<Button onClick={(evt) => this.sendRequest()}>Send Request</Button>
                </Column>
                <Column>
                </Column>
                <Column>
                </Column>
              </Row>
            </Footer>
          </Layout>

        </Cover>

        <Cover isVisible={this.state.isQuerying} style={{ backgroundColor: 'rgba(0,0,0,.4)' }}>
          <Center>
            <LoadingSpinner iconStyle={{ fontSize: 60 }} />
          </Center>
        </Cover>
      </div>
    );
  }
}
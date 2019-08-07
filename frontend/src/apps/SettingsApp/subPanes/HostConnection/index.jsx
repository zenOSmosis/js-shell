import React, { Component } from 'react';
import Button from 'components/Button';
import OLD_LabeledSwitch, {Switch} from 'components/OLD_LabeledSwitch';
// import { SegmentedControl, SegmentedControlItem } from 'components/SegmentedControl';
// import { Menu, MenuItem } from 'components/Menu';
import { Select, Option } from 'components/Select';
import { Layout, Content, Footer, Row, Column } from 'components/Layout';
import LoadingSpinner from 'components/spinners/LoadingSpinner';
import Cover from 'components/Cover';
import Center from 'components/Center';
import JSONEditor, { JSONEDITOR_MODE_CODE, JSONEDITOR_MODE_TREE, JSONEDITOR_MODE_VIEW } from 'components/JSONEditor';
import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';
import socket, {socketAPIQuery, SocketLinkedState} from 'utils/socket.io';
import hocConnect from 'state/hocConnect';

// import { Input } from 'antd';
// const { TextArea } = Input;

// TODO: Create separate components for Socket & REST connections
class HostConnection extends Component {
  state = {
    isQuerying: false,
    socketLatency: null,
    selectedSocketIOEventName: null,
    socketResponse: {},
    hasError: false,
    jsonEditorInputMode: JSONEDITOR_MODE_CODE // or tree
  };

  _renderIdx = -1;

  _requestData = {};

  componentDidMount() {
    this.ping();

    this.renderSubToolbar();
  }

  componentDidUpdate() {
    this.renderSubToolbar();
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
        // this.renderSubToolbar();
      });
    });
  }

  toggleSocketConnection() {
    const {isConnected} = this.props;

    if (isConnected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  }

  selectSocketIOEventName(selectedSocketIOEventName) {
    this.setState({
      selectedSocketIOEventName
    });
  }

  socketAPIQuery() {
    const { selectedSocketIOEventName: eventName } = this.state;
    const eventData = this._requestData;

    this.setState({
      isQuerying: true
    }, async () => {
      let _handleSocketResponse = (socketResponse, hasError = false) => {
        this.setState({
          hasError,
          socketResponse,
          isQuerying: false
        });
      };

      try {
        const socketResponse = await socketAPIQuery(eventName, eventData);

        console.debug('socket response', socketResponse);

        _handleSocketResponse(socketResponse);
      } catch (exc) {
        _handleSocketResponse(exc, true);
      }
    });
  }

  renderSubToolbar() {
    const { settingsWindow, isConnected } = this.props;
    const { socketLatency } = this.state;

    settingsWindow.setSubToolbar(
      <Row>
        <Column style={{ textAlign: 'left' }}>
          <div style={{textAlign: 'center', display: 'inline-block'}}>
            <Row>
              <Column>
                <OLD_LabeledSwitch offLabel="REST" onLabel="Socket.io" checked  />
              </Column>
            </Row>
            <Row>
              <Column>
                Testing Server
              </Column>
            </Row>
          </div>
        </Column>
        <Column style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline' }}>
            Latency: {socketLatency} s<br />
            Last ping time: ... (ago)
            </div>
        </Column>
        <Column style={{ textAlign: 'right' }}>
          <div style={{textAlign: 'center', display: 'inline-block'}}>
            <div>
              <Switch checked={isConnected} onChange={ (evt) => this.toggleSocketConnection() } />
            </div>
            <div>
              Connection
            </div>
          </div> 
        </Column>
      </Row>
    );
  }


  render() {
    this._renderIdx++;

    console.debug('socket api routes', socketAPIRoutes);

    let socketId = this.props.socketId || 'N/A';

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

                        <OLD_LabeledSwitch onChange={(evt) => this.toggleInputMode()} offLabel={JSONEDITOR_MODE_CODE} onLabel={JSONEDITOR_MODE_TREE} />
                      </div>

                      {
                        // TODO: Replace newDate() with something more resistant to time change
                      }
                      <div key={`input ${this._renderIdx}`} style={{ height: '100%' }}>
                        <JSONEditor
                          mode={this.state.jsonEditorInputMode} value={{}}

                          // TODO: Move to JSONEditor
                          htmlElementProps={{
                            style: {
                              width: '100%',
                              height: '100%'
                            }
                          }}
                          
                          onChange={requestData => this._requestData = requestData}
                        />
                      </div>
                    </Column>

                    <Column style={{borderRadius: 4, margin: 4}}>
                      Response:<br />
                      <div key={`view ${this._renderIdx}`} style={{ height: '100%' }}>
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
                  <Button onClick={(evt) => this.socketAPIQuery()}>Send Request</Button>
                </Column>
                <Column>
                </Column>
                <Column>
                  <div style={{position: 'fixed', bottom: 0}}>
                    Socket id: {socketId}
                  </div>
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

export default hocConnect(HostConnection, SocketLinkedState);
import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import { SegmentedControl, SegmentedControlItem } from 'components/SegmentedControl';
import { Layout, Header, Content, Footer } from 'components/Layout';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';
// import DesktopLinkedState from 'state/DesktopLinkedState';
// import SocketLinkedState from 'state/SocketLinkedState';
// import hocConnect from 'state/hocConnect';

const MODE_CLIENT = 'client';
const MODE_HOST = 'host';

export default class Environment extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      mode: MODE_CLIENT,
      remoteEnv: {}
    };
  }

  componentDidMount() {
    this.fetchRemoteEnv();
  }

  async fetchRemoteEnv() {
    try {
      const remoteEnv = await socketAPIQuery(socketAPIRoutes.SOCKET_API_ROUTE_ENV);

      this.setState({
        remoteEnv
      });
    } catch (exc) {
      throw exc;
    }
  }

  setMode(mode) {
    this.setState({
      mode
    });
  }

  render() {
    const { mode, remoteEnv } = this.state;

    let { clientIP, connectionStatus, isDesktopFocused } = this.props;
    clientIP = clientIP || 'N/A';

    return (
      <Layout>
        <Header>
          <SegmentedControl>
            <SegmentedControlItem
              active={mode === MODE_CLIENT}
              onClick={(evt) => this.setMode(MODE_CLIENT)}
            >
              Client
            </SegmentedControlItem>
            <SegmentedControlItem
              active={mode === MODE_HOST}
              onClick={(evt) => this.setMode(MODE_HOST)}
            >
              Host
            </SegmentedControlItem>
          </SegmentedControl>
        </Header>

        <Content>
          <Scrollable style={{ textAlign: 'left' }}>
            {
              this.state.mode === MODE_CLIENT &&
              <div>
                <div>
                  Display Mode:
                  <select>
                    <option>Desktop</option>
                    <option>Touch</option>
                  </select>
                  <hr />
                  Device:
                  <div>
                    Viewport Size: xy
                  </div>
                  <div>
                    Focused: {isDesktopFocused ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  Linked States: []
                </div>
                <div>
                  Windows: <button>Launch Window Manager</button>
                </div>
                {
                  Object.keys(process.env).map((envKey, idx) => {
                    return (
                      <div key={idx}>
                        {envKey}: {process.env[envKey]}
                      </div>
                    )
                  })
                }
              </div>
            }

            {
              this.state.mode === MODE_HOST &&
              <div>
                {
                  Object.keys(remoteEnv).map((envKey, idx) => {
                    return (
                      <div key={idx}>
                        {envKey}: {remoteEnv[envKey]}
                      </div>
                    )
                  })
                }
              </div>
            }

          </Scrollable>
        </Content>
        <Footer>
          client uptime / host uptime / Client IP: {clientIP} / {connectionStatus}
        </Footer>
      </Layout>
    );
  }
}

/*
const DesktopEnvironment = hocConnect(Environment, DesktopLinkedState, (updatedState) => {
  const {isFocused} = updatedState;

  let filteredState = {};

  if (typeof isFocused !== 'undefined') {
    filteredState.isDesktopFocused = isFocused;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});
*/

/*
const ConnectedEnvironment = hocConnect(DesktopEnvironment, SocketLinkedState, (updatedState) => {
  const {clientIP, connectionStatus} = updatedState;

  let filteredState = {};

  if (typeof clientIP !== 'undefined') {
    filteredState.clientIP = clientIP;
  };

  if (typeof connectionStatus !== 'undefined') {
    filteredState.connectionStatus = connectionStatus;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});
*/
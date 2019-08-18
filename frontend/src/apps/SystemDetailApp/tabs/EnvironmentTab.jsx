import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import { SegmentedControl, SegmentedControlItem } from 'components/SegmentedControl';
import { Layout, Header, Content, Footer } from 'components/Layout';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_NODE_ENV } from 'shared/socketAPI/socketAPIRoutes';
import DesktopLinkedState from 'state/DesktopLinkedState';
// import SocketLinkedState from 'state/SocketLinkedState';
import hocConnect from 'state/hocConnect';

const MODE_CLIENT = 'client';
const MODE_HOST = 'host';

const ViewportSize = (props) => {
  const { viewportSize } = props;
  if (!viewportSize) {
    return false;
  }

  const { width, height } = viewportSize;

  return (
    <span>Width: {width}x{height}</span>
  );
};

class Environment extends Component {
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
      const remoteEnv = await socketAPIQuery(SOCKET_API_ROUTE_NODE_ENV);

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

    let {
      clientIP,
      connectionStatus,
      isViewportFocused,
      viewportSize
    } = this.props;
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
                    Viewport Size: <ViewportSize viewportSize={viewportSize} />
                  </div>
                  <div>
                    Viewport Focused: {isViewportFocused ? 'Yes' : 'No'}
                  </div>
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

const DesktopEnvironment = hocConnect(Environment, DesktopLinkedState, (updatedState) => {
  const { isViewportFocused, viewportSize } = updatedState;

  let filteredState = {};

  if (typeof isViewportFocused !== 'undefined') {
    filteredState = {
      ...filteredState, ...{
        isViewportFocused
      }
    };
  }

  if (typeof viewportSize !== 'undefined') {
    filteredState = {
      ...filteredState, ...{
        viewportSize
      }
    };
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});

export default DesktopEnvironment;

/*
const ConnectedEnvironment = hocConnect(DesktopEnvironment, SocketLinkedState, (updatedState) => {
  const { clientIP, connectionStatus } = updatedState;

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
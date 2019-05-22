import React, {Component} from 'react';
import app from './app';
import Window from 'components/Desktop/Window';
import Scrollable from 'components/Scrollable';
import socketQuery, { socketAPIRoutes } from 'utils/socketQuery';

class Environment extends Component {
  state = {
    remoteEnv: {}
  };

  componentDidMount() {
    this.fetchRemoteEnv();
  }

  async fetchRemoteEnv() {
    try {
      const remoteEnv = await socketQuery(socketAPIRoutes.SOCKET_API_ROUTE_ENV);

      this.setState({
        remoteEnv
      });
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { remoteEnv } = this.state;

    return (
      <Scrollable style={{ textAlign: 'left' }}>
        <div>
          <div>Local</div>
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

        <div>
          <div>Remote</div>
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
      </Scrollable>
    );
  }
}

export default class SystemDetailWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        app={app}
      >
        <Environment />
      </Window>
    );
  }
}
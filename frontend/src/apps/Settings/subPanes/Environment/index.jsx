import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import socketQuery, { socketAPIRoutes } from 'utils/socketQuery';

export default class Environment extends Component {
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
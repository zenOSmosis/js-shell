import React, { Component } from 'react';
import Menubar from '../Menubar';
import Time from './Time';
import { Icon, /*Menu, Dropdown*/ } from 'antd';
import SocketLinkedState from 'state/SocketLinkedState';

import hocConnect from 'state/hocConnect';
import './style.css';

class Panel extends Component {
  render() {
    const { activeWindow, className, isConnected, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        className={`zd-desktop-panel horizontal ${className ? className : ''}`}
      >
        <div className="zd-desktop-panel-column-left">
          <Menubar />
        </div>

        <div className="zd-desktop-panel-column-right">
          <button>
            {
              ((isConnected) => {
                return `[ ${!isConnected ? 'no ' : ''}signal ]`;
              })(isConnected)
            }
          </button>

          <Time />

          <button>
            <Icon type="search" style={{ padding: 0, margin: 0, verticalAlign: 'middle' }} />
          </button>
          <button>
            <Icon type="menu-unfold" style={{ padding: 0, margin: 0, verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    );
  }
}

export default hocConnect(Panel, SocketLinkedState, (updatedState, socketState) => {
  const { isConnected } = socketState.getState();

  return {
    isConnected
  };
});
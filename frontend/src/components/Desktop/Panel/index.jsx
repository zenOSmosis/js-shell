import React, { Component } from 'react';
import TransparentButton from 'components/TransparentButton';
import { Row, Column } from 'components/RowColumn';
import Menubar from '../Menubar';
import Time from './Time';
import { Icon, /*Menu, Dropdown*/ } from 'antd';
import SocketLinkedState from 'state/SocketLinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';

import hocConnect from 'state/hocConnect';
import './style.css';

class Panel extends Component {
  _onFullScreenToggle() {
    const { isFullScreenRequested, desktopLinkedState } = this.props;

    desktopLinkedState.setState({
      isFullScreenRequested: !isFullScreenRequested
    });
  }

  render() {
    const {
      activeWindow,
      className,
      isConnected,
      isFullScreenRequested,
      desktopLinkedState,
      ...propsRest
    } = this.props;

    return (
      <div
        {...propsRest}
        className={`zd-desktop-panel horizontal ${className ? className : ''}`}
      >
        <Row>
          <Column className="zd-desktop-panel-column-left">
            <Menubar />
          </Column>

          <Column className="zd-desktop-panel-column-right">
            <div>
              <TransparentButton>
                {
                  // TODO: Replace w/ icon
                  ((isConnected) => {
                    return `[ ${!isConnected ? 'no ' : ''}signal ]`;
                  })(isConnected)
                }
              </TransparentButton>

              <Time />

              <TransparentButton>
                <Icon type="search" style={{ padding: 0, margin: 0, verticalAlign: 'middle' }} />
              </TransparentButton>

              <TransparentButton onClick={this._onFullScreenToggle.bind(this)}>
                <Icon type="fullscreen" style={{ padding: 0, margin: 0, verticalAlign: 'middle' }} />
              </TransparentButton>

              <TransparentButton>
                <Icon type="menu-unfold" style={{ padding: 0, margin: 0, verticalAlign: 'middle' }} />
              </TransparentButton>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

const SocketLinkedStatePanel = hocConnect(Panel, SocketLinkedState, (updatedState) => {
  const { isConnected } = updatedState;

  if (typeof isConnected !== 'undefined') {
    return {
      isConnected
    };
  }
});

const DesktopLinkedStatePanel = hocConnect(SocketLinkedStatePanel, DesktopLinkedState, (updatedState, desktopLinkedState) => {
  const { isFullScreenRequested } = updatedState;

  const filteredState = {};

  if (typeof isFullScreenRequested !== 'undefined') {
    filteredState.isFullScreenRequested = isFullScreenRequested;
  }

  return {
    ...filteredState, ...{
      desktopLinkedState
    }
  };
});

export default DesktopLinkedStatePanel;
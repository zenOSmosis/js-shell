import React, { Component } from 'react';
import TransparentButton from 'components/TransparentButton';
import { Row, Column } from 'components/RowColumn';
import Menubar from '../Menubar';
import Time from './Time';
import { Icon as AntdIcon, /*Menu, Dropdown*/ } from 'antd';
import SocketLinkedState from 'state/SocketLinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';

import hocConnect from 'state/hocConnect';
import classNames from 'classnames';
import style from './Panel.module.scss';

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
        className={classNames(style['panel'], className)}
      >
        <Row>
          <Column className={style['column-left']}>
            <Menubar />
          </Column>

          <Column className={style['column-right']}>
            <div>
              <TransparentButton>
                <Time />
              </TransparentButton>
              
              <TransparentButton>
                <i
                  className={classNames((isConnected ? 'shell-icons-wifi' : 'shell-icons-no-wifi'), style['shell-custom'])}
                  title={(isConnected ? 'Socket.io Connected' : 'Socket.io Disconnected')}
                />
              </TransparentButton>

              <TransparentButton>
                <AntdIcon type="search" />
              </TransparentButton>

              <TransparentButton onClick={this._onFullScreenToggle.bind(this)}>
                <AntdIcon type="fullscreen" />
              </TransparentButton>

              <TransparentButton>
                <AntdIcon type="menu-unfold" />
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
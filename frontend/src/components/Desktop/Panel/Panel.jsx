import React, { Component } from 'react';
import TransparentButton from 'components/TransparentButton';
import { Row, Column } from 'components/RowColumn';
import Menubar from '../Menubar';
import Time from './Time';
import SocketLinkedState from 'state/SocketLinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';

import FullScreenIcon from 'components/componentIcons/FullScreenIcon';
import SearchIcon from 'components/componentIcons/SearchIcon';
import SidebarIcon from 'components/componentIcons/SidebarIcon';
import WifiIcon from 'components/componentIcons/WifiIcon';
import NoWifiIcon from 'components/componentIcons/NoWifiIcon';

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
                {isConnected ? <WifiIcon /> : <NoWifiIcon />}
              </TransparentButton>

              <TransparentButton>
                <SearchIcon />
              </TransparentButton>

              <TransparentButton onClick={this._onFullScreenToggle.bind(this)}>
                <FullScreenIcon />
              </TransparentButton>

              <TransparentButton>
                <SidebarIcon />
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
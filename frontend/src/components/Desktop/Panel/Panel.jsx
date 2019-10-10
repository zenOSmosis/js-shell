import React, { Component } from 'react';
import FullScreenIcon from 'components/componentIcons/FullScreenIcon';
// import SearchIcon from 'components/componentIcons/SearchIcon';
// import SidebarIcon from 'components/componentIcons/SidebarIcon';
import TransparentButton from 'components/TransparentButton';
import { Row, Column } from 'components/RowColumn';
import Menubar from '../Menubar';
import SocketSignal from './SocketSignal';
import Time from './Time';
import DesktopLinkedState from 'state/DesktopLinkedState';
import hocConnect from 'state/hocConnect';
import classNames from 'classnames';
import styles from './Panel.module.scss';

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
        className={classNames(styles['panel'], className)}
      >
        <Row>
          <Column className={styles['column-left']}>
            <Menubar />
          </Column>

          <Column className={styles['column-right']}>
            <div>
              <Time />

              <SocketSignal />

              {
                /*
                <TransparentButton>
                  <SearchIcon />
                </TransparentButton>
                */
              }

              <TransparentButton onClick={this._onFullScreenToggle.bind(this)}>
                <FullScreenIcon />
              </TransparentButton>

              {
                /*
                <TransparentButton>
                  <SidebarIcon />
                </TransparentButton>
                */
              }
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default hocConnect(Panel, DesktopLinkedState, (updatedState, desktopLinkedState) => {
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
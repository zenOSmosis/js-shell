import React, { Component } from 'react';
import { Menu, MenuDivider, MenuItem, /* SubMenu */ } from 'components/Menu';
import TransparentButton from 'components/TransparentButton';
import { getWindowStackCentral } from 'core/ShellDesktop';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './Dock.module.scss';

const EVT_CONTEXT_MENU = 'contextmenu';
const EVT_MOUSEDOWN = 'mousedown';
const EVT_SCROLL = 'scroll';

//TODO: add preview of window via htm2tocanvas:
//https://html2canvas.hertzen.com

/*
  const input = document.getElementById('divIdToPrint');
  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
    })
  ;
 */

export default class DockItem extends Component {
  state = {
    isMenuVisible: false,
    isDockItemHovered: false
  };

  componentDidMount() {
    this._root.addEventListener(EVT_CONTEXT_MENU, this._handleContextMenu);
    document.addEventListener(EVT_MOUSEDOWN, this._handleDocClick);
    this._root.addEventListener(EVT_SCROLL, this._handleDocScroll);
  }

  componentWillUnmount() {
    this._root.removeEventListener(EVT_CONTEXT_MENU, this._handleContextMenu);
    document.removeEventListener(EVT_MOUSEDOWN, this._handleDocClick);
    this._root.removeEventListener(EVT_SCROLL, this._handleDocScroll);
  }

  // TODO: Use DesktopLinkedState for detection if we should present this context menu
  _handleContextMenu = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState({ isMenuVisible: true });
  };

  _handleDocClick = (evt) => {
    if (this._overlay) {
      const { isMenuVisible } = this.state;
      const wasOutside = !(this._overlay.contains(evt.target));
      if (wasOutside && isMenuVisible) this.setState({ isMenuVisible: false });
    }
  };

  _handleDocScroll = () => {
    const { isMenuVisible } = this.state;
    if (isMenuVisible) this.setState({ isMenuVisible: false });
  };
  
  _handleDockItemClick = (appRegistration) => {
    const isLaunched = appRegistration.getIsLaunched();

    if (!isLaunched) {
      appRegistration.launch();
    } else {
      this._showAllAppRegistrationWindows(appRegistration);
    }
  };

  _showAllAppRegistrationWindows(appRegistration) {
    const windowStackCentral = getWindowStackCentral();

    windowStackCentral.bringAppRegistrationWindowsToFront(appRegistration);
  }

  render() {
    const { isMenuVisible, isDockItemHovered } = this.state;
    const { appRegistration } = this.props;
    const isLaunched = appRegistration.getIsLaunched();
    const allowLaunch = !isLaunched || appRegistration.getAllowMultipleWindows();
    const IconView = appRegistration.getIconView();
    const title = appRegistration.getTitle();
    const appRuntimes = appRegistration.getJoinedAppRuntimes();

    return (
      <div
        ref={c => this._root = c}
        // effect="wobble" // TODO: Use variable
        className={classNames(styles['dock-item'], (isLaunched ? styles['open'] : null))}
      >
        <Tooltip
          title={title}
          visible={!isMenuVisible && isDockItemHovered}
        >
          <TransparentButton
            onMouseOver={evt => this.setState({ isDockItemHovered: true })}
            onMouseLeave={evt => this.setState({ isDockItemHovered: false })}
            onClick={evt => this._handleDockItemClick(appRegistration)}
            className={styles['dock-item-button']}
          >
            <IconView />

            <div className={styles['app-indicator-wrapper']}>
              {
                appRuntimes.map((appRuntime, idx) => {
                  // Prevent more than 5 indicators
                  // TODO: Make this configurable
                  if (idx > 4) {
                    return false;
                  }

                  return (
                    <div key={idx} className={styles['app-indicator']}></div>
                  );
                })
              }
            </div>
          </TransparentButton>
        </Tooltip>
        {
          isMenuVisible &&
          <div className={styles['dock-item-context-menu-wrapper']}>
            <div
              ref={ref => { this._overlay = ref }}
              className={styles['overlay']}
            >
              <Menu
                onClick={evt => { this.setState({ isMenuVisible: false }) }}
                // style={{ width: 256 }}
                mode="vertical"
              >
                {
                  // Title
                  appRuntimes.map((appRuntime, idx) => (
                    <MenuItem
                      key={`focus-${idx}`}
                      style={{ fontWeight: 'bold' }}
                      onClick={ evt => { appRuntime.focus() }}
                    >
                      {appRuntime.getTitle()}
                    </MenuItem>
                  ))
                }

                {
                  // Divider
                  isLaunched &&
                  <MenuDivider />
                }

                {
                  // Open
                  allowLaunch &&
                  <MenuItem
                    key={`launch`}
                    onClick={evt => { appRegistration.launch() }}
                  >
                    {appRuntimes.length ? 'Open new window' : 'Open'}
                  </MenuItem>
                }

                {
                  // Show all
                  // TODO: Display all only if more than one Window
                  isLaunched &&
                  <MenuItem
                    key={`focus`}
                    onClick={evt => { this._showAllAppRegistrationWindows(appRegistration) }}
                  >
                    Show all windows
                  </MenuItem>
                }

                {
                  // Divider
                  isLaunched &&
                  <MenuDivider />
                }

                {
                  // Close all
                  // TODO: Display all only if more than one Window
                  isLaunched &&
                  <MenuItem
                    key={`close`}
                    onClick={evt => { appRegistration.closeAllJoinedApps() }}
                  >
                    Close all windows
                  </MenuItem>
                }
              </Menu>
            </div>
          </div>
        }
      </div>
    );
  }
}

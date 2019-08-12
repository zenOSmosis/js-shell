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


import React, { Component } from 'react';
import { Menu,  MenuDivider,  MenuItem,  SubMenu  } from 'components/Menu';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import './style.css';

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
    this.setState({ menuVisible: true });
  };

  _handleDocClick = (evt) => {
    if(this._overlay) {
      const { menuVisible } = this.state;
      const wasOutside = !(this._overlay.contains(evt.target));
      if (wasOutside && menuVisible) this.setState({ menuVisible: false, });
    }
  };

  _handleDocScroll = () => {
    const { menuVisible } = this.state;
    if (menuVisible) this.setState({ menuVisible: false, });
  };

  /*
  _handleClick = (evt, appRegistration) => {
    console.debug('click', evt.key, appRegistration);
    const { key } = evt;

    switch (key) {
      // case 'launch':
      //   appRegistration.launchApp();
      // break;

      // case 'focus':
      //  appRegistration.focus();
      // break;

      default:
        let [key, idx] = evt.key.split('-');
    
        // Absorb key so it doesn't trigger a warning
        isUndefined(key);

        console.debug(idx);
        
        // appRegistration.getJoinedAppRuntimes()[idx].focus();
      break;
    }
  };
  */

  handleDockItemClick(appRegistration) {
    const isLaunched = appRegistration.getIsLaunched();

    if (!isLaunched) {
      appRegistration.launchApp();
    } else {
      console.warn('IMPLEMENT APP FOCUS');
    }
  }

  render() {
    const { isMenuVisible, isDockItemHovered } = this.state;
    const { appRegistration } = this.props;
    const isLaunched = appRegistration.getIsLaunched();
    const allowLaunch = !isLaunched || appRegistration.getAllowMultipleWindows();
    const iconSrc = appRegistration.getIconSrc();
    const title = appRegistration.getTitle();
    const appRuntimes = appRegistration.getJoinedAppRuntimes();

    return (
      <div
        ref={ c => this._root = c }
        // effect="wobble" // TODO: Use variable
        className={`zd-desktop-dock-item ${isLaunched ? 'open' : ''}`}
      >
        <Tooltip
          title={title}
          visible={!isMenuVisible && isDockItemHovered}
        >
          <button
            onMouseOver={evt => this.setState({ isDockItemHovered: true })}
            onMouseLeave={evt => this.setState({ isDockItemHovered: false })}
            onClick={evt => this._handleDockItemClick(appRegistration)}
          >
            <Image className="zd-desktop-dock-item-icon" src={iconSrc} />
          </button>
        </Tooltip>
        {
          isMenuVisible &&
          <div style={{ position: 'absolute' }}>
            <div
              ref={ref => { this._overlay = ref }}
              className="zd-context-menu-overlay "
            >
              <Menu
                onClick={evt => { this.setState({ isMenuVisible: false }) }}
                // style={{ width: 256 }}
                mode="vertical"
              >
                {
                  appRuntimes.map((runtime, idx) => (
                    <MenuItem
                      key={`focus-${idx}`}
                      style={{ fontWeight: 'bold' }}
                    >
                      {runtime.getTitle()}
                    </MenuItem>
                  ))
                }

                {
                  isLaunched &&
                  <MenuDivider />
                }

                {
                  allowLaunch &&
                  <MenuItem
                    key={`launch`}
                    onClick={evt => { appRegistration.launchApp() }}
                  >
                    {appRuntimes.length ? 'Open new window' : 'Open'}
                  </MenuItem>
                }

                {
                  isLaunched &&
                  <MenuItem key={`focus`}>Show all windows</MenuItem>
                }

                {
                  isLaunched &&
                  <MenuDivider />
                }

                {
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

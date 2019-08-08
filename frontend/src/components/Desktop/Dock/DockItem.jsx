import React, { Component } from 'react';
import { Menu, MenuDivider, MenuItem, /* SubMenu */ } from 'components/Menu';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import './style.css';

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
  };

  componentDidMount() {
    // TODO: Use constants
    this._root.addEventListener(EVT_CONTEXT_MENU, this._handleContextMenu);
    document.addEventListener(EVT_MOUSEDOWN, this._handleDocClick);
    this._root.addEventListener(EVT_SCROLL, this._handleDocScroll);
  }

  componentWillUnmount() {
    this._root.removeEventListener(EVT_CONTEXT_MENU, this._handleContextMenu);
    document.removeEventListener(EVT_MOUSEDOWN, this._handleDocClick);
    this._root.removeEventListener(EVT_SCROLL, this._handleDocScroll);
  }

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

  _handleClick = (evt, appRegistration) => {
    console.debug('click', evt.key, appRegistration);
    if (evt.key === 'launch') {
      appRegistration.launchApp();
    } else if (evt.key === 'focus') {
      appRegistration.focus();
    } else {
      let [key, idx] = evt.key.split('-');
      appRegistration.getAppRuntimes()[idx].focus();
    }
    this.setState({ isMenuVisible: false });
  };

  _handleDockItemClick = (appRegistration) => {
    const isLaunched = appRegistration.getIsLaunched();

    if (!isLaunched) {
      appRegistration.launchApp();
    } else {
      appRegistration.focus();
    }
  };

  render() {
    const { isMenuVisible } = this.state;
    const { appRegistration } = this.props;
    const isLaunched = appRegistration.getIsLaunched();
    const allowLaunch = !isLaunched || appRegistration.getAllowMultipleWindows();
    const iconSrc = appRegistration.getIconSrc();
    const title = appRegistration.getTitle();
    const appRuntimes = appRegistration.getAppRuntimes();

    return (
      <div
        ref={c => this._root = c}
        // effect="wobble" // TODO: Use variable
        className={`zd-desktop-dock-item ${isLaunched ? 'open' : ''}`}
      >
        <Tooltip title={title}>
          <button
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
                onClick={evt => this._handleClick(evt, appRegistration)}
                // style={{ width: 256 }}
                mode="vertical"
              >
                {
                  appRuntimes.map((runtime, idx) => (
                    <MenuItem key={'focus-' + idx}>{runtime.getTitle()}</MenuItem>
                  ))
                }

                {
                  appRuntimes.length &&
                  <MenuDivider />
                }


                {
                  allowLaunch &&
                  <MenuItem key="launch">{appRuntimes.length ? 'Open new window' : 'Open'}</MenuItem>
                }

                {
                  isLaunched &&
                  <MenuItem key="focus">Show all windows</MenuItem>
                }
              </Menu>
            </div>
          </div>
        }
      </div>
    );
  }
}

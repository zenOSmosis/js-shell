import React, { Component } from 'react';
import { Menu,  MenuDivider,  MenuItem,  SubMenu  } from 'components/Menu';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import './style.css';

export default class DockItem extends Component {
  state ={
    menuVisible: false,
  }

  componentDidMount() {
    this._root.addEventListener('contextmenu', this._handleContextMenu.bind(this));
    document.addEventListener('mousedown', this._handleDocClick.bind(this));
    this._root.addEventListener('scroll', this._handleDocScroll.bind(this));
  };

  componentWillUnmount() {
    this._root.removeEventListener('contextmenu', this._handleContextMenu);
    document.removeEventListener('mousedown', this._handleDocClick);
    this._root.removeEventListener('scroll', this._handleDocScroll);
  }

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

  _handleClick(evt, appRegistration) {
    console.debug('click', evt.key, appRegistration);
    if(evt.key === 'launch'){
      appRegistration.launchApp();
    } else if(evt.key === 'focus'){
      appRegistration.focus();
    } else {
      let [ key, idx ] = evt.key.split('-');
      appRegistration.getAppRuntimes()[idx].focus();
    }
    this.setState({ menuVisible: false, });
  }

  handleDockItemClick(appRegistration) {
    const isLaunched = appRegistration.getIsLaunched();

    if (!isLaunched) {
      appRegistration.launchApp();
    } else {
      appRegistration.focus();
    }
  }

  render() {
    const { menuVisible } = this.state;
    const { appRegistration } = this.props;
    const isLaunched = appRegistration.getIsLaunched();
    const allowLaunch = !isLaunched || appRegistration.getAllowMultipleWindows();
    const iconSrc = appRegistration.getIconSrc();
    const title = appRegistration.getTitle();
    
    return (
      <div
        ref={ c => this._root = c }
        // effect="wobble" // TODO: Use variable
        className={`zd-desktop-dock-item ${isLaunched ? 'open' : ''}`}
      >
        <Tooltip title={title}>
          <button
            onClick={ evt => this.handleDockItemClick(appRegistration) }
          >
            <Image className="zd-desktop-dock-item-icon" src={iconSrc} />
          </button>
        </Tooltip>
        {
          menuVisible &&
          <div style={{position:'absolute'}}>
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
                appRegistration.getAppRuntimes().map((runtime, idx)=>(
                  <MenuItem key={'focus-' + idx}>{runtime.getTitle()}</MenuItem>
                ))
              }

              {
                appRegistration.getAppRuntimes().length &&
                <MenuDivider />
              }

              
              {
                allowLaunch && 
                <MenuItem key="launch">{appRegistration.getAppRuntimes().length?'Open new window':'Open'}</MenuItem>
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

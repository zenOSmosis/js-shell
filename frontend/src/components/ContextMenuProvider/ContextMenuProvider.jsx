import React, { Component } from 'react';
import { Menu, MenuItem, MenuItemGroup, SubMenu } from 'components/Menu';
import { Icon } from 'antd';
import uuidv4 from 'uuid/v4';
import DesktopLinkedState from 'state/DesktopLinkedState';
import './style.css';
import hocConnect from '../../state/hocConnect';

class ContextMenuProvider extends Component {
  state = {
    isVisible: false
  };

  _uuidv4 = null;

  constructor(props) {
    super(props);

    this._uuidv4 = uuidv4();
  }

  componentDidMount() {
    this._root.addEventListener('contextmenu', this._handleContextMenu);
    this._root.addEventListener('click', this._handleDocClick);
    this._root.addEventListener('scroll', this._handleDocScroll);
  };

  componentWillUnmount() {
    this._root.removeEventListener('contextmenu', this._handleContextMenu);
    this._root.removeEventListener('click', this._handleDocClick);
    this._root.removeEventListener('scroll', this._handleDocScroll);
  }

  _handleContextMenu = (evt) => {
    let {isTrapping} = this.props;
    isTrapping = (typeof isTrapping === 'undefined' ? true : isTrapping);

    if (!isTrapping) {
      return;
    }

    // TODO: Remove
    console.debug('context menu uuidv4', this._uuidv4);

    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ isVisible: true });

    // TODO: Fix overlay positioning for moved windows, etc.
    // Issue is that overlays draw way off when presented on window moved far
    // east or south

    const clickX = evt.clientX;
    const clickY = evt.clientY;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = this._overlay.offsetWidth;
    const rootH = this._overlay.offsetHeight;

    const right = (screenW - clickX) > rootW;
    const left = !right;
    const top = (screenH - clickY) > rootH;
    const bottom = !top;

    if (right) {
      this._overlay.style.left = `${clickX + 5}px`;
    }

    if (left) {
      this._overlay.style.left = `${clickX - rootW - 5}px`;
    }

    if (top) {
      this._overlay.style.top = `${clickY + 5}px`;
    }

    if (bottom) {
      this._overlay.style.top = `${clickY - rootH - 5}px`;
    }
  };

  _handleDocClick = (evt) => {
    const { isVisible } = this.state;
    const wasOutside = !(evt.target.contains === this._overlay);

    if (wasOutside && isVisible) this.setState({ isVisible: false, });
  };

  _handleDocScroll = () => {
    const { isVisible } = this.state;

    if (isVisible) this.setState({ isVisible: false, });
  };

  _handleClick = (e) => {
    console.debug('click', e);
  }

  render() {
    const {
        children,
        isTrapping,
        className,
        ...propsRest
    } = this.props;
    
    const { isVisible } = this.state;

    return (
      <div
        {...propsRest}
        ref={ c => this._root = c }
        className={`zd-context-menu ${className ? className : ''}`}
      >
        {
          children
        }
        {
          isVisible &&
          <div ref={ref => { this._overlay = ref }} className="zd-context-menu-overlay">
            {
              // TODO: Replace hardcoded menu
            }
            <Menu
                onClick={this._handleClick}
                // style={{ width: 256 }}
                mode="vertical"
            >
              <SubMenu
                  key="sub1"
                  title={
                    <span>
                        <Icon type="mail" /><span>Navigation One</span>
                    </span>
                  }>
                <MenuItemGroup title="Item 1">
                  <MenuItem key="1">Option 1</MenuItem>
                  <MenuItem key="2">Option 2</MenuItem>
                </MenuItemGroup>
                <MenuItemGroup title="Iteom 2">
                  <MenuItem key="3">Option 3</MenuItem>
                  <MenuItem key="4">Option 4</MenuItem>
                </MenuItemGroup>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                <MenuItem key="5">Option 5</MenuItem>
                <MenuItem key="6">Option 6</MenuItem>
                <SubMenu key="sub3" title="Submenu">
                  <MenuItem key="7">Option 7</MenuItem>
                  <MenuItem key="8">Option 8</MenuItem>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                <MenuItem key="9">Option 9</MenuItem>
                <MenuItem key="10">Option 10</MenuItem>
                <MenuItem key="11">Option 11</MenuItem>
                <MenuItem key="12">Option 12</MenuItem>
              </SubMenu>
            </Menu>
          </div>
        }
      </div>
    );
  };
}

export default hocConnect(ContextMenuProvider, DesktopLinkedState, (updatedState) => {
  const {contextMenuIsTrapping: isTrapping} = updatedState;

  let filteredState = {};

  if (typeof isTrapping !== 'undefined') {
    filteredState = {
      isTrapping
    };
  }
  
  if (filteredState) {
    return filteredState;
  }
});
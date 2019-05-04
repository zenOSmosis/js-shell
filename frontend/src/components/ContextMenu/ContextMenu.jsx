import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import uuidv4 from 'uuid/v4';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
import './style.css';

const {SubMenu, ItemGroup: MenuItemGroup} = Menu;

class ContextMenu extends Component {
  state = {
    isVisible: false,
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
        className,
        isTrapping,
        getPopupContainer: propsGetPopupContainer,
        ...propsRest
    } = this.props;
    
    const { isVisible } = this.state;
    
    const getPopupContainer = propsGetPopupContainer || ((trigger) => trigger.parentNode);

    return (
      <div
        {...propsRest}
        ref={ c => this._root = c }
        className={`ContextMenu ${className ? className : ''}`}
      >
        {
          children
        }
        {
          isVisible &&
          <div ref={ref => { this._overlay = ref }} className="ContextMenuOverlay">
            <Menu
                theme="dark"
                getPopupContainer={ getPopupContainer }
                onClick={this._handleClick}
                style={{ width: 256 }}
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
                  <Menu.Item key="1">Option 1</Menu.Item>
                  <Menu.Item key="2">Option 2</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="Iteom 2">
                  <Menu.Item key="3">Option 3</Menu.Item>
                  <Menu.Item key="4">Option 4</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="7">Option 7</Menu.Item>
                  <Menu.Item key="8">Option 8</Menu.Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        }
      </div>
    );
  };
}

// Binds the context menu to DesktopLinkedState
const ConnectedContextMenu = (() => {
  return hocConnect(ContextMenu, DesktopLinkedState, (updatedState) => {
    const {contextMenuIsTrapping: isTrapping} = updatedState;
   
    const filteredState = {
      isTrapping
    };

    return filteredState;
  });
})();

export default ConnectedContextMenu;
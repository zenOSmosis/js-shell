import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import './style.css';

const {SubMenu, ItemGroup: MenuItemGroup} = Menu;

export default class ContextMenu extends Component {
  state = {
    isVisible: false,
  };

  componentDidMount() {
    document.addEventListener('contextmenu', this._handleContextMenu);
    document.addEventListener('click', this._handleDocClick);
    document.addEventListener('scroll', this._handleDocScroll);
  };

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this._handleContextMenu);
    document.removeEventListener('click', this._handleDocClick);
    document.removeEventListener('scroll', this._handleDocScroll);
  }

  _handleContextMenu = (event) => {
    let {isTrapping} = this.props;
    isTrapping = (typeof isTrapping === 'undefined' ? true : isTrapping);

    if (!isTrapping) {
      return;
    }

    event.preventDefault();

    this.setState({ isVisible: true });

    const clickX = event.clientX;
    const clickY = event.clientY;
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

  _handleDocClick = (event) => {
    const { isVisible } = this.state;
    const wasOutside = !(event.target.contains === this._overlay);

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
    const { children, className, isTrapping, ...propsRest } = this.props;
    const { isVisible } = this.state;

    return (
      <div
        {...propsRest}
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
                getPopupContainer={trigger => trigger.parentNode}
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
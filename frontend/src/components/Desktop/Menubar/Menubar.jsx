import React, { Component } from 'react';
import { Icon, Dropdown } from 'antd';
import { Menu, MenuDivider, MenuItem, SubMenu } from 'components/Menu';
import './style.css';

export default class Menubar extends Component {
  state = {
    visible: false,
  };

  handleMenuClick = (e) => {
    if (e.key === '3') {
      this.setState({ visible: false });
    }
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  render() {
    let _PROTO_MENUS = [];

    _PROTO_MENUS.push({
      title: <Icon type="deployment-unit" />,
      menuComponent: (() => {
        return (
          <Menu mode="vertical">
            <SubMenu
              key="sub1"
              title={
                <div style={{display: 'inline-block'}}>
                  <Icon type="desktop" />&nbsp;
                  <span>System Information</span>
                </div>                
              }
            >
              <MenuItem key="sub1.1">Client</MenuItem>
              <MenuItem key="sub1.2">Server</MenuItem>
            </SubMenu>

            <SubMenu
              key="sub2"
              title={
                <div style={{display: 'inline-block'}}>
                  <Icon type="setting" />&nbsp;
                  <span>Settings / Utilities</span>
                </div>
              }
            >
              <MenuItem key="sub2.1">Background</MenuItem>
              <MenuItem key="sub2.2">Context Menu</MenuItem>
              <MenuItem key="sub2.3">Notifications</MenuItem>
              <MenuItem key="sub2.4">Drawer</MenuItem>
              <MenuItem key="sub2.5">Host Connection</MenuItem>
              <MenuItem key="sub2.6">LinkedState Monitor</MenuItem>
              <MenuItem key="sub2.7">Connected Devices</MenuItem>
            </SubMenu>

            <MenuDivider />

            <MenuItem key="4">
              <Icon type="logout" />
              <span>Log Off</span>
            </MenuItem>
          </Menu>
        );
      })()
    });

    _PROTO_MENUS.push({
      title: 'App',
      titleStyle: {
        fontWeight: 900,
      },
      menuComponent: (() => {
        return (
          <Menu>
            <MenuItem key="1">
              <span>Close</span>
            </MenuItem>
          </Menu>
        );
      })()
    });

    _PROTO_MENUS.push({
      title: 'File',
      menuComponent: (() => {
        return (
          <Menu>
            <MenuItem key="1">
              <span>New</span>
            </MenuItem>
            <MenuItem key="2">
              <span>Open</span>
            </MenuItem>
            <MenuItem key="3">
              <span>Save</span>
            </MenuItem>
            <MenuItem key="4">
              <span>Save As</span>
            </MenuItem>
            <MenuItem key="5">
              <span>Close</span>
            </MenuItem>
          </Menu>
        );
      })()
    });

    _PROTO_MENUS.push({
      title: 'Edit',
      menuComponent: (() => {
        return (
          <Menu>
            <MenuItem key="1" disabled>
              <Icon type="undo" />
              <span>Undo</span>
            </MenuItem>
            <MenuItem key="2">
              <Icon type="redo" />
              <span>Redo</span>
            </MenuItem>
            <MenuItem key="3">
              <Icon type="scissor" />
              <span>Cut</span>
            </MenuItem>
            <MenuItem key="4">
              <Icon type="copy" />
              <span>Copy</span>
            </MenuItem>
            <MenuItem key="5">
              <Icon type="snippets" />
              <span>Paste</span>
            </MenuItem>
            <MenuItem key="6">
              &nbsp;
              <span>Select All</span>
            </MenuItem>
          </Menu>
        );
      })()
    });

    _PROTO_MENUS.push({
      title: 'Window',
      menuComponent: (() => {
        return (
          <Menu>
            <MenuItem key="1">
              <span>Minimize</span>
            </MenuItem>
            <MenuItem key="2">
              <span>Maximize</span>
            </MenuItem>
          </Menu>
        );
      })()
    });

    return (
      <ul className="zd-menubar">
        {
          _PROTO_MENUS.map((menuData, idx) => {
            // TODO: Extract Menubar Menu component

            const {menuComponent, title, titleStyle: propsTitleStyle} = menuData;

            const titleStyle = Object.assign(
              {
                fontWeight: 500,
                display: 'inline-block',
                verticalAlign: 'middle'
              },
              propsTitleStyle
            );

            return (
              <Dropdown
                key={idx}
                getPopupContainer={trigger => trigger.parentNode}
                trigger={['click']}
                overlay={menuComponent}
              >
                <li style={titleStyle}>
                {
                  title
                }
                </li>
              </Dropdown>
            )
          })
        }
      </ul>
    );
  }
}

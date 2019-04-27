import React, { Component } from 'react';
import { Icon, Dropdown } from 'antd';
import { Menu, MenuItem, SubMenu } from '../../Menu';
import './style.css';
// const { SubMenu, Item: MenuItem } = Menu;

/*
export default class Menubar extends Component {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <Icon type="deployment-unit" style={{margin: 0, padding: 0, verticalAlign: 'middle'}} />
      </div>
    );
  }
}
*/


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
      title: 'First',
      menuComponent: (() => {
        return (
          <Menu>
            <MenuItem key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </MenuItem>
            <MenuItem key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </MenuItem>
            <MenuItem key="3">
              <Icon type="inbox" />
              <span>Option 3</span>
            </MenuItem>
            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
              <MenuItem key="5">Option 5</MenuItem>
              <MenuItem key="6">Option 6</MenuItem>
              <MenuItem key="7">Option 7</MenuItem>
              <MenuItem key="8">Option 8</MenuItem>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
              <MenuItem key="9">Option 9</MenuItem>
              <MenuItem key="10">Option 10</MenuItem>
              <SubMenu key="sub3" title="Submenu">
                <MenuItem key="11">Option 11</MenuItem>
                <MenuItem key="12">Option 12</MenuItem>
              </SubMenu>
            </SubMenu>
          </Menu>
        );
      })()
    });

    _PROTO_MENUS.push({
      title: 'Second',
      menuComponent: (() => {
        return (
          <Menu>
            <MenuItem key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </MenuItem>
            <MenuItem key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </MenuItem>
            <MenuItem key="3">
              <Icon type="inbox" />
              <span>Option 3</span>
            </MenuItem>
            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
              <MenuItem key="5">Option 5</MenuItem>
              <MenuItem key="6">Option 6</MenuItem>
              <MenuItem key="7">Option 7</MenuItem>
              <MenuItem key="8">Option 8</MenuItem>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
              <MenuItem key="9">Option 9</MenuItem>
              <MenuItem key="10">Option 10</MenuItem>
              <SubMenu key="sub3" title="Submenu">
                <MenuItem key="11">Option 11</MenuItem>
                <MenuItem key="12">Option 12</MenuItem>
              </SubMenu>
            </SubMenu>
          </Menu>
        );
      })()
    });

    return (
      <ul className="Menubar">
        {
          _PROTO_MENUS.map((menuData, idx) => {
            // TODO: Extract Menubar Menu component

            const {menuComponent, title} = menuData;
            return (
              <Dropdown
                key={idx}
                getPopupContainer={trigger => trigger.parentNode}
                trigger={['click']}
                overlay={menuComponent}
              >
                <li>
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

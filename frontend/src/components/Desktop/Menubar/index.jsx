import React, {Component} from 'react';
import {Icon, Dropdown, Menu} from 'antd';
import './style.css';
const {SubMenu, Item: MenuItem} = Menu;

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
    return (
      <div className="Menubar">
        <Dropdown
          getPopupContainer={trigger => trigger.parentNode}
          trigger={['click']}
          overlay={
            <Menu
              // defaultSelectedKeys={['1']}
              // defaultOpenKeys={['sub1']}
              mode="vertical"
              theme="dark"
              
              // inlineCollapsed={this.state.collapsed}
            >
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="inbox" />
                <span>Option 3</span>
              </Menu.Item>
              <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          }
        >
          <span>[ Menu ]</span>
        </Dropdown>

        <Dropdown
          getPopupContainer={trigger => trigger.parentNode}
          trigger={['click']}
          overlay={
            <Menu
              // defaultSelectedKeys={['1']}
              // defaultOpenKeys={['sub1']}
              mode="vertical"
              theme="dark"
              
              // inlineCollapsed={this.state.collapsed}
            >
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="inbox" />
                <span>Option 3</span>
              </Menu.Item>
              <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          }
        >
          <span>[ Menu 2 ]</span>
        </Dropdown>
      </div>
    );
  }
}

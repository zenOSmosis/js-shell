import React, {Component} from 'react';
import {Icon, Dropdown, Menu} from 'antd';

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
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">Clicking me will not close the menu.</Menu.Item>
        <Menu.Item key="2">Clicking me will not close the menu also.</Menu.Item>
        <Menu.Item key="3">Clicking me will close the menu</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={menu}
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
        trigger={['click']}
      >
        <Icon type="deployment-unit" style={{margin: 0, padding: 0, verticalAlign: 'middle'}} />
      </Dropdown>
    );
  }
}

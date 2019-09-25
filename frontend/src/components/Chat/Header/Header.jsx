import React, { Component } from 'react';
import { Icon } from 'antd';

class Header extends Component {
  render() {
    const { remotePeerId } = this.props;

    return (
      <div style={{backgroundColor: 'rgba(255,255,255,.8)', color: '#000', fontSize: '1.4rem', fontWeight: 'bold'}}>
        {remotePeerId} <Icon type="phone" />
      </div>
    );
  }
}

export default Header;
import React, { Component } from 'react';
import { Icon } from 'antd';

class Header extends Component {
  render() {
    return (
      <div style={{backgroundColor: 'rgba(255,255,255,.8)', color: '#000', fontSize: '1.4rem', fontWeight: 'bold'}}>
        [ Header ] <Icon type="phone" />
      </div>
    );
  }
}

export default Header;
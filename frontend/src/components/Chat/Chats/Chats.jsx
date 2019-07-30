import React, { Component } from 'react';
import Full from 'components/Full';
import { Avatar } from 'antd';

class Chats extends Component {
  render() {
    return (
      <Full>
        <input type="text" placeholder="Search Chats" />
        <div>
          <Avatar icon="user" />
        </div>
      </Full>
    )
  }
}

export default Chats;
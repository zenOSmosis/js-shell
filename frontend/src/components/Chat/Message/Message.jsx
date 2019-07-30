import React from 'react';
import { Avatar } from 'antd';
// import { Row, Column } from 'components/Layout';
import './Message.css';

const Message = (props = {}) => {
  const { children, fromLocal } = props;

  return (
    <div className={`zd-chat-message ${fromLocal ? 'local' : 'remote'}`}>
      {
        !fromLocal &&
        <Avatar icon="user" className="zd-chat-message-avatar" />
      }

      <div className="zd-chat-message-bubble">
        {
          children
        }
      </div>

      {
        fromLocal &&
        <Avatar icon="user" className="zd-chat-message-avatar" />
      }
    </div>
  );
};

export default Message;
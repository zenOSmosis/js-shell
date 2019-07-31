import React from 'react';
import { Avatar } from 'antd';
// import { Row, Column } from 'components/Layout';
import './Message.css';

const MessageAvatar = () => {
  return (
    <Avatar
      size={48}
      icon="user"
      className="zd-chat-message-avatar"
    />
  )
};

const Message = (props = {}) => {
  const { children, fromLocal } = props;

  return (
    <div className={`zd-chat-message ${fromLocal ? 'local' : 'remote'}`}>
      {
        !fromLocal &&
        <MessageAvatar />
      }

      <div className="zd-chat-message-bubble">
        {
          children
        }
      </div>

      {
        fromLocal &&
        <MessageAvatar />
      }
    </div>
  );
};

export default Message;
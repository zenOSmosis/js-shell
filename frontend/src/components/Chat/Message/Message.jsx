import React from 'react';
import { Avatar } from 'antd';
// import { Row, Column } from 'components/Layout';
import classNames from 'classnames';
import style from './Message.module.scss';

const MessageAvatar = () => {
  return (
    <Avatar
      size={48}
      icon="user"
      className={style['avatar']}
    />
  )
};

const Message = (props = {}) => {
  const { children, fromLocal } = props;

  return (
    <div
      className={classNames(style['chat-message'], (fromLocal ? style['local'] : style['remote']))}
    >
      <MessageAvatar />

      <div className={style['chat-bubble']}>
        {
          children
        }
      </div>
    </div>
  );
};

export default Message;
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
  const { chatMessage } = props;
  const isFromLocal = chatMessage.getIsFromLocal();
  const isFinalized = chatMessage.getIsFinalized();

  if (isFromLocal && !isFinalized) {
    return false;
  }

  const messageBody = chatMessage.getMessageBody();
  const isTyping = chatMessage.getIsTyping();

  return (
    <div
      className={classNames(style['chat-message'], (isFromLocal ? style['local'] : style['remote']))}
    >
      <MessageAvatar />

      <div className={style['chat-bubble']}>
        {
          isTyping &&
          <span style={{fontStyle: 'italic'}}>...typing</span>
        }
        {
          // TODO: Implement link parsing, etc.
          messageBody
        }
      </div>
    </div>
  );
};

export default Message;
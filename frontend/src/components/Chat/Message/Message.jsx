import React from 'react';
import { Avatar } from 'antd';
// import { Row, Column } from 'components/Layout';
import classNames from 'classnames';
import styles from './Message.module.scss';

const MessageAvatar = () => {
  return (
    <Avatar
      size={36}
      icon="user"
      className={styles['avatar']}
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

  if (!isTyping && !isFinalized) {
    // Don't show anything if remote peer is neither typing, or hasn't sent the
    // full message
    return false;
  }

  // Message is rendered, so mark it as read
  chatMessage.markAsRead();

  return (
    <div
      className={classNames(styles['chat-message'], (isFromLocal ? styles['local'] : styles['remote']))}
    >
      <MessageAvatar />

      <div className={styles['chat-bubble']}>
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
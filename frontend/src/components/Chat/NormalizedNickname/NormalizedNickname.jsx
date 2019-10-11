import React from 'react';
import classNames from 'classnames';
import styles from './NormalizedNickname.module.scss';
import PropTypes from 'prop-types';

const DEFAULT_NICKNAME = '[Unknown Peer]';

const NormalizedNickname = (props) => {
  let { className, nickname, ...propsRest } = props;

  const hasSpecifiedNickname = (nickname && nickname.length);

  if (!hasSpecifiedNickname) {
    nickname = DEFAULT_NICKNAME;
  }

  return (
    <span
      {...propsRest}
      className={
        classNames(
          styles['normalized-nickname'],
          (!hasSpecifiedNickname ? styles['non-specified'] : null),
          className
        )
      }
    >
      {nickname}
    </span>
  )
};

NormalizedNickname.propTypes = {
  nickname: PropTypes.string.isRequired
};

export default NormalizedNickname;
import React from 'react';
import Peer from 'utils/p2p/Peer.class';
import classNames from 'classnames';
import styles from './NormalizedNickname.module.scss';
import PropTypes from 'prop-types';

const NormalizedNickname = (props) => {
  let { className, nickname, ...propsRest } = props;

  const {
    normalizedNickname,
    hasSpecifiedNickname
  } = Peer.getNormalizedNicknameData(nickname);

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
      {normalizedNickname}
    </span>
  )
};

NormalizedNickname.propTypes = {
  nickname: PropTypes.string
};

export default NormalizedNickname;
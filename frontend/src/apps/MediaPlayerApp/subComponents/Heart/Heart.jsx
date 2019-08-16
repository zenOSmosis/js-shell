import React from 'react';
import { Icon } from 'antd';
import styles from './Heart.module.css';
import classNames from 'classnames';

const Heart = (props) => {
  const {
    isLoved,
    className: propsClassName,
    ...propsRest
  } = props;

  const className = classNames(
    styles['heart'],
    (isLoved ? styles['loved'] : null),
    propsClassName
  );

  return (
    <Icon
      {...propsRest}
      className={className}
      type="heart"
      theme="filled"
    />
  );
};

export default Heart;
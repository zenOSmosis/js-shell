import React from 'react';
import classNames from 'classnames';
import styles from './TransparentButton.module.css';

const TransparentButton = (props) => {
  const { children, className, ...propsRest } = props;

  return (
    <button
      {...propsRest}
      className={classNames(styles['transparent-button'], className)}
    >
      {
        children
      }
    </button>
  );
};

export default TransparentButton;
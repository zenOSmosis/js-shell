import React from 'react';
import Full from '../Full';
import './style.css';

const Scrollable = (props = {}) => {
  const {className, children, ...propsRest} = props;

  let {allowScrollY, allowScrollX} = props;

  // Enable scroll Y by default
  allowScrollY = (typeof allowScrollY === 'undefined' ? true : allowScrollY);

  return (
    <Full
      {...propsRest}
      className={`zd-scrollable ${allowScrollY ? 'scroll-y' : ''} ${allowScrollX ? 'scroll-x' : ''} ${className ? className : ''}`}
    >
      {
        children
      }
    </Full>
  );
};

export default Scrollable;
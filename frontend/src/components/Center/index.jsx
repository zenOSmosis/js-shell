import React from 'react';
import './style.css';

const Center = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      className={`zd-center ${className ? className : ''}`}
      {...propsRest}
    >
      {
        children
      }
    </div>
  );
};

export default Center;
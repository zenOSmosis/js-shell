import React from 'react';
import './style.css';

const Full = (props = {}) => {
  const { children, className, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={`zd-full ${className ? className : ''}`}
    >
      {
        children
      }
    </div>
  );
}

export default Full;
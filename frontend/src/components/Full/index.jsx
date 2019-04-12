import React from 'react';
import './style.css';

const Full = (props = {}) => {
  const { children, className, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={`Full ${className ? className : ''}`}
    >
      {
        children
      }
    </div>
  );
}

export default Full;
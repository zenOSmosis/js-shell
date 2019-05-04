import React from 'react';
import './style.css';

const Center = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      className={`zd-center ${className ? className : ''}`}
      {...propsRest}
    >
      <div className="zd-center-item">
        {
          children
        }
      </div>
    </div>
  );
};

export default Center;
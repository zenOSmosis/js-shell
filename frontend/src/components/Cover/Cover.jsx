import React from 'react';
import './style.css';

const Cover = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      {...propsRest}
      className={`Cover ${className ? className : ''}`}
    >
      {
        children
      }
    </div>
  );
};

export default Cover;
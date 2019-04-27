import React from 'react';
import './style.css';

const StackingContext = (props = {}) => {
  const {
    className,
    children,
    ...propsRest
  } = props;

  return (
    <div
      {...propsRest}
      className={`StackingContext ${className ? className : ''}`}
    >
      {
        children
      }
    </div>
  )
};

export default StackingContext;
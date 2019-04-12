import React from 'react';

export const StackingContext = (props = {}) => {
  const {children, ...propsRest} = props;

  return (
    <div
      {...propsRest}
    >
      {
        children
      }     
    </div>
  )
};
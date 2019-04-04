import React, {Component} from 'react';
import './style.css';

let Center;

export default Center = (props = {}) => {
  const {children, className, ...propsRest} = props;

  return (
    <div
      className={`Center ${className ? className : ''}`}
      {...propsRest}
    >
      <div className="CenterItem">
        {
          children
        }
      </div>
    </div>
  );
};
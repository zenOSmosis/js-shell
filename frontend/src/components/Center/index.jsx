import React, {Component} from 'react';
import './style.css';

export default Center = (props = {}) => {
  const {children, className, ...propsRest} = this.props;

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
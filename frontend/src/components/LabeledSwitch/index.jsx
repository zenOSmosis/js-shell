import React from 'react';
import Switch from '../Switch';
import './style.css';

const LabeledSwitch = (props = {}) => {
  const {className, offLabel, onLabel, style, ...propsRest} = props;

  return (
    <div
      className={`LabeledSwitch ${className ? className : ''}`}
      style={style}
    >
      <div className="Label">
        {offLabel}
      </div>
      <Switch
        {...propsRest}
      />
      <div className="Label">
        {onLabel}
      </div>
    </div>
  );
};

export default LabeledSwitch;

export {
  Switch
};
import React from 'react';
import Switch from '../Switch';
import './style.css';

/**
 * A switch with adjacent labels.
 */
const LabeledSwitch = (props = {}) => {
  const {className, offLabel, onLabel, style, ...propsRest} = props;

  return (
    <div
      className={`zd-labeled-switch ${className ? className : ''}`}
      style={style}
    >
      <div className="label">
        {offLabel}
      </div>
      <Switch
        {...propsRest}
      />
      <div className="label">
        {onLabel}
      </div>
    </div>
  );
};

export default LabeledSwitch;

export {
  Switch
};
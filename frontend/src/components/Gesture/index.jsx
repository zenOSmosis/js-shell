import React, { Component } from 'react';
import { withGesture } from 'react-with-gesture';
import './style.css';

// @see https://www.npmjs.com/package/react-with-gesture
// @see https://github.com/react-spring/react-use-gesture
const Gesture = (props) => {
  const { children, className, ref, touch, mouse, passive, onAction, onMove, onUp, onDown, ...propsRest } = props;

  const gestureConfig = {
    ref,
    touch,
    mouse,
    passive,
    onAction,
    onMove,
    onUp,
    onDown
  };

  const Wrapper = () => {
    return (
      <div
        {...propsRest}
        className={`zd-gesture ${className ? className : ''}`}
      >
        {
          children
        }
      </div>
    );
  };

  const GesturizedComponent = withGesture(gestureConfig)(Wrapper);

  return (
    <GesturizedComponent />
  );
};

export default Gesture;
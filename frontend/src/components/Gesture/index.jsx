import React, { Component } from 'react';
import { withGesture } from 'react-with-gesture';
import './style.css';

// TODO: Consider swapping out w/ https://interactjs.io/
// interact.js hoc example: https://github.com/beizhedenglong/reactablejs
//
// @see https://www.npmjs.com/package/react-with-gesture
export default class Gesture extends Component {
  render() {
    const { children, className, ref, touch, mouse, passive, onAction, onMove, onUp, onDown, ...propsRest } = this.props;

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

    const WrappedComponent = withGesture(gestureConfig)(Wrapper);

    return (
      <WrappedComponent />
    );
  }
}
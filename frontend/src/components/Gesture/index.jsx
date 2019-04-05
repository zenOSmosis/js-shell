import React from 'react';
import {withGesture} from 'react-with-gesture';

// @see https://www.npmjs.com/package/react-with-gesture
const Gesture = (props = {}) => {
  let {children} = props;

  const Wrapper = () => {
    return (
      <div
        style={{display: 'inline-block'}}
      >
        {
          children
        }
      </div>
    );
  };

  const Component = withGesture(props)(Wrapper);

  return (
    <Component />
  );
}

export default Gesture;
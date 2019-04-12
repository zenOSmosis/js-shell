import React from 'react';
import Spinner from '../Spinner';

// @see https://ant.design/components/spin/
const LoadingSpinner = (props = {}) => {
  const {...propsRest} = props;

  return (
    <Spinner
      {...propsRest}
      iconType="loading"
    />
  );
};

export default LoadingSpinner;
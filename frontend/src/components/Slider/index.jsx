import React from 'react';
import { Slider as AntdSlider } from 'antd';

// @see https://ant.design/components/slider/
const Slider = (props = {}) => {
  const {...propsRest} = props;

  return (
    <AntdSlider
      {...propsRest}
    />
  );
};

export {
  Slider
}
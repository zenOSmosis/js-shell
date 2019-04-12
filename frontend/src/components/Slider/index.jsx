import React from 'react';
import { Slider as AntdSlider } from 'antd';
import './style.css';

// @see https://ant.design/components/slider/
const HorizontalSlider = (props = {}) => {
  let { className, ...propsRest } = props;

  return (
    <AntdSlider
      {...propsRest}
      className={`Slider Horizontal ${className ? className : ''}`}
    />
  );
};

const VerticalSlider = (props = {}) => {
  let { className, ...propsRest } = props;

  return (
    <AntdSlider
      {...propsRest}
      className={`Slider Vertical ${className ? className : ''}`}
      vertical
    />
  );
};

export {
  HorizontalSlider,
  VerticalSlider
}
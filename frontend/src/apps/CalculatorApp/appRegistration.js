import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import CalculatorWindow from './CalculatorWindow';
import config from 'config';

export default registerApp({
  title: 'Calculator',
  view: (props) => {
    return (
      <CalculatorWindow {...props} />
    )
  },
  minWidth: 200,
  minHeight: 200,
  isResizable: false,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}calculator/calculator.svg`
});
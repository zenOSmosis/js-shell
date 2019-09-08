import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import CalculatorWindow from './CalculatorWindow';
import { HOST_ICON_URL_PREFIX } from 'config';

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
  iconSrc: `${HOST_ICON_URL_PREFIX}calculator/calculator.svg`
});
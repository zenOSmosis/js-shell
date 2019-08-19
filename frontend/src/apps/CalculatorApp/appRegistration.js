import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import CalculatorWindow from './CalculatorWindow';
import config from 'config';

export default registerApp({
  title: 'Calculator',
  mainView: (props) => {
    return (
      <CalculatorWindow {...props} />
    )
  },
  minWidth:200,
  minHeight:200,
  sizeable: false,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}calculator/calculator.svg`
});
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import CalculatorWindow from './CalculatorWindow';
import CalculatorIcon from 'components/componentIcons/CalculatorIcon';

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
  iconView: () => <CalculatorIcon />
});
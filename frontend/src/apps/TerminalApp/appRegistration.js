import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import TerminalWindow from './TerminalWindow';
import TerminalIcon from 'components/componentIcons/TerminalIcon';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Terminal',
  view: (props) => {
    return (
      <TerminalWindow {...props} />
    )
  },
  iconView: () => <TerminalIcon />
});
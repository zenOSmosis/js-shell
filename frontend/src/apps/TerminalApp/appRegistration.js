import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import TerminalWindow from './TerminalWindow';
import config from 'config';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Terminal',
  view: (props) => {
    return (
      <TerminalWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}terminal/terminal.svg`
});
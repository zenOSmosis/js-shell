import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import TerminalWindow from './TerminalWindow';
import config from 'config';

export default registerApp({
  title: 'Terminal',
  mainView: (props) => {
    return (
      <TerminalWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}terminal/terminal.svg`
});
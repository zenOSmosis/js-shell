import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SystemDetailWindow from './SystemDetailWindow';
import SystemIcon from 'components/componentIcons/SystemIcon';

export default registerApp({
  title: 'System Detail',
  view: (props) => {
    return (
      <SystemDetailWindow {...props} />
    );
  },
  iconView: () => <SystemIcon />
});
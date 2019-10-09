import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import IconsWindow from './IconsWindow';
import IconsIcon from 'components/componentIcons/IconsIcon';

export default registerApp({
  title: 'Icons',
  view: (props) => {
    return (
      <IconsWindow {...props} />
    );
  },
  iconView: () => <IconsIcon />
});
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import HelloWorldWindow from './HelloWorldWindow';
import HelloIcon from 'components/componentIcons/HelloIcon';

export default registerApp({
  title: 'Hello World',
  view: (props) => {
    return (
      <HelloWorldWindow {...props} />
    );
  },
  iconView: () => <HelloIcon />
});
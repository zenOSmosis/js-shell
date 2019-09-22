import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import MongoExpressWindow from './MongoExpressWindow';
import MongoExpressIcon from 'components/componentIcons/MongoExpressIcon';

export default registerApp({
  title: 'Mongo Express',
  view: (props) => {
    return (
      <MongoExpressWindow {...props} />
    );
  },
  iconView: () => <MongoExpressIcon />
});
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import AppBlueprintBaseWindow from './AppBlueprintBaseWindow';
import config from 'config';

export default registerApp({
  title: 'Source Code',
  mainView: (props) => {
    return (
      <AppBlueprintBaseWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
});
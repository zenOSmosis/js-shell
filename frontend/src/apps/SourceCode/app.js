import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import AppBlueprintBaseWindow from './AppBlueprintBaseWindow';
import config from 'config';

export default registerApp({
  title: 'Visual Studio Code+-',
  mainWindow: <AppBlueprintBaseWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
});
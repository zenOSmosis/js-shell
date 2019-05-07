import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import AppBlueprintBaseWindow from './AppBlueprintBaseWindow';
import config from 'config';

export default new AppConfig({
  title: 'app.blueprint',
  mainWindow: <AppBlueprintBaseWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
});
import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import AppBlueprintBaseWindow from './AppBlueprintBaseWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'app.blueprint',
  mainWindow: <AppBlueprintBaseWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
});
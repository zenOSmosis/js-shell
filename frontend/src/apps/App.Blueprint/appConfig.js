import React from 'react';
import DesktopAppRunConfig from '../../components/Desktop/DesktopAppRunConfig';
import AppBlueprintBaseWindow from './AppBlueprintBaseWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'app.blueprint',
  mainWindow: <AppBlueprintBaseWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
});
// import React from 'react';
import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';
import { EVT_TICK } from 'process/ClientProcess';

export default class AppRuntimeMenubarHelpMenu extends AppRuntimeMenubarMenu {
  constructor(menubar) {
    super(menubar);

    const appRuntime = menubar.getAppRuntime();

    appRuntime.on(EVT_TICK, () => {
      // const desktopWindow = appRuntime.getWindowIfExists();

      this.setData({
        title: 'Help',
        items: [
          {
            title: `About ${appRuntime.getTitle()}`,
            onClick: (evt, appRuntime) => {
              alert('TODO: Display about information');
            }
          }
        ]
      });
    });
  }
}
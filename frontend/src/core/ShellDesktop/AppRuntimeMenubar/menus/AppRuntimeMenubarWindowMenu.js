// import React from 'react';
import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';
import { EVT_TICK } from 'process/ClientProcess';

export default class AppRuntimeMenubarWindowMenu extends AppRuntimeMenubarMenu {
  constructor(menubar) {
    super(menubar);

    const appRuntime = menubar.getAppRuntime();

    appRuntime.on(EVT_TICK, () => {
      const desktopWindow = appRuntime.getWindowIfExists();

      if (desktopWindow) {
        this.setData({
          title: 'Window',
          items: [
            {
              title: 'Maximize',
              onClick: () => {
                desktopWindow.maximize();
              }
            },
            {
              title: 'Minimize',
              onClick: () => {
                desktopWindow.minimize();
              }
            }
          ]
        });
      } else {
        this.setData({});
      }
    });
  }
}
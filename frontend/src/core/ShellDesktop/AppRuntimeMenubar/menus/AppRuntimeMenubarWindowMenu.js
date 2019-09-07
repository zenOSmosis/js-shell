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
          items: (() => {
            if (!desktopWindow.getIsMaximized() && !desktopWindow.getIsMinimized()) {
              const winMaxMinItems = [];

              if (desktopWindow.getIsUserResizable()) {
                winMaxMinItems.push({
                  title: 'Maximize',
                  onClick: () => {
                    desktopWindow.maximize();
                  }
                });
              }

              winMaxMinItems.push({
                title: 'Minimize',
                onClick: () => {
                  desktopWindow.minimize();
                }
              })

              return winMaxMinItems;
            } else {
              return [
                {
                  title: 'Restore',
                  onClick: () => {
                    desktopWindow.restore();
                  }
                }
              ]
            }
          })() 
        });
      } else {
        this.setData({});
      }
    });
  }
}
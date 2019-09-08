// import React from 'react';
import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';
import { EVT_TICK } from 'process/ClientProcess';
import { getShellDesktopProcess } from '../../ShellDesktopAppRuntime';

export default class AppRuntimeMenubarHelpMenu extends AppRuntimeMenubarMenu {
  constructor(menubar) {
    super(menubar);

    const appRuntime = menubar.getAppRuntime();

    appRuntime.on(EVT_TICK, () => {
      const shellDesktopProcess = getShellDesktopProcess();

      this.setData({
        title: 'Help',
        items: (() => {
          const items = [
            {
              title: `About ${appRuntime.getTitle()}`,
              onClick: (evt, appRuntime) => {
                alert('TODO: Display about information');
              }
            }
          ];

          if (!Object.is(appRuntime, shellDesktopProcess)) {
            // TODO: Add divider

            items.push({
              title: `About ${shellDesktopProcess.getTitle()}`,
              onClick: (evt, appRuntime) => {
                alert('TODO: Display about information');
              }
            });
          }

          return items;
        })()
      });
    });
  }
}
import React, {Component} from 'react';
import Center from 'components/Center';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';

/**
 * Render area for all desktop windows.
 */
class WindowDrawLayer extends Component {
  render() {
    let {openedWindows} = this.props;
    if (!openedWindows) {
      openedWindows = [];
    }

    return (
      <Center>
        {
          openedWindows.map((window, idx) => {           
            return (
              <div style={{position: 'absolute'}} key={idx}>
                {
                  window
                }
              </div>
            );
          })
        }
      </Center>
    )
  }
}

export default hocConnect(WindowDrawLayer, DesktopLinkedState, (updatedState) => {
  const {launchedAppConfigs} = updatedState;

  if (launchedAppConfigs) {
    let openedWindows = [];

    launchedAppConfigs.forEach((appConfig) => {
      const mainWindow = appConfig.getMainWindow();

      if (mainWindow) {
        openedWindows.push(mainWindow);
      }
    });

    return {
      openedWindows
    };
  }
});
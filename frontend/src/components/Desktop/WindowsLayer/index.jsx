import React, {Component} from 'react';
import Center from 'components/Center';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';

/**
 * Render area for all desktop windows.
 */
class WindowsLayer extends Component {
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

let openedWindows = [];

export default hocConnect(WindowsLayer, DesktopLinkedState, (updatedState) => {
  const {lastLaunchAppConfig} = updatedState;

  if (lastLaunchAppConfig) {
    // TODO: Move openedWindow handling to DesktopLinkedState

    const mainWindow = lastLaunchAppConfig.getMainWindow();

    if (mainWindow) {
      openedWindows.push(mainWindow);

      return {
        openedWindows
      };
    }
  }
});
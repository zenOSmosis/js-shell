// Note, currently the mere inclusion of this registers all of the default apps
import 'apps/defaultApps';
import React, { Component } from 'react';
import Center from 'components/Center';
import DesktopLinkedState from 'state/DesktopLinkedState';
import hocConnect from 'state/hocConnect';

console.warn('TODO: Fix imported apps location');

/**
 * Render area for all desktop windows.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
 class WindowDrawLayer extends Component {
  state = {
    launchedAppConfigs: []
  };

  linkedStateUpdateFilter(updatedState) {
    const {launchedAppConfigs} = updatedState;

    if (launchedAppConfigs) {
      return {
        launchedAppConfigs
      };
    }
  }

  render() {
    let {launchedAppConfigs} = this.props;
    if (!launchedAppConfigs) {
      launchedAppConfigs = [];
    }
  
    return (
      <Center>
        {
          launchedAppConfigs.map((appConfig, idx) => {           
            return (
              <div style={{position: 'absolute'}} key={idx}>
                {
                  appConfig.getMainWindow()
                }
              </div>
            );
          })
        }
      </Center>
    );
  }
}

// @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
export default hocConnect(WindowDrawLayer, DesktopLinkedState, (updatedState) => {
  const {launchedAppConfigs} = updatedState;

  if (launchedAppConfigs) {
    return {
      launchedAppConfigs
    };
  }
});
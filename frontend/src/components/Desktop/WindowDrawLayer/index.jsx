import React, {Component} from 'react';
import Center from 'components/Center';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';

import {hot} from 'react-hot-loader';

let _isInstantiated = false;

/**
 * Render area for all desktop windows.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
class WindowDrawLayer extends Component {
  constructor(props = {}) {
    if (_isInstantiated) {
      console.warn('WindowDrawLayer is already instantiated');
      return;
    }

    super(props);

    _isInstantiated = true;
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
const ConnectedComponent = hocConnect(WindowDrawLayer, DesktopLinkedState, (updatedState) => {
  const {launchedAppConfigs} = updatedState;

  if (launchedAppConfigs) {
    return {
      launchedAppConfigs
    };
  }
});

export default hot(module)(ConnectedComponent);
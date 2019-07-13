import React, { Component } from 'react';
import DesktopLinkedState from 'state/DesktopLinkedState';
import hocConnect from 'state/hocConnect';

// console.warn('TODO: Fix imported apps location', apps);

/**
 * Render area for all desktop windows.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
 class WindowDrawLayer extends Component {
  _onInteract = (evt) => {
    const {onDirectInteract} = this.props;

    if (typeof onDirectInteract === 'function') {
      if (evt.target === this._el ) {
        onDirectInteract(evt);
      }
    }
  }

  render() {
    // TODO: Base this off of open windows, instead of apps
    let {launchedApps} = this.props;
    if (!launchedApps) {
      launchedApps = [];
    }
  
    return (
      <div
        ref={ c => this._el = c }
        onMouseDown={ this._onInteract }
        onTouchStart={ this._onInteract }
        style={{width: '100%', height: '100%'}}
      >
        {
          launchedApps.map((app) => {
            const uuid = app.getUUID();
            
            return (
              // Note: For the key, using UUID instead of idx is very important
              // because they can be re-rendered at different indexes when they
              // update.  HMR also depends on this.
              <div style={{position: 'absolute'}} key={uuid}>
                {
                  app.getMainWindow()
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

// @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
export default hocConnect(WindowDrawLayer, DesktopLinkedState, (updatedState) => {
  const {launchedApps} = updatedState;

  if (launchedApps) {
    return {
      launchedApps
    };
  }
});
import React, { Component } from 'react';
import DesktopLinkedState from 'state/DesktopLinkedState';
import hocConnect from 'state/hocConnect';
import StackingContext from 'components/StackingContext';
import equals from 'equals';

/**
 * Render area for all desktop windows.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 * 
 * @extends Component
 */
class AppRuntimeRenderProvider extends Component {
  render() {
    let { launchedAppRuntimes } = this.props;
    launchedAppRuntimes = launchedAppRuntimes || [];

    return (
        <StackingContext>
          {
            // TODO: Consider rendering the component directly w/ ReactDOM to
            // the container
            launchedAppRuntimes.map((proc) => {
              const AppRuntimeRenderComponent = proc.getReactComponent();
              if (!AppRuntimeRenderComponent) {
                return false;
              }

              const pid = proc.getPID();

              return (
                <AppRuntimeRenderComponent
                  key={pid}
                />
              )
            })
          }
        </StackingContext>
    );
  }
}

const ConnectedAppRuntimeRenderProvider = (() => {
  // A cache of AppRuntime process IDs
  let prevPIDs = [];

  return hocConnect(AppRuntimeRenderProvider, DesktopLinkedState, (updatedState) => {
    const { launchedAppRuntimes } = updatedState;

    if (typeof launchedAppRuntimes !== 'undefined') {
      const appRuntimePIDs = launchedAppRuntimes.map(proc => {
        return proc.getPID();
      });

      // Determine if the previous AppRuntime IDs are the same as the current
      // in order to prevent unnecessary render cycles
      // @see https://www.npmjs.com/package/equals
      if (!equals(prevPIDs, appRuntimePIDs)) {
        prevPIDs = appRuntimePIDs;

        return {
          launchedAppRuntimes
        };
      }
    }
  });
})();

export default ConnectedAppRuntimeRenderProvider;
export {
  AppRuntimeRenderProvider
};
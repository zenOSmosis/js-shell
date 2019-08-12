import React, { Component } from 'react';
import ClientProcessLinkedState from 'state/ClientProcessLinkedState';
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
class GUIProcessRenderProvider extends Component {
  render() {
    let { guiProcesses } = this.props;
    guiProcesses = guiProcesses || [];

    return (
        <StackingContext>
          {
            // TODO: Consider rendering the component directly w/ ReactDOM to
            // the container
            guiProcesses.map((proc) => {
              const GUIProcessView = proc.getReactComponent();
              if (!GUIProcessView) {
                console.warn('No GUIProcessView on:', proc);
                return false;
              } /* else {
                console.debug('GUIProcessView', {
                  GUIProcessView,
                  proc
                });
              }
              */

              const pid = proc.getPID();

              return (
                <GUIProcessView
                  key={pid}
                />
              )
            })
          }
        </StackingContext>
    );
  }
}

const ConnectedGUIProcessRenderProvider = (() => {
  // A cache of AppRuntime process IDs
  let prevPIDs = [];

  return hocConnect(GUIProcessRenderProvider, ClientProcessLinkedState, (updatedState) => {
    const { guiProcesses } = updatedState;

    if (typeof guiProcesses !== 'undefined') {
      const appRuntimePIDs = guiProcesses.map(proc => {
        return proc.getPID();
      });

      // TODO: Filter out PID of Shell Desktop

      // Determine if the previous AppRuntime IDs are the same as the current
      // in order to prevent unnecessary render cycles
      // @see https://www.npmjs.com/package/equals
      if (!equals(prevPIDs, appRuntimePIDs)) {
        prevPIDs = appRuntimePIDs;

        return {
          guiProcesses
        };
      }
    }
  });
})();

export default ConnectedGUIProcessRenderProvider;
export {
  GUIProcessRenderProvider
};
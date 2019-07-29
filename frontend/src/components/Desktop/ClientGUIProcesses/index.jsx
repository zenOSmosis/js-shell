// TODO: Re-purpose for AppRuntime usage

import React, { Component } from 'react';
import ProcessLinkedState from 'state/ProcessLinkedState';
// import ClientGUIProcess from 'process/ClientGUIProcess';
import hocConnect from 'state/hocConnect';
import Cover from 'components/Cover';
import ShellDesktop from 'core/ShellDesktop';
import equal from 'equals';

/**
 * Render area for all desktop windows.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
class ClientGUIProcesses extends Component {
  render() {
    let { guiProcesses } = this.props;
    guiProcesses = guiProcesses || [];

    // Filter out core desktop processes which are already rendered
    guiProcesses = guiProcesses.filter(proc => {
      return (!(proc instanceof ShellDesktop));
    });

    return (
      <Cover>
        {
          // TODO: Append to container from a different lifecycle method if
          // this causes unnecessary rendering cycles
          guiProcesses.map((proc) => {
            const ProcessRenderComponent = proc.getReactComponent();
            if (!ProcessRenderComponent) {
              return false;
            }

            const pid = proc.getPID();

            return (
              <ProcessRenderComponent
                key={pid}
              />
            )
          })
        }
      </Cover>
    );
  }
}

export default (() => {
  let prevPIDs = [];

  return hocConnect(ClientGUIProcesses, ProcessLinkedState, (updatedState) => {
    const { guiProcesses } = updatedState;

    if (typeof guiProcesses !== 'undefined') {
      const guiProcessIDs = guiProcesses.map(guiProc => {
        return guiProc.getPID();
      });

      // TODO: Remove this
      console.warn({
        prevPIDs,
        guiProcessIDs
      });
    
      // @see https://www.npmjs.com/package/equals
      if (!equal(prevPIDs, guiProcessIDs)) {
        prevPIDs = guiProcessIDs;

        return {
          guiProcesses
        };
      }
    }
  });
})();
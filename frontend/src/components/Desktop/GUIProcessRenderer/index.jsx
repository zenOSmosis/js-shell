import React, { Component } from 'react';
import { getShellDesktopProcess } from 'core/ShellDesktop';
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
class GUIProcessRenderer extends Component {
  render() {
    let { childGUIProcesses, childGUIProcessPIDs } = this.props;
    return (
        <StackingContext>
          {
            childGUIProcesses.map((proc, idx) => {
              const GUIProcessView = proc.getReactComponent();
              if (!GUIProcessView) {
                console.warn('No GUIProcessView on:', proc);
                return false;
              }

              return (
                <GUIProcessView
                  key={childGUIProcessPIDs[idx]}
                />
              )
            })
          }
        </StackingContext>
    );
  }
}

const ConnectedGUIProcessRenderer = (() => {
  // A cache of previously rendered GUI process IDs
  let _prevChildGUIProcessPIDs = [];

  let _shellDesktopPID = null;

  let _renderIdx = -1;

  return hocConnect(GUIProcessRenderer, ClientProcessLinkedState, (updatedState) => {
    ++_renderIdx;
    
    if (!_shellDesktopPID) {
      const shellGUIProcess = getShellDesktopProcess();
      _shellDesktopPID = shellGUIProcess.getPID();
    }

    const { guiProcesses } = updatedState;

    if (typeof guiProcesses !== 'undefined') {
      // A collection of PIDs which does not include the main Shell Desktop GUI
      // process
      const childGUIProcessPIDs = [];

      // A filtered list of GUI processes which does not include the main Shell
      // Desktop GUI process
      const childGUIProcesses = guiProcesses.filter(guiProcess => {
        const _pid = guiProcess.getPID();
        
        if (_pid !== _shellDesktopPID) {
          childGUIProcessPIDs.push(_pid);

          return true;
        } else {
          // This guiProcess is the Shell Desktop; filter it from the list

          return false;
        }
      });

      // Determine if the previous AppRuntime IDs are the same as the current
      // in order to prevent unnecessary render cycles
      // @see https://www.npmjs.com/package/equals
      if (_renderIdx === 0 || !equals(_prevChildGUIProcessPIDs, childGUIProcessPIDs)) {
        _prevChildGUIProcessPIDs = childGUIProcessPIDs;

        return {
          childGUIProcesses,
          childGUIProcessPIDs
        };
      }
    }
  });
})();

export default ConnectedGUIProcessRenderer;
export {
  GUIProcessRenderer
};
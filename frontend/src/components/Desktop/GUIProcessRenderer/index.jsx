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
    let { childGUIProcesses, childGUIProcessPids } = this.props;
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
                  key={childGUIProcessPids[idx]}
                />
              )
            })
          }
        </StackingContext>
    );
  }
}

const ConnectedGUIProcessRenderer = (() => {
  // A cache of previously rendered GUI process Ids
  let _prevChildGUIProcessPids = [];

  let _shellDesktopPid = null;

  let _renderIdx = -1;

  return hocConnect(GUIProcessRenderer, ClientProcessLinkedState, (updatedState) => {
    ++_renderIdx;
    
    if (!_shellDesktopPid) {
      const shellGUIProcess = getShellDesktopProcess();
      _shellDesktopPid = shellGUIProcess.getPid();
    }

    const { guiProcesses } = updatedState;

    if (typeof guiProcesses !== 'undefined') {
      // A collection of Pids which does not include the main Shell Desktop GUI
      // process
      const childGUIProcessPids = [];

      // A filtered list of GUI processes which does not include the main Shell
      // Desktop GUI process
      const childGUIProcesses = guiProcesses.filter(guiProcess => {
        const _pid = guiProcess.getPid();
        
        if (_pid !== _shellDesktopPid) {
          childGUIProcessPids.push(_pid);

          return true;
        } else {
          // This guiProcess is the Shell Desktop; filter it from the list

          return false;
        }
      });

      // Determine if the previous AppRuntime Ids are the same as the current
      // in order to prevent unnecessary render cycles
      // @see https://www.npmjs.com/package/equals
      if (_renderIdx === 0 || !equals(_prevChildGUIProcessPids, childGUIProcessPids)) {
        _prevChildGUIProcessPids = childGUIProcessPids;

        return {
          childGUIProcesses,
          childGUIProcessPids
        };
      }
    }
  });
})();

export default ConnectedGUIProcessRenderer;
export {
  GUIProcessRenderer
};
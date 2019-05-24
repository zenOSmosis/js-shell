// Note, currently the mere inclusion of this registers all of the default apps
import /*apps from*/ 'apps/defaultApps';
import React, { Component } from 'react';
import ProcessLinkedState from 'state/ProcessLinkedState';
// import ClientGUIProcess from 'process/ClientGUIProcess';
import hocConnect from 'state/hocConnect';
import Cover from 'components/Cover';

// import Window from 'components/Desktop/Window';


/**
 * Render area for all desktop windows.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
class ClientGUIProcesses extends Component {
  _onInteract = (evt) => {
    const { onDirectInteract } = this.props;

    if (typeof onDirectInteract === 'function') {
      if (evt.target === this._el) {
        onDirectInteract(evt);
      }
    }
  }

  render() {
    let { guiProcesses } = this.props;
    guiProcesses = guiProcesses || [];

    console.debug('rendering', this.props);

    return (
      <Cover>
        {
          guiProcesses.map((proc) => {
            const ProcessRenderComponent = proc.getReactComponent();
            if (!ProcessRenderComponent) {
              return false;
            }

            const pid = proc.getPID();

            return (
              <ProcessRenderComponent
                key={pid}
                // style={{position: 'absolute'}}
              />
            )
          })
        }
      </Cover>
    );
  }
}



// @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
export default hocConnect(ClientGUIProcesses, ProcessLinkedState, (updatedState, fullState) => {
  const { processes, updatedProcess } = fullState;

  console.debug('updated process', updatedProcess);

  const guiProcesses = processes.filter((proc) => {
    return (typeof proc.getReactComponent === 'function');
  });

  return {
    guiProcesses,
    updatedProcess
  };
});
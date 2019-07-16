import React from 'react';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import hocConnect from 'state/hocConnect';

const ClientPressure = (props = {}) => {
  return (
    <span>{props.percent} %</span>
  );
}

const ConnectedClientPressure = hocConnect(ClientPressure, CPUTimeLinkedState, (updatedState) => {
  const { cpusLevels } = updatedState;

  if (cpusLevels && cpusLevels[0]) {
    return {
      percent: cpusLevels[0]
    }
  }
});

const SystemDetailFooter = (props = {}) => {
  const { children } = props;

  return (
    <div>
      Main Thread CPU: <ConnectedClientPressure />

      {
        children
      }
    </div>
  );
};

export default SystemDetailFooter;
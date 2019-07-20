import React from 'react';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import hocConnect from 'state/hocConnect';

const SystemDetailFooter = (props = {}) => {
  let { cpuThreads, lenCPUThreads, totalCPUUsage, children } = props;

  cpuThreads = cpuThreads || [];

  return (
    <div>
      <div style={{display: 'inline-block'}}>
        Total CPU Usage: { totalCPUUsage }% / { `${lenCPUThreads} Thread${lenCPUThreads !== 1 ? 's' : ''}` }
      </div>
      {
        /*
        cpuThreads.map((cpuThread, idx) => {
          return (
            <div key={idx} style={{display: 'inline-block'}}>
              {
                idx > 0 &&
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              }
              {idx}: { cpuThread.usagePercent }%
            </div>
          )
        })
        */
      }

      <div style={{display: 'inline-block'}}>
        {
          children
        }
      </div>
    </div>
  );
};

const ConnectedSystemDetailFooter = hocConnect(SystemDetailFooter, CPUTimeLinkedState, (updatedState) => {
  const { cpuThreads } = updatedState;

  if (cpuThreads) {
    let totalCPUUsage = 0;
    const lenCPUThreads = cpuThreads.length;
    for (let i = 0; i < lenCPUThreads; ++i) {
      totalCPUUsage += cpuThreads[i].usagePercent;
    }

    return {
      cpuThreads,
      lenCPUThreads,
      totalCPUUsage
    }
  }
});

export default ConnectedSystemDetailFooter;
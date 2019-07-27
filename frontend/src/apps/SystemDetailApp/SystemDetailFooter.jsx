import React from 'react';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import { MasterLinkedStateListener } from 'state/LinkedState';
import hocConnect from 'state/hocConnect';
import { Divider } from 'antd';

const SystemDetailFooter = (props = {}) => {
  let { /* cpuThreads, */ lenLinkedStates, lenCPUThreads, totalCPUUsage, children } = props;

  // cpuThreads = cpuThreads || [];

  return (
    <div>
      <div style={{display: 'inline-block'}}>
        Total CPU Usage: { totalCPUUsage }% 
      </div>

      <Divider type="vertical" />

      <div style={{display: 'inline-block'}}>
        { `${lenCPUThreads} Thread${lenCPUThreads !== 1 ? 's' : ''}` }
      </div>

      <Divider type="vertical" />

      <div style={{display: 'inline-block'}}>
        { `${ lenLinkedStates } Linked State${lenLinkedStates !== 1 ? 's' : ''}` }
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

const CPUTimeSystemDetailFooter = hocConnect(SystemDetailFooter, CPUTimeLinkedState, (updatedState) => {
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

const MasterLinkedStateSystemDetailFooter = hocConnect(CPUTimeSystemDetailFooter, MasterLinkedStateListener, (updatedState, linkedStateInstance) => {
  return {
    lenLinkedStates: linkedStateInstance.getLinkedStateCount()
  };
});

export default MasterLinkedStateSystemDetailFooter;
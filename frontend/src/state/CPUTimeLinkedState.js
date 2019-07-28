import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const CPU_TIME_LINKED_STATE_SCOPE_NAME = 'CPUTimeLinkedState';

/**
 * Maintains state regarding CPU usage.
 * 
 * @extends LinkedState
 */
class CPUTimeLinkedState extends LinkedState {
  constructor() {
    super(CPU_TIME_LINKED_STATE_SCOPE_NAME, {
      cpuThreads: []
    });
  }

  getCPUThreadDataWithRootProcess(rootProcess) {
    const { cpuThreads } = this.getState();
    const lenCPUThreads = cpuThreads.length;

    for (let i = 0; i < lenCPUThreads; ++i) {
      if (Object.is(rootProcess, cpuThreads[i].rootProcess)) {
        return {
          rootIdx: i,
          cpuThreads
        }
      }
    }
  }

  setCPUThreadUsagePercent(rootProcess, usagePercent) {
    const cpuThreadData = this.getCPUThreadDataWithRootProcess(rootProcess);
    
    if (cpuThreadData) {
      let { rootIdx, cpuThreads } = cpuThreadData;

      cpuThreads[rootIdx] = Object.assign(cpuThreads[rootIdx], {
        usagePercent
      });

      this.setState({
        cpuThreads
      });
    }
  }

  addThreadRootProcess(rootProcess) {
    let { cpuThreads } = this.getState();

    cpuThreads.push({
      rootProcess,
      usagePercent: 0
    });
  }

  removeThreadRootProcess(rootProcess) {
    const cpuThreadData = this.getCPUThreadDataWithRootProcess(rootProcess);

    if (cpuThreadData) {
      let { rootIdx, cpuThreads } = cpuThreadData;

      const aLenCPUThreads = cpuThreads.length;

      // Remove the root thread
      cpuThreads.splice(rootIdx);

      const bLenCPUThreads = cpuThreads.length;

      if (bLenCPUThreads !== aLenCPUThreads - 1) {
        throw new Error('Unable to remove root thread process');
      }

      this.setState({
        cpuThreads
      });
    }
  }
}

export default CPUTimeLinkedState;
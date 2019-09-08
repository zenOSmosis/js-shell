import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const CPU_TIME_LINKED_STATE_SCOPE_NAME = 'CPUTimeLinkedState';

export const STATE_CPU_THREADS = 'cpuThreads';

/**
 * Maintains state regarding CPU usage.
 * 
 * @extends LinkedState
 */
class CPUTimeLinkedState extends LinkedState {
  constructor() {
    super(CPU_TIME_LINKED_STATE_SCOPE_NAME, {
      [STATE_CPU_THREADS]: []
    });
  }

  getCPUThreadDataWithRootProcess(rootProcess) {
    const { [STATE_CPU_THREADS]: cpuThreads } = this.getState();
    const lenCPUThreads = cpuThreads.length;

    for (let i = 0; i < lenCPUThreads; ++i) {
      if (Object.is(rootProcess, cpuThreads[i].rootProcess)) {
        return {
          rootIdx: i,
          [STATE_CPU_THREADS]: cpuThreads
        }
      }
    }
  }

  setCPUThreadUsagePercent(rootProcess, usagePercent) {
    const cpuThreadData = this.getCPUThreadDataWithRootProcess(rootProcess);
    
    if (cpuThreadData) {
      let { rootIdx, [STATE_CPU_THREADS]: cpuThreads } = cpuThreadData;

      cpuThreads[rootIdx] = Object.assign(cpuThreads[rootIdx], {
        usagePercent
      });

      this.setState({
        [STATE_CPU_THREADS]: cpuThreads
      });
    }
  }

  addThreadRootProcess(rootProcess) {
    let { [STATE_CPU_THREADS]: cpuThreads } = this.getState();

    cpuThreads.push({
      rootProcess,
      usagePercent: 0
    });

    this.setState({
      [STATE_CPU_THREADS]: cpuThreads
    });
  }

  removeThreadRootProcess(rootProcess) {
    const cpuThreadData = this.getCPUThreadDataWithRootProcess(rootProcess);

    if (cpuThreadData) {
      let { rootIdx, [STATE_CPU_THREADS]: cpuThreads } = cpuThreadData;

      const aLenCPUThreads = cpuThreads.length;

      // Remove the root thread
      cpuThreads.splice(rootIdx);

      const bLenCPUThreads = cpuThreads.length;

      if (bLenCPUThreads !== aLenCPUThreads - 1) {
        throw new Error('Unable to remove root thread process');
      }

      this.setState({
        [STATE_CPU_THREADS]: cpuThreads
      });
    }
  }
}

export default CPUTimeLinkedState;
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import ClientProcess, { EVT_TICK, EVT_BEFORE_EXIT } from 'process/ClientProcess';

export {
  EVT_LINKED_STATE_UPDATE
};

const LINKED_SCOPE_NAME = 'zd-client-processes';

/**
 * A registry of all registered running processes in the Desktop.
 */
export default class ProcessLinkedState extends LinkedState {
  constructor() {
    super(LINKED_SCOPE_NAME, {
      processes: [],

      guiProcesses: [],
      focusedGUIProcess: null,

      // The last process which was updated
      updatedProcess: null
    });
  }

  addProcess(process) {
    if (!(process instanceof ClientProcess)) {
      throw new Error('process must be a ClientProcess instance');
    }

    // console.debug('Adding process', process);

    const { processes } = this.getState();

    processes.push(process);
    
    const guiProcesses = this.getGUIProcesses(processes);

    const _handleProcessUpdate = () => {
      this.setState({
        updatedProcess: process
      });
    };

    process.on(EVT_TICK, _handleProcessUpdate);

    // Handle shutdown
    process.once(EVT_BEFORE_EXIT, () => {
      process.off(EVT_TICK, _handleProcessUpdate);
    });

    // TODO: Detect guiProcesses and update here
    

    this.setState({
      processes,
      guiProcesses
    });
  }

  removeProcess(process) {
    if (!(process instanceof ClientProcess)) {
      throw new Error('process must be a ClientProcess instance');
    }

    // console.debug('Removing process', process);

    let processes = this.getProcesses();

    // Filter out the process
    processes = processes.filter(testProcess => {
      return !Object.is(process, testProcess);
    });

    const guiProcesses = this.getGUIProcesses(processes);

    this.setState({
      processes,
      guiProcesses
    });
  }

  getProcesses() {
    const { processes } = this.getState();

    return processes;
  }

  /**
   * Retrieves GUI processes.
   * 
   * If "processes" is not specified as an argument, it will use the class state. 
   * 
   * @param {ClientProcess[]} processes [optional] Overridden (over class
   * property) processes.
   */
  getGUIProcesses(processes = null) {
    if (!processes) {
      const state = this.getState();

      processes = state.processes;
    }

    const guiProcesses = processes.filter((proc) => {
      return (typeof proc.getReactComponent === 'function');
    });

    return guiProcesses;
  }
}
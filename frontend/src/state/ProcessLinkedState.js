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

    process.on(EVT_TICK, this._handleProcessUpdate);

    // Handle shutdown
    process.once(EVT_BEFORE_EXIT, () => {
      process.off(EVT_TICK, this._handleProcessUpdate);
    });

    this.setState({
      processes,
      guiProcesses
    });
  }

  /**
   * This is called internally on each process tick.
   * 
   * @param {ClientProcess} updatedProcess The process which was updated.
   */
  _handleProcessUpdate = (updatedProcess) => {
    this.setState({
      updatedProcess
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

  /**
   * @return {ClientProcess[]}
   */
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
   * @return {ClientGUIProcess[]}
   */
  getGUIProcesses(processes = null) {
    if (!processes) {
      processes = this.getProcesses();
    }

    const guiProcesses = processes.filter((proc) => {
      // TODO: Does checking for instance of ClientGUIProcess work, instead?

      return proc.getIsGUIProcess();
    });

    return guiProcesses;
  }
}
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import ClientProcess, { EVT_TICK, EVT_BEFORE_EXIT } from 'process/ClientProcess';

export {
  EVT_LINKED_STATE_UPDATE
};

const LINKED_SCOPE_NAME = 'zd-client-processes';

/**
 * A registry of all registered running processes in the Desktop.
 * 
 * @extends LinkedState
 */
class ProcessLinkedState extends LinkedState {
  constructor() {
    super(LINKED_SCOPE_NAME, {
      processes: [],

      // The last process which was updated
      // TODO: Rename to lastUpdatedProcess
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

    process.on(EVT_TICK, this._handleProcessUpdate);

    // Handle shutdown
    process.once(EVT_BEFORE_EXIT, () => {
      process.off(EVT_TICK, this._handleProcessUpdate);
    });

    this.setState({
      processes
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

  /**
   * TODO: Document
   * 
   * @param {ClientProcess} process 
   */
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

    this.setState({
      processes
    });
  }

  /**
   * @return {ClientProcess[]}
   */
  getProcesses() {
    const { processes } = this.getState();

    return processes;
  }
}

export default ProcessLinkedState;
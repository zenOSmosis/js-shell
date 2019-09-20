import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import ClientProcess, { EVT_TICK, EVT_BEFORE_EXIT } from 'process/ClientProcess';

export {
  EVT_LINKED_STATE_UPDATE
};

const LINKED_SCOPE_NAME = 'zd-client-processes';

export const STATE_PROCESSES = 'processes';
export const STATE_GUI_PROCESSES = 'guiProcesses';
export const STATE_LAST_UPDATED_PROCESS = 'lastUpdatedProcess';

/**
 * A registry of all registered running processes in the Desktop.
 * 
 * @extends LinkedState
 */
class ClientProcessLinkedState extends LinkedState {
  constructor() {
    super(LINKED_SCOPE_NAME, {
      [STATE_PROCESSES]: [], // All processes

      [STATE_GUI_PROCESSES]: [], // GUI process subset of all processes

      // The last process which was updated
      
      [STATE_LAST_UPDATED_PROCESS]: null
    });
  }

  addProcess(process) {
    if (!(process instanceof ClientProcess)) {
      throw new Error('process must be a ClientProcess instance');
    }

    // console.debug('Adding process', process);

    const {
      [STATE_PROCESSES]: processes,
      [STATE_GUI_PROCESSES]: guiProcesses
    } = this.getState();

    processes.push(process);

    if (process.getIsGUIProcess()) {
      guiProcesses.push(process);
    };

    process.on(EVT_TICK, this._handleProcessUpdate);

    // Handle shutdown
    process.once(EVT_BEFORE_EXIT, () => {
      process.off(EVT_TICK, this._handleProcessUpdate);
    });

    this.setState({
      [STATE_PROCESSES]: processes,
      [STATE_GUI_PROCESSES]: guiProcesses
    });
  }

  /**
   * This is called internally on each process tick.
   * 
   * @param {ClientProcess} lastUpdatedProcess The process which was updated.
   */
  _handleProcessUpdate = (lastUpdatedProcess) => {
    this.setState({
      [STATE_LAST_UPDATED_PROCESS]: lastUpdatedProcess
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

    let {
      [STATE_PROCESSES]: processes,
      [STATE_GUI_PROCESSES]: guiProcesses
    } = this.getState();

    // Filter out the process
    processes = processes.filter(testProcess => {
      return !Object.is(process, testProcess);
    });

    if (process.getIsGUIProcess()) {
      guiProcesses = guiProcesses.filter(testProcess => {
        return !Object.is(guiProcesses, testProcess);
      });
    }

    this.setState({
      [STATE_PROCESSES]: processes,
      [STATE_GUI_PROCESSES]: guiProcesses
    });
  }

  /**
   * @return {ClientProcess[]}
   */
  getProcesses() {
    const { [STATE_PROCESSES]: processes } = this.getState();

    return processes;
  }
}

export default ClientProcessLinkedState;
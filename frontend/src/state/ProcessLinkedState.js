import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import ClientProcess, { EVT_PROCESS_UPDATE, EVT_PROCESS_BEFORE_EXIT } from 'process/ClientProcess';

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

    console.debug('Adding process', process);

    const { processes } = this.getState();

    processes.push(process);

    const _handleProcessUpdate = () => {
      this.setState({
        updatedProcess: process
      });
    };

    process.on(EVT_PROCESS_UPDATE, _handleProcessUpdate);
    // Auto-cleanup
    process.once(EVT_PROCESS_BEFORE_EXIT, () => {
      process.off(EVT_PROCESS_UPDATE, _handleProcessUpdate);
    });

    // TODO: Detect guiProcesses and update here

    this.setState({
      processes
    });
  }

  removeProcess(process) {
    if (!(process instanceof ClientProcess)) {
      throw new Error('process must be a ClientProcess instance');
    }

    console.debug('Removing process', process);

    let processes = this.getProcesses();

    processes = processes.filter(testProcess => {
      return !Object.is(process, testProcess);
    });

    this._setProcesses(processes, this);
  }

  getProcesses() {
    const { processes } = this.getState();

    return processes;
  }

  _setProcesses(processes, _setter) {
    if (!Object.is(this, _setter)) {
      throw new Error('_setProcesses(...) can only be utilized internally');
    }

    this.setState({
      processes
    });
  }
}
// TODO: Refactor out elapsed string, etc.
// TODO: Rename to ThreadCPUTimerProcess
// TODO: Prevent CPU reading from being less than 0% or greater than 100%

// TODO: If CPU reading is greater than 100%, internally, restart the clock
// (it seems to have issues when the browser window is blurred, then started
// again)

import ClientProcess from 'process/ClientProcess';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
// import ProcessHeartbeatLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/ProcessHeartbeatLinkedState';


// This should be treated as a singleton
export default class CoreCPUTimer extends ClientProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => { });

    // TODO: Rename to threadCPUTimeLinkedState
    this._cpuTimeLinkedState = new CPUTimeLinkedState();

    // TODO: Use this._isExited (or equiv.) instead
    this._isStopped = false;

    (() => {
      // TODO: Use exported constant here
      const intervalTime = 100;

      let start = Date.now(),
        time = 0,
        x = -1,
        elapsed = '0.0'; // TODO: Remove string

      const instance = () => {
        if (this._isStopped) {
          return;
        }

        if (x >= 10) {
          x = 0;
        } else {
          x++;
        }

        time += intervalTime;

        elapsed = Math.floor(time / intervalTime) / 10;
        if (Math.round(elapsed) === elapsed) { elapsed += '.0'; }

        let diff = (Date.now() - start) - time;
        // TODO: Use proce.setTimeout() once available
        setTimeout(instance, (intervalTime - diff));
        
        if (x === 10) {
          let { cpusLevels } = this._cpuTimeLinkedState.getState();

          cpusLevels[0] = diff;

          this._cpuTimeLinkedState.setState({
            cpusLevels
          });
        }
      };

      // TODO: Use proc.setTimeout() once available
      setTimeout(instance, intervalTime);
    })();
  }

  async kill(killSignal = 0) {
    try {
      this._cpuTimeLinkedState.destroy();
      this._isStopped = true;
  
      await super.kill();
    } catch (exc) {
      throw exc;
    }
  }
}
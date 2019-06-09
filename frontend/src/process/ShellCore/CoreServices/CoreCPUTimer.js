// TODO: Refactor out elapsed string, etc.

import ClientProcess from 'process/ClientProcess';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
// import ProcessHeartbeatLinkedState, { EVT_LINKED_STATE_UPDATE } from 'state/ProcessHeartbeatLinkedState';

// TODO: Implement heartbeat monitoring from other processes

// This should be treated as a singleton
export default class CoreCPUTimer extends ClientProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => { });

    this._cpuTimeLinkedState = new CPUTimeLinkedState();
    this._isStopped = false;

    (() => {
      const intervalTime = 100;

      let start = Date.now(),
        time = 0,
        x = -1,
        elapsed = '0.0';

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
        window.setTimeout(instance, (intervalTime - diff));
        
        if (x === 10) {
          let { cpusLevels } = this._cpuTimeLinkedState.getState();

          cpusLevels[0] = diff;

          this._cpuTimeLinkedState.setState({
            cpusLevels
          });
        }
      };

      window.setTimeout(instance, intervalTime);
    })();
  }

  kill() {
    this._cpuTimeLinkedState.destroy();
    this._isStopped = true;

    super.kill();
  }
}
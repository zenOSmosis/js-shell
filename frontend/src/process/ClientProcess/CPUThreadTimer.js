// TODO: Implement ability to pause (if no watchers are running)

import EventEmitter from 'events';
import getNow from 'utils/time/getNow';

export const EVT_STOP = 'stop';
export const EVT_CYCLE = 'cycle'; // TODO: Rename to EVT_UPDATE

let _threadHasCPUTimer = false;

/**
 * @extends EventEmitter
 * 
 * Heuristical reasoning of CPU thread usage. Not an exact science as we don't have direct access into CPU core.
 */
class CPUThreadTimer extends EventEmitter {
  constructor() {
    if (_threadHasCPUTimer) {
      console.error(`Thread already has CPU timer. A duplicate instance is about
      to be created but this should typically only happen when debugging.`);
    } else {
      _threadHasCPUTimer = true;
    }

    super();

    this._isRunning = false;
    this._currentTimeout = null;
    this._cpuThreadUsagePercent = 0;
    this._cycleTime = 500; // milliseconds

    // Automatically start the timer
    this._start();
  }
  
  _start() {
    if (this._isRunning) {
      console.warn(`CPUThreadTimer is already running. Ignoring repeated start
      attempt.`);
      return;
    }

    this._isRunning = true;

    let i = -1;
    let maxUsagePercent = 0; // Max percent in the cycle
    let cyclesPerSecond = Math.ceil(1000 / this._cycleTime);

    // Automatically re-invokes itself every second until the timer is stopped
    const cycle = (prevCycleStartTime = undefined) => {
      if (!this._isRunning) {
        return;
      }

      ++i;

      const currentCycleStartTime = getNow();

      if (prevCycleStartTime) {
        let elapsed = currentCycleStartTime - prevCycleStartTime;

        // Prevent possible division by 0
        if (elapsed === 0) {
          elapsed = 1;
        }

        // The amount of free usage in this CPU thread
        let availableCPUPercent = (this._cycleTime / elapsed) * 100;

        // Round up to next natural number
        availableCPUPercent = Math.ceil(availableCPUPercent);

        // Keep freePercent within 0 - 100 range
        if (availableCPUPercent < 0) {
          availableCPUPercent = 0;
        } else if (availableCPUPercent > 100) {
          availableCPUPercent = 100;
        }

        // Inverse of availableCPUPercent
        const cpuUsagePercent = (100 - availableCPUPercent);
        if (cpuUsagePercent > maxUsagePercent) {
          maxUsagePercent = cpuUsagePercent;
        }

        if (i >= cyclesPerSecond) {
          this._cpuThreadUsagePercent = maxUsagePercent;

          // Emit CPU usage percent to EVT_CYCLE listeners
          this.emit(EVT_CYCLE, this._cpuThreadUsagePercent);

          i = -1;
          maxUsagePercent = 0;
        }
      }

      prevCycleStartTime = currentCycleStartTime;

      // Note: Whatever happens in the JS stack frames between now and when the
      // timeout is run is what's being measured

      this._currentTimeout = setTimeout(() => {
        if (this._isRunning) {
          cycle(prevCycleStartTime);
        }
      }, this._cycleTime);
    };

    // Invoke cycling
    cycle();
  }

  getCPUUsagePercent() {
    return this._cpuThreadUsagePercent;
  }

  stop() {
    clearTimeout(this._currentTimeout);

    this._isRunning = false;

    this.emit(EVT_STOP);
  }
}

export default CPUThreadTimer;
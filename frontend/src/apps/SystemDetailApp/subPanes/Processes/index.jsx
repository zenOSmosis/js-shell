import React, { Component } from 'react';
import ProcessLinkedState from 'state/ProcessLinkedState';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import hocConnect from 'state/hocConnect';
import moment from 'moment';

const CPUUsagePercent = (props = {}) => {
  const { usagePercent } = props;

  return (
    <span>{ usagePercent } %</span>
  );
}

const MainCPUUsagePercent = hocConnect(CPUUsagePercent, CPUTimeLinkedState, (updatedState) => {
  const { cpuThreads } = updatedState;

  if (cpuThreads && cpuThreads[0]) {

    const { usagePercent } = cpuThreads[0];

    return {
      usagePercent
    }
  }
});

class Processes extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      hiddenProcessIds: [],
      pollRefreshIdx: -1
    };

    this._refreshInterval = null;
  }

  componentDidMount() {
    let { pollRefreshIdx } = this.state;

    this._refreshInterval = setInterval(() => {
      pollRefreshIdx++;

      this.setState({
        pollRefreshIdx
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._refreshInterval);
  }

  hideCurrentProcesses() {
    const { processes } = this.props;

    const hiddenProcessIds = processes.map((process) => {
      return process.getPID();
    });

    this.setState({
      hiddenProcessIds
    });
  }

  showAllProcesses() {
    this.setState({
      hiddenProcessIds: []
    });
  }

  render() {
    let { processes } = this.props;
    processes = processes || [];

    const { hiddenProcessIds } = this.state;

    // TODO: Add button to hide current processes / show all processes

    // TODO: Make table sortable
    return (
      <div>
        <div style={{ overflow: 'auto', margin: '5px 0px' }}>
          <div style={{ display: 'inline-block' }}>
            {
              (hiddenProcessIds.length === 0) &&
              <button onClick={evt => this.hideCurrentProcesses()}>Hide Current Processes</button>
            }

            {
              (hiddenProcessIds.length > 0) &&
              <button onClick={evt => this.showAllProcesses()}>Show All Processes</button>
            }
          </div>
        </div>

        <table style={{ width: '100%', textAlign: 'center' }}>
          <thead>
            <tr>
              <td>
                PID
              </td>
              <td>
                PPID
              </td>
              <td>
                Name
              </td>
              <td>
                CPU
              </td>
              <td>
                Thread Type
              </td>
              <td>
                Service URI
              </td>
              <td>
                Uptime
              </td>
              <td>
                f(x)
              </td>
            </tr>
          </thead>
          <tbody>
            {
              processes.map((process, idx) => {
                // TODO: Debug ProcessLinkedState issue where exited processes
                // could still show in this list
                if (!process) {
                  return false;
                }

                const pid = process.getPID();

                // Don't render hidden processes
                if (hiddenProcessIds.includes(pid)) {
                  return false;
                }

                const uptime = process.getUptime();
                const className = process.getClassName();
                const title = process.getTitle();
                const renderedName = title || className;
                const threadType = process.getThreadType();
                const serviceURI = process.getServiceURI();
                const parentPID = process.getParentPID();

                return (
                  <tr key={`${pid}-${idx}`}>
                    <td>
                      {pid}
                    </td>
                    <td>
                      {parentPID}
                    </td>
                    <td>
                      {renderedName}
                    </td>
                    <td>
                      <MainCPUUsagePercent />
                    </td>
                    <td>
                      {threadType}
                    </td>
                    <td style={{ maxWidth: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {serviceURI}
                    </td>
                    <td style={{ maxWidth: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {
                        (() => {
                          if (uptime) {
                            return new Date(uptime).toISOString().substr(11, 8);
                          }
                        })()
                      }

                    </td>
                    <td>
                      <button onClick={evt => process.kill()}>Close</button>
                      <button>Detail</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default hocConnect(Processes, ProcessLinkedState);
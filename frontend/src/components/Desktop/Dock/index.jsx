// import Desktop from '../Desktop';
import React, { Component } from 'react';
import ViewTransition from 'components/ViewTransition';
import { DesktopAppRunConfigLinkedState } from 'utils/DesktopAppRunConfig';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import './style.css';

export default class Dock extends Component {
  state = {
    runConfigs: []
  }

  constructor() {
    super();

    this._runConfigLinkedState = new DesktopAppRunConfigLinkedState();
  }

  componentDidMount() {
    const { desktop } = this.props;

    /*
    if (!(desktop instanceof Desktop)) {
      throw new Error('desktop must be an instance of Desktop');
    }
    */

    this._desktop = desktop;

    // TODO: Refactor
    (() => {
      const runConfigs = this._runConfigLinkedState.getRunConfigs();

      console.debug('current run configs', runConfigs);

      this.setState({
        runConfigs
      });

      /*
      runConfigs.forEach(runConfig => {
        desktop.createWindow(runConfig._desktopWindows[0]);
      });
      */
    })();
  }

  render() {
    const { className, desktop, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
        className={`DesktopDock ${className ? className : ''}`}
      >
        <div className="DesktopDockItems">
          {
            this.state.runConfigs.map((runConfig, idx) => {
              const { _defaultIconSrc } = runConfig;

              if (!_defaultIconSrc) {
                return;
              }

              // TODO: Convert to DockItem (or equiv.) class
              return (
                <ViewTransition
                  key={idx}
                  effect="wobble" // TODO: Use variable
                  style={{/*borderBottom: '5px blue solid',*/ margin: '0px 5px' }}
                >
                  <Tooltip title={runConfig._defaultTitle}>
                    <button
                      // "Launches" the run config
                      // TODO: Implement real run config launching
                      onClick={evt => desktop.createWindow(runConfig._desktopWindows[0])}
                    >
                      <Image src={runConfig._defaultIconSrc} height="40px" style={{ padding: '0px 2px' }} />
                    </button>
                  </Tooltip>
                </ViewTransition>
              );
            })
          }
        </div>
      </div>
    );
  }
}
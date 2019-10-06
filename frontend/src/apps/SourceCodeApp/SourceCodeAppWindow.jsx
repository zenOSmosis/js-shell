import React, { Component } from 'react';
import SocketFSFileTree from 'components/SocketFSFileTree';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
import Window from 'components/Desktop/Window';
import EditorWithFileTabs from './subComponents/EditorWithFileTabs';
import AppFooter from './subComponents/AppFooter';
import { Layout, Content, Footer } from 'components/Layout';
import {
  openAppFile,
  getActiveAppFile
} from 'utils/appFile';
import { ACTIVE_APP_FILE } from './state/UniqueSourceCodeAppLinkedState';
import _exec, { RUN_TARGETS } from './utils/exec';

// TODO: Remove
console.warn('TODO: Remove hardcoded DEFAULT_ROOT_DIRECTORY');
const DEFAULT_ROOT_DIRECTORY = '/shell';

export default class SourceCodeAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      windowTitleOverride: null,

      selectedRunTarget: RUN_TARGETS[0]
    };

    this._editorLinkedState = null;
  }

  componentDidMount() {
    const { appRuntime } = this.props;
    const { editorLinkedState } = appRuntime.getState();

    this._editorLinkedState = editorLinkedState;

    // TODO: Use EVT_UPDATE constant
    this._editorLinkedState.on('update', (updatedState) => {
      if (updatedState[ACTIVE_APP_FILE] !== undefined) {
        let windowTitleOverride = null;

        if (updatedState[ACTIVE_APP_FILE]) {
          const { fileDetail } = updatedState[ACTIVE_APP_FILE];

          if (fileDetail) {
            const { path } = fileDetail;

            windowTitleOverride = path;
          } else {

            windowTitleOverride = null;
          }
        }

        const { windowTitleOverride: prevWindowTitleOverride } = this.state;
        if (windowTitleOverride !== prevWindowTitleOverride) {
          this.setState({
            windowTitleOverride
          });
        }
      }
    });
  }

  async _handleFileOpenRequest(filePath) {
    try {
      await openAppFile(this._editorLinkedState, filePath);
    } catch (exc) {
      throw exc;
    }
  }

  exec() {
    const { appRuntime } = this.props;
    const { selectedRunTarget } = this.state;

    const activeAppFile = getActiveAppFile(this._editorLinkedState);

    if (!activeAppFile) {
      console.error('No active app file');
      return;
    }

    const { fileContent: sourceCode } = activeAppFile;

    _exec(appRuntime, selectedRunTarget, sourceCode);
  }

  selectRunTarget(runTarget) {
    if (!RUN_TARGETS.includes(runTarget)) {
      throw new Error(`Invalid run target: ${runTarget}`);
    }

    this.setState({
      selectedRunTarget: runTarget
    })
  }

  render() {
    if (!this._editorLinkedState) {
      return false;
    }

    const { appRuntime, ...propsRest } = this.props;
    const { windowTitleOverride, selectedRunTarget } = this.state;

    return (
      <Window
        {...propsRest}
        appRuntime={appRuntime}
        title={windowTitleOverride}
        subToolbar={
          <div>
            <button onClick={evt => this.exec()}>
              Execute
            </button>

            <div style={{
              // TODO: Move to CSS module
              display: 'inline-block',
              margin: '0rem .5rem'
            }}>
              on target:
              <select
                onChange={evt => this.selectRunTarget(evt.target.value)}
                value={selectedRunTarget}
              >
                {
                  RUN_TARGETS.map((runTarget, idx) => {
                    return (
                      <option
                        key={idx}
                        value={runTarget}
                      >
                        {runTarget}
                      </option>
                    );
                  })
                }
              </select>
            </div>
          </div>
        }
      >
        <Layout>
          <Content>
            <Full>
              <SplitterLayout
                primaryIndex={1}
                secondaryInitialSize={220}
              >
                <Full>
                  <SocketFSFileTree
                    rootDirectory={DEFAULT_ROOT_DIRECTORY}
                    onExternalFileOpenRequest={path => this._handleFileOpenRequest(path)}
                  />
                </Full>

                <Full>
                  <EditorWithFileTabs
                    editorLinkedState={this._editorLinkedState}
                  />
                </Full>
              </SplitterLayout>
            </Full>
          </Content>
          <Footer>
            <AppFooter editorLinkedState={this._editorLinkedState} />
          </Footer>
        </Layout>

      </Window>
    )
  }
}
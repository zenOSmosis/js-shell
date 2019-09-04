import React, { Component } from 'react';
import SocketFSFileTree from 'components/SocketFSFileTree';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
import Window from 'components/Desktop/Window';
import EditorWithFileTabs from './subComponents/EditorWithFileTabs';
import AppFooter from './subComponents/AppFooter';
import { Layout, Content, Footer } from 'components/Layout';
import openFile from './utils/file/openFile';
import { ACTIVE_FILE } from './state/UniqueSourceCodeAppLinkedState';

const RUN_TARGET_MAIN = {
  name: 'Main Thread',
  value: 'main-thread'
};
const RUN_TARGET_WORKER = {
  name: 'Worker Thread',
  value: 'worker-thread'
};
const RUN_TARGETS = [
  RUN_TARGET_MAIN,
  RUN_TARGET_WORKER
];

// TODO: Remove
console.warn('TODO: Remove hardcoded DEFAULT_ROOT_DIRECTORY');
const DEFAULT_ROOT_DIRECTORY = '/shell';

export default class SourceCodeAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      windowTitleOverride: null
    };

    this._editorLinkedState = null;
  }

  componentDidMount() {
    const { appRuntime } = this.props;
    const { editorLinkedState } = appRuntime;
    this._editorLinkedState = editorLinkedState;

    this._editorLinkedState.on('update', (updatedState) => {
      if (updatedState[ACTIVE_FILE] !== undefined) {
        let windowTitleOverride = null;

        if (updatedState[ACTIVE_FILE]) {
          const { fileDetail } = updatedState[ACTIVE_FILE];

          if (fileDetail) {
            const { path } = fileDetail;
  
            windowTitleOverride = path;
          } else {
            
            windowTitleOverride = null;
          }
        }

        this.setState({
          windowTitleOverride
        });
      }
    });
  }

  async _handleFileOpenRequest(filePath) {
    try {
      await openFile(this._editorLinkedState, filePath);
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { appRuntime, ...propsRest } = this.props;
    const { editorLinkedState } = appRuntime;
    const { windowTitleOverride } = this.state;

    return (
      <Window
        {...propsRest}
        appRuntime={appRuntime}
        title={windowTitleOverride}
        subToolbar={
          <div>
            <button>
              Execute
            </button>
            
            <div style={{
              display: 'inline-block',
              margin: '0rem .5rem'
            }}>
              on target:
              <select>
                {
                  RUN_TARGETS.map((runTarget, idx) => {
                    const {
                      name: runTargetName,
                      value: runTargetValue
                    } = runTarget;
                    
                    return (
                      <option
                        key={idx}
                        value={runTargetValue}
                      >
                        {runTargetName}
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
                    editorLinkedState={editorLinkedState}
                  />
                </Full>
              </SplitterLayout>
            </Full>
          </Content>
          <Footer>
            <AppFooter editorLinkedState={editorLinkedState} />
          </Footer>
        </Layout>

      </Window>
    )
  }
}
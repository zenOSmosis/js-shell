import React, { Component } from 'react';
import FileTree from 'components/FileTree';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
import Window from 'components/Desktop/Window';
import EditorWithFileTabs from './subComponents/EditorWithFileTabs';
import AppFooter from './subComponents/AppFooter';
import { Layout, Content, Footer } from 'components/Layout';

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

export default class SourceCodeAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this._editorLinkedState = null;
  }

  componentDidMount() {
    const { appRuntime } = this.props;
    const { editorLinkedState } = appRuntime;
    this._editorLinkedState = editorLinkedState;
  }

  _handleFileOpenRequest(path) {
    const { openedFilePaths } = this._editorLinkedState.getState();

    openedFilePaths.push(path);

    this._editorLinkedState.setState({
      openedFilePaths
    });
  }

  render() {
    const { appRuntime, ...propsRest } = this.props;
    const { editorLinkedState } = appRuntime;

    return (
      <Window
        {...propsRest}
        appRuntime={appRuntime}
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
                  <FileTree
                    // TODO: Remove hardcoded value
                    rootDirectory="/shell"
                    onFileOpenRequest={path => this._handleFileOpenRequest(path)}
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
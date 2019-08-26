import React, { Component } from 'react';
import FileTree from 'components/FileTree';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
import Window from 'components/Desktop/Window';
import Editor from './subComponents/Editor';
import EditorFooter from './subComponents/Footer';
import { Layout, Content, Footer } from 'components/Layout';

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
    this._editorLinkedState.setState({
      lastFileOpenPath: path
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
            <button>Execute</button>
            <div style={{display: 'inline-block', margin: '0rem 1rem'}}>
              on target:
              <select>
                <option value="main">Main Thread</option>
                <option value="worker">Worker Thread</option>
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
                  <FileTree onFileOpenRequest={path => this._handleFileOpenRequest(path)} />
                </Full>

                <Full>
                  <Editor
                    editorLinkedState={editorLinkedState}
                  />
                </Full>
              </SplitterLayout>
            </Full>
          </Content>
          <Footer>
            <EditorFooter editorLinkedState={editorLinkedState} />
          </Footer>
        </Layout>

      </Window>
    )
  }
}
import React, { Component } from 'react';
import Full from 'components/Full';
import { Layout, Header, Content, Aside, Footer } from 'components/Layout';
import { Button } from 'components/Button';
import { Icon as AntdIcon } from 'antd';
import ClientJITRuntime from 'process/ClientJITRuntime';
import SplitEditorHorizontalIcon from 'icons/vscode/split-editor-horizontal-inverse.svg';
import SplitEditorVerticalIcon from 'icons/vscode/split-editor-vertical-inverse.svg';
// TODO: Remove; prototyping
import MonacoEditor from 'components/MonacoEditor';

const RUN_TARGET_MAIN = 'Main Thread';
const RUN_TARGET_WORKER = 'Worker Thread';
const RUN_TARGETS = [
  RUN_TARGET_MAIN,
  RUN_TARGET_WORKER
];

export default class TabbedPane extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      monacoEditor: null
    };
  }

  componentDidMount() {
    console.warn('TODO: Provide monacoEditor context');
  }

  /**
   * Retrieves the code in the editor.
   * 
   * @return {String} The code 
   */
  getEditorValue() {
    const { monacoEditor } = this.state;

    return monacoEditor.getValue();
  }

  exec() {
    try {
      const code = this.getEditorValue();

      const jitRuntime = new ClientJITRuntime();

      // Execute the monacoEditor content
      // TODO: Make thie project based (option) vs. per-editor based
      jitRuntime.exec(code);

    } catch (exc) {
      console.error('Caught exec exception', exc);
    }
  }

  render() {
    const {/*hasOrientationControls,*/ splitEditor } = this.props;

    return (
      <Full>
        <Layout>
          <Header style={{ height: 25, textAlign: 'left', backgroundColor: 'rgba(0,0,0,.4)' }}>
            <Layout>
              <Content>
                <Button
                  style={{ border: 0, padding: 2, borderRadius: 0 }}
                  onClick={evt => alert('file tab')}
                >
                  <AntdIcon type="file" /><span style={{ fontStyle: 'italic' }}>Untitled</span>
                </Button>
              </Content>
              {
                // hasOrientationControls &&
                <Aside width={40} style={{ overflow: 'hidden' }}>
                  { /* Horizontal split */}
                  <button
                    onClick={(evt) => splitEditor.split('horizontal')}
                    style={{
                      border: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <img
                      src={SplitEditorHorizontalIcon}
                      alt="Horizontal split"
                      style={{ width: '1rem', height: '1rem' }}
                    />
                  </button>

                  { /* Vertical Split */}
                  <button
                    onClick={(evt) => splitEditor.split('vertical')}
                    style={{
                      border: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: 'transparent'
                    }
                    }>
                    <img
                      src={SplitEditorVerticalIcon}
                      alt="Vertical split"
                      style={{ width: '1rem', height: '1rem' }}
                    />
                  </button>
                </Aside>
              }
            </Layout>
          </Header>
          <Layout>
            <Content>
              <MonacoEditor editorDidMount={monacoEditor => this._setMonacoEditor(monacoEditor)} key="monaco-1" />
            </Content>
            <Footer style={{ textAlign: 'left' }}>
              Target:
              <div style={{ display: 'inline-block' }}>
                <select>
                  {
                    RUN_TARGETS.map((runTarget, idx) => {
                      return (
                        <option key={idx}>{runTarget}</option>
                      )
                    })
                  }
                </select>
              </div>
              <Button
                style={{ border: 0, padding: 0, borderRadius: 0 }}
                onClick={evt => this.exec()}
              >
                <AntdIcon type="caret-right" />Run
              </Button>
            </Footer>
          </Layout>
        </Layout>
      </Full>
    );
  }

  _setMonacoEditor(monacoEditor) {
    this.setState({
      monacoEditor
    });
  }
}
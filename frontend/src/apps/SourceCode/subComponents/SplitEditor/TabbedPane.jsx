import React, {Component} from 'react';
import Full from 'components/Full';
import { Layout, Header, Content, Aside } from 'components/Layout';
import { Button } from 'components/Button';
import { Icon as AntdIcon } from 'antd';
import SplitEditorHorizontalIcon from 'icons/vscode/split-editor-horizontal-inverse.svg';
import SplitEditorVerticalIcon from 'icons/vscode/split-editor-vertical-inverse.svg';
// TODO: Remove; prototyping
import MonacoEditor from 'components/MonacoEditor';
import AppContainer from '../AppContainer';
import createApp from 'utils/desktop/createApp';
import config from 'config';

export default class TabbedPane extends Component {
  state = {
    editor: null
  };

  componentDidMount() {
    console.warn('TODO: Provide editor context');
  }

  getEditorValue() {
    const {editor} = this.state;

    return editor.getValue();
  }

  eval() {
    const editorValue = this.getEditorValue();

    const newApp = createApp({
      title: 'Proto app',
      // mainWindow: ,
      iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
    });

    newApp.setMainWindow(
      <AppContainer
        app={newApp}
        rawCode={editorValue}
      />
    );

    newApp.launch();

    /*
    const context = {
      config,
      editorValue,
      createApp,
    };

    const evalInContext = () => {
      console.warn('TODO: Create container app to run this in. Load babel dynamically');
      
      eval(editorValue);
    }

    evalInContext.call(context);
    */
  }

  render() {
    const {/*hasOrientationControls,*/ splitEditor} = this.props;

    return (
      <Full>
        <Layout>
          <Header style={{height: 25, textAlign: 'left', backgroundColor: 'rgba(0,0,0,.4)'}}>
            <Layout>
              <Content>
                <Button
                  style={{border: 0, padding: 0, borderRadius: 0}}
                  onClick={ evt => this.eval() }
                >
                  <AntdIcon type="caret-right" />Run
                </Button>
              </Content>
              {
                // hasOrientationControls &&
                <Aside width={40} style={{overflow: 'hidden'}}>
                  { /* Horizontal split */ }
                  <button
                    onClick={ (evt) => splitEditor.split('horizontal') }
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
                      style={{width: '1rem', height: '1rem'}}
                    />
                  </button>

                  { /* Vertical Split */ }
                  <button 
                    onClick={ (evt) => splitEditor.split('vertical') }
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
                      style={{width: '1rem', height: '1rem'}}
                    />
                  </button>
                </Aside>
              }
            </Layout>
          </Header>
          <Layout>
            <Content>
              <MonacoEditor editorDidMount={ editor => this._setEditor(editor) } key="monaco-1" />
            </Content>
          </Layout>
        </Layout>
      </Full>
    );
  }

  _setEditor(editor) {
    this.setState({
      editor
    });
  }
}
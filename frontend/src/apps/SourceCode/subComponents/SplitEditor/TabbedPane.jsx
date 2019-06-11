import React, {Component} from 'react';
import Full from 'components/Full';
import { Layout, Header, Content, Aside, Footer } from 'components/Layout';
import { Button } from 'components/Button';
import { Icon as AntdIcon } from 'antd';
import ClientJITRuntime from 'process/ClientJITRuntime';
import SplitEditorHorizontalIcon from 'icons/vscode/split-editor-horizontal-inverse.svg';
import SplitEditorVerticalIcon from 'icons/vscode/split-editor-vertical-inverse.svg';
// TODO: Remove; prototyping
import MonacoEditor from 'components/MonacoEditor';

export default class TabbedPane extends Component {
  state = {
    editor: null
  };

  _connectedApp = null;

  componentDidMount() {
    console.warn('TODO: Provide editor context');

    /*
    this._connectedApp = createApp({
      title: 'Proto app',
      // mainWindow: ,
      iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`,
      // Proto method
      render: (props) => {
        const app = this._connectedApp;
        const rawCode = this.getEditorValue();

        return (
          <AppContainer
            app={app}
            rawCode={rawCode}
          />
        );
      }
     });

     this._connectedApp.launch();
     */
  }

  getEditorValue() {
    const {editor} = this.state;

    return editor.getValue();
  }

  eval() {
    // @see https://codepen.io/namuol/pen/MXJOzy
    
    // TODO: Remove this.. just prototyping here
    /*
    window['zdModules'] = {
      ClientGUIProcess
    };
    */

  try {
    const jitRuntime = new ClientJITRuntime();

    // Execute the editor content
    // TODO: Make thie project based (option) vs. per-editor based
    jitRuntime.exec(this.getEditorValue());

  } catch (exc) {
    console.error('Caught eval exception', exc);
  }

    /*
    const evalInContext = () => {
      

      const codeWrapper = `
        (() => {
          ${compiledCode}
        })();
      `;

      eval(codeWrapper);
    };

    evalInContext.call({
      React,
      ClientGUIProcess,
      zdComponents: {
        Window,
        Center
      }
    });
    */

    /*
    const blob = new Blob([code], {
        type: 'text/javascript'
    });

    const blobURL = URL.createObjectURL(blob);

    // TODO: Include ability to exec blobURL in a worker thread, or load it in an iFrame

    const elScript = document.createElement('script');
    // elScript.type = 'module';
    elScript.src = blobURL;
    window.document.body.appendChild(elScript);
    */

    // URL.revokeObjectURL(blobURL);

    /*
    (async () => {
        // const res = await fetch(objURL);
        // const text = await res.text();
    try {
      

      const res = await asyncEval(
        Object.assign(
          {},
          window,
          {
            page
          }
        ),
        editorValue);

      if (res) {
        console.warn('TODO: Handle res?', res);
      }
    } catch (exc) {
      console.error(exc);
    }

    /*
    newApp.setMainWindow(
      <AppContainer
        app={newApp}
        rawCode={editorValue}
      />
    );
    */

    // newApp.launch();

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
                  onClick={ evt => alert('file tab') }
                >
                  <AntdIcon type="file" /><span style={{fontStyle: 'italic'}}>Untitled</span>

                  <Button onClick={ evt => alert('close')} >
                    x
                  </Button>
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
            <Footer style={{textAlign: 'left'}}>
              Target:               
              <div style={{display: 'inline-block'}}>
                  <select>
                    <option>Main Thread</option>
                    <option>Worker Thread</option>
                    <option>IFrame</option>
                  </select>
              </div>
              <Button
                style={{border: 0, padding: 0, borderRadius: 0}}
                onClick={ evt => this.eval() }
              >
                <AntdIcon type="caret-right" />Run
              </Button>
            </Footer>
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
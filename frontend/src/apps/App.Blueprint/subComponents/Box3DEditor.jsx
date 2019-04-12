import React, { Component } from 'react';
import { Layout, Aside, Content, Footer } from '../../../components/Layout';
import Box3D, { BOX3D_SIDES } from '../../../components/Box3D';
import { Select, Option, OptGroup } from '../../../components/Select';
import MonacoEditor from '../../../components/MonacoEditor';

export default class Box3DEditor extends Component {
  state = {
    currentEditingSide: BOX3D_SIDES[0],

    sideContents: {}
  };

  setSideContent(side, content) {
    let {sideContents} = this.state;

    let updatedContent = {};
    updatedContent[side] = content;

    sideContents = Object.assign(sideContents, updatedContent);

    this.setState({sideContents});
  }

  getSideContent(side = undefined) {
    const {sideContents, currentEditingSide} = this.state;

    if (!side) {
      side = currentEditingSide;
    }

    return sideContents[side];
  }

  editorDidMount = (editor, monaco) => {
    console.debug('editorDidMount', {
      editor,
      monaco
    });

    // Automatically focus
    editor.focus();
  }

  render() {
    const {appBlueprintBaseWindow, box3D, code, monacoOptions, ...propsRest} = this.props;
    const {currentEditingSide} = this.state;

    const sideContent = this.getSideContent();

    return (
      <Layout
        {...propsRest}
        style={{ border: '1px rgba(255,255,255,.2) solid', borderRadius: 4 }}
      >
        <Content>
          {
            // @see https://github.com/react-monaco-editor/react-monaco-editor
            // @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html#autoindent
          }
          <MonacoEditor
            ref={c => this._monacoEditor = c}
            // width={this.state.bodySize.width}
            // height={this.state.bodySize.height}
            language={this.state.monacoLanguage} // TODO: Implement language detection
            // theme="vs-dark"
            value={sideContent}
            options={monacoOptions}
            // context={this}
            // onChange={(newValue, event) => /* box3D.setFaceContent('Front', newValue) */ console.debug({
            //  newValue,
            //  event,
            //  box3D,
            //  appBlueprintBaseWindow
            // })}
            onChange={(newValue, event) => appBlueprintBaseWindow._renderBox.setFaceContent(currentEditingSide, newValue)}
            editorDidMount={this.editorDidMount}
          />
        </Content>
        <Footer style={{ backgroundColor: '#007acc', textAlign: 'left', padding: '0px 5px' }}>
          <div style={{ float: 'right' }}>
            <Select size="small" defaultValue={currentEditingSide}>
              {
                BOX3D_SIDES.map((box3DSide, idx) => {
                  return (
                    <Option key={idx} value={box3DSide}>{box3DSide}</Option>
                  );
                })
              }
            </Select>
          </div>

          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <Select
              onChange={monacoLanguage => this.setState({ monacoLanguage })}
              defaultValue={this.state.monacoLanguage}
              size="small"
              style={{ width: 120 }
              }>
              <Option value="html">HTML</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="css">CSS</Option>
              <Option value="markdown">Markdown</Option>
            </Select>
          </div>
        </Footer>
      </Layout>
    );
  }
}
import React from 'react';
import Full from '../Full';
import ReactMonacoEditor from 'react-monaco-editor';

const MonacoEditor = (props = {}) => {
  const {width, height, automaticLayout, theme, ...propsRest} = props;

 return (
  <Full style={{ textAlign: 'left' }}>
    {
      // @see https://github.com/react-monaco-editor/react-monaco-editor
      // @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html#autoindent
    }
    <ReactMonacoEditor
      width="100%"
      height="100%"
      automaticLayout={true}
      theme="vs-dark"
      // editorDidMount={this.editorDidMount}
      {...propsRest}
    />
  </Full>
 );
};

export default MonacoEditor;
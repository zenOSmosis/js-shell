import React, {Component} from 'react';
import Full from '../Full';
import ReactMonacoEditor from 'react-monaco-editor';

export default class MonacoEditor extends Component {
  _editor = null;
  _layoutInterval = null;
  _intervalTime = 100; // milliseconds

  editorDidMount(editor) {
    const {editorDidMount} = this.props;

    this._editor = editor;

    // Reimplementation of internal automatic layout
    // Passing of automaticLayout as prop does not seem to be working
    // @see https://github.com/Microsoft/monaco-editor/issues/28
    this._layoutInterval = setInterval(() => {
      editor.layout();
    }, this._intervalTime);

    // @see https://github.com/Microsoft/monaco-editor/issues/270
    // @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html
    const model /* ITextModel */ = editor.getModel();
    model.updateOptions({
      tabSize: 2
    });

    if (typeof editorDidMount === 'function') {
      editorDidMount(editor);
    }
  }

  componentWillUnmount() {
    clearInterval(this._layoutInterval);
  }

  render() {
    const {width, height, automaticLayout, theme, ...propsRest} = this.props;

    return (
      <Full style={{ textAlign: 'left' }}>
        {
          // @see https://github.com/react-monaco-editor/react-monaco-editor
          // @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html#autoindent
        }
        <ReactMonacoEditor
          {...propsRest}
            width="100%"
            height="100%"
            // automaticLayout={true}
            theme="vs-dark"
            editorDidMount={(editor) => this.editorDidMount(editor)}
          />
      </Full>
    );
  }
}
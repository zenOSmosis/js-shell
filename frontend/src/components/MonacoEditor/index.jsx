// @see https://github.com/react-monaco-editor/react-monaco-editor
// @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html#autoindent

import React, {Component} from 'react';
import Full from '../Full';
import createAsyncComponent from 'utils/react/createAsyncComponent';

export const DEFAULT_TAB_SIZE = 2;

/**
 * Note: Dyanically loads MonacoEditor as an async import via code splitting.
 * 
 * @extend Component
 */
export default class MonacoEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ReactMonacoEditor: null
    };

    this._editor = null;
    this._pollingLayoutInterval = null;
    this._pollingLayoutIntervalTime = 100; // milliseconds
  }

  componentDidMount() {
    const ReactMonacoEditor = createAsyncComponent(() => import('react-monaco-editor'));
    this.setState({
      ReactMonacoEditor
    });
  }

  componentWillUnmount() {
    clearInterval(this._pollingLayoutInterval);
  }

  editorDidMount(editor) {
    const {editorDidMount} = this.props;

    this._editor = editor;
    
    // Set default properties
    this.updateModelOptions({
      tabSize: DEFAULT_TAB_SIZE
    });

    this._startLayoutPolling();

    if (typeof editorDidMount === 'function') {
      editorDidMount(editor);
    }
  }

  /**
   * Reimplementation of internal automatic layout.
   * Passing of automaticLayout as prop does not seem to be working
   * 
   * @see https://github.com/Microsoft/monaco-editor/issues/28
   */
  _startLayoutPolling() {
    if (!this._editor) {
      throw new Error('Monaco Editor is not initialized');
    }

    if (this._pollingLayoutInterval) {
      console.warn('Already polling.');
      return;
    }
  
    this._pollingLayoutInterval = setInterval(() => {
      this._editor.layout();
    }, this._pollingLayoutIntervalTime);
  }

  _stopLayoutPolling() {
    clearInterval(this._pollingLayoutInterval);
  }

  /**
   * @see https://github.com/Microsoft/monaco-editor/issues/270
   * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html
   * 
   * @param {Object} modelOptions 
   */
  updateModelOptions(modelOptions) {
    const model = this._editor.getModel();

    model.updateOptions(modelOptions);
  }

  render() {
    const {width, height, automaticLayout, theme, ...propsRest} = this.props;
    const { ReactMonacoEditor } = this.state;

    return (
      <Full style={{ textAlign: 'left' }}>
        {
          ReactMonacoEditor &&
          <ReactMonacoEditor
          {...propsRest}
            width="100%"
            height="100%"
            // automaticLayout={true}
            theme="vs-dark"
            editorDidMount={(editor) => this.editorDidMount(editor)}
          />
        }
      </Full>
    );
  }
}
// @see https://github.com/react-monaco-editor/react-monaco-editor
// @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html#autoindent

import React, { Component } from 'react';
import Full from '../Full';
import createAsyncComponent from 'utils/react/createAsyncComponent';
import classNames from 'classnames';
import style from './MonacoEditor.module.css';
import MonacoEditorEvents from './MonacoEditorEvents';

export const DEFAULT_TAB_SIZE = 2;

/**
 * Creates a full-width/height Monaco Editor instance, built around
 * react-monaco-editor.
 * 
 * Important!: This dyanically loads MonacoEditor as an async import via code
 * splitting, so it requires a network connection in order to function.
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
    this._monaco = null;
    this._pollingLayoutInterval = null;
    this._pollingLayoutIntervalTime = 100; // milliseconds
    this._monacoEditorEvents = null;
  }

  componentDidMount() {
    const { initialValue } = this.props;

    const ReactMonacoEditor = createAsyncComponent(() => import('react-monaco-editor'));
    this.setState({
      ReactMonacoEditor,
      initialValue
    });
  }

  componentWillUnmount() {
    this._stopLayoutPolling();

    this._monacoEditorEvents = null;
  }

  // TODO: Rename to _handleEditorMount
  _handleEditorMount(editor, monaco) {
    const { editorDidMount, initialValue } = this.props;

    this._editor = editor;
    this._monaco = monaco;

    this._monacoEditorEvents = new MonacoEditorEvents(this);

    // Set default properties
    this.updateModelOptions({
      tabSize: DEFAULT_TAB_SIZE
    });

    this._startLayoutPolling();

    this.setValue(initialValue);

    if (typeof editorDidMount === 'function') {
      const monacoEditorComponent = this;
      editorDidMount(editor, monaco, monacoEditorComponent);
    }

    // Automatically focus
    editor.focus();
  }

  getEditor() {
    return this._editor;
  }

  getModel() {
    const model = this._editor.getModel();

    return model;
  }

  getLanguages() {
    const { languages } = this._monaco;

    return languages.getLanguages();
  }

  /**
   * Retrieves the editor's content.
   * 
   * @return {string}
   */
  getValue() {
    return this._editor.getValue();
  }

  /**
   * Sets the editor's content.
   * 
   * @param {string} value 
   */
  setValue(value) {
    value = value.toString();

    return this._editor.setValue(value);
  }

  /**
   * @see https://github.com/Microsoft/monaco-editor/issues/270
   * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html
   * 
   * @param {Object} modelOptions 
   */
  updateModelOptions(modelOptions) {
    const model = this.getModel();

    model.updateOptions(modelOptions);
  }

  /**
   * Reimplementation of internal automatic layout.
   * 
   * Passing of automaticLayout as prop does not seem to be working correctly,
   * so this is a work-around.
   * 
   * @see https://github.com/Microsoft/monaco-editor/issues/28
   */
  _startLayoutPolling() {
    if (!this._editor) {
      throw new Error('Monaco Editor is not initialized');
    }

    if (this._pollingLayoutInterval) {
      console.warn('Monaco Editor layout is already polling');
      return;
    }

    this._pollingLayoutInterval = setInterval(() => {
      this._editor.layout();
    }, this._pollingLayoutIntervalTime);
  }

  _stopLayoutPolling() {
    clearInterval(this._pollingLayoutInterval);
  }

  render() {
    const {
      containerClassName,
      containerStyle,
      width,
      height,
      automaticLayout,
      theme,
      language,
      ...propsRest
    } = this.props;
    const { ReactMonacoEditor } = this.state;

    return (
      <Full
        className={classNames(style['monaco-editor-container'], containerClassName)}
        style={containerStyle}
      >
        {
          ReactMonacoEditor &&
          <ReactMonacoEditor
            {...propsRest}
            width="100%"
            height="100%"
            // automaticLayout={true} // This doesn't seem to work properly, hence the polling layout
            theme={theme ? theme : 'vs-dark'}
            language={language}
            editorDidMount={(editor, monaco) => this._handleEditorMount(editor, monaco)}
          />
        }
      </Full>
    );
  }
}
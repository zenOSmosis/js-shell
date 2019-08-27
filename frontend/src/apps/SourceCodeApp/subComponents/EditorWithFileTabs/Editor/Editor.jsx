import React, { Component } from 'react';
import { CURSOR_POSITION } from '../../../utils/SourceCodeAppLinkedState';
import MonacoEditor from 'components/MonacoEditor';
import { readFile } from 'utils/socketFS';

export default class Editor extends Component {
  constructor(...args) {
    super(...args);

    this._monacoEditor = null;
  }

  componentDidMount() {
    const { editorLinkedState } = this.props;
    this._editorLinkedState = editorLinkedState;
    
    this._editorLinkedState.on('update', async (updatedState) => {
      try {
        const { lastFileOpenPath } = updatedState;

        // TODO: Refactor this
        if (lastFileOpenPath) {
          const value = await readFile(lastFileOpenPath, {
            encoding: 'utf-8'
          });

          // console.log(value);

          this.setValue(value);
        }
      } catch (exc) {
        throw exc;
      }
    });
  }

  componentWillUnmount() {
    this._monacoEditor.dispose();
    this._monacoEditor = null;
  }

  /**
   * Retrieves the code in the editor.
   * 
   * @return {string} The code 
   */
  getValue() {
    return this._monacoEditor.getValue();
  }

  setValue(value) {
    this._monacoEditor.setValue(value);
  }

  render() {
    return (
      <MonacoEditor
        editorDidMount={monacoEditor => this._setMonacoEditor(monacoEditor)}
      />
    );
  }

  _setMonacoEditor(monacoEditor) {
    this._monacoEditor = monacoEditor;

    // Handle cursor position change
    this._monacoEditor.onDidChangeCursorSelection((evt) => {
      const { selection } = evt;

      if (selection !== undefined && this._editorLinkedState) {
        this._editorLinkedState.setState({
          [CURSOR_POSITION]: selection
        });
      }
    });
  }
}
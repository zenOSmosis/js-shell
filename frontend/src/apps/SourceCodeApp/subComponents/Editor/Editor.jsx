import React, { Component } from 'react';
import MonacoEditor from 'components/MonacoEditor';
import { readFile } from 'utils/socketFS';

export default class Editor extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      monacoEditor: null
    };
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

  /**
   * Retrieves the code in the editor.
   * 
   * @return {string} The code 
   */
  getValue() {
    const { monacoEditor } = this.state;

    return monacoEditor.getValue();
  }

  setValue(value) {
    const { monacoEditor } = this.state;

    monacoEditor.setValue(value);
  }

  render() {
    return (
      <MonacoEditor
        editorDidMount={monacoEditor => this._setMonacoEditor(monacoEditor)}
      />
    );
  }

  _setMonacoEditor(monacoEditor) {
    this.setState({
      monacoEditor
    });
  }
}
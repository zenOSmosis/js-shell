class MonacoEditorEvents {
  constructor(editorComponent) {
    this._editorComponent = editorComponent;
    this._editor = editorComponent.getEditor();

    this._bindEvents();
  }

  _bindEvents() {
    const model = this._editorComponent.getModel();

    this._editor.onDidChangeCursorSelection((evt) => {
      this.onDidChangeCursorSelection(evt);
    });
    
    model.onDidChangeContent((evt) => {
      this.onDidChangeContent(evt);
    });
  }

  onDidChangeCursorSelection(evt) {
    const { props } = this._editorComponent;
    const { onDidChangeCursorSelection } = props;

    const { selection } = evt;
  
    if (selection !== undefined && typeof onDidChangeCursorSelection === 'function') {
      onDidChangeCursorSelection(selection);
    }
  }

  /**
   * An event emitted when the contents of the model have changed.
   * 
   * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html#ondidchangecontent
   */
  onDidChangeContent(evt) {
    const { props } = this._editorComponent;
    const { onDidChangeContent } = props;

    if (typeof onDidChangeContent === 'function') {
      onDidChangeContent(evt);
    }
  }

  /**
   * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html#ondidchangelanguage 
   */
  // onDidChangeLanguage(evt) {
  // }
}

export default MonacoEditorEvents;
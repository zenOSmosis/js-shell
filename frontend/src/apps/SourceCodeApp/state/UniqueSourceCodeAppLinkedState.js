import UniqueLinkedState from 'state/UniqueLinkedState';

export const OPENED_FILES = 'openedFiles';
export const ACTIVE_FILE = 'activeFile';
export const LANGUAGES = 'languages';
export const CURSOR_POSITION = 'cursorPosition';

class UniqueSourceCodeAppLinkedState extends UniqueLinkedState {
  constructor() {
    super('source-code-app', {
      [OPENED_FILES]: [],

      [ACTIVE_FILE]: null,

      [LANGUAGES]: [],

      [CURSOR_POSITION]: {
        endColumn: 0,
        endLineNumber: 0,
        positionColumn: 0,
        positionLineNumber: 0,
        selectionStartColumn: 0,
        selectionStartLineNumber: 0,
        startColumn: 0,
        startLineNumber: 0
      }
    });
  }
}

export default UniqueSourceCodeAppLinkedState;
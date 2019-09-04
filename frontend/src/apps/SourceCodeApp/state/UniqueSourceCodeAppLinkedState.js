import UniqueLinkedState from 'state/UniqueLinkedState';

export const OPENED_APP_FILES = 'openedAppFiles';
export const ACTIVE_APP_FILE = 'activeAppFile';
export const LANGUAGES = 'languages';
export const CURSOR_POSITION = 'cursorPosition';

/**
 * @extends UniqueLinkedState
 */
class UniqueSourceCodeAppLinkedState extends UniqueLinkedState {
  constructor() {
    super('source-code-app', {
      [OPENED_APP_FILES]: [],

      [ACTIVE_APP_FILE]: null,

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
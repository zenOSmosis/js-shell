import LinkedState from 'state/LinkedState';

export const OPENED_FILES = 'openedFiles';
export const ACTIVE_FILE = 'activeFile';
export const LANGUAGES = 'languages';
export const CURSOR_POSITION = 'cursorPosition';

const _uuids = [];

class SourceCodeAppLinkedState extends LinkedState {
  constructor(uuid) {
    if (_uuids.includes(uuid)) {
      throw new Error('uuid is not unique!');
    } else {
      _uuids.push(uuid);
    }

    super(`source-code-app-${uuid}`, {
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

export default SourceCodeAppLinkedState;
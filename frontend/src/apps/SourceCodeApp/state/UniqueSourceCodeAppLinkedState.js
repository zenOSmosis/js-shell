import UniqueMultiAppFileLinkedState, {
  OPENED_APP_FILES,
  ACTIVE_APP_FILE
} from 'state/UniqueMultiAppFileLinkedState';


export const LANGUAGES = 'languages';
export const CURSOR_POSITION = 'cursorPosition';

/**
 * @extends UniqueLinkedState
 */
class UniqueSourceCodeAppLinkedState extends UniqueMultiAppFileLinkedState {
  constructor() {
    super('source-code-app', {
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
export {
  OPENED_APP_FILES,
  ACTIVE_APP_FILE
};
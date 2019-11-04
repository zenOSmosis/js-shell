import UniqueMultiAppFileLinkedState, {
  OPENED_APP_FILES,
  ACTIVE_APP_FILE
} from 'state/UniqueMultiAppFileLinkedState';

export const LANGUAGES = 'languages';

/**
 * @extends UniqueLinkedState
 */
class UniqueSourceCodeAppLinkedState extends UniqueMultiAppFileLinkedState {
  constructor() {
    super('source-code-app', {
      [LANGUAGES]: []
    });
  }
}

export default UniqueSourceCodeAppLinkedState;
export {
  OPENED_APP_FILES,
  ACTIVE_APP_FILE
};
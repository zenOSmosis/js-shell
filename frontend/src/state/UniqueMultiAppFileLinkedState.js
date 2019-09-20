import UniqueLinkedState, { DEFAULT_LINKED_SCOPE_NAME } from './UniqueLinkedState';

export const OPENED_APP_FILES = 'openedAppFiles';
export const ACTIVE_APP_FILE = 'activeAppFile';

class UniqueMultiAppFileLinkedState extends UniqueLinkedState {
  constructor(linkedScopeName = DEFAULT_LINKED_SCOPE_NAME, defaultState = {}, options = {}) {
    const mergedDefaultState = {...{
      [OPENED_APP_FILES]: [],

      [ACTIVE_APP_FILE]: null
    }, ...defaultState};
    
    super(linkedScopeName, mergedDefaultState, options);
  }
}

export default UniqueMultiAppFileLinkedState;
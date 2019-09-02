import LinkedState, { DEFAULT_LINKED_SCOPE_NAME } from '../LinkedState';
import uuidv4 from 'uuidv4';

/**
 * A LinkedState store which, when instantiated, creates a unique scope.
 * 
 * @extends LinkedState
 */
class UniqueLinkedState extends LinkedState {
  constructor(linkedScopeName = DEFAULT_LINKED_SCOPE_NAME, initialDefaultState, options = {}) {
    linkedScopeName = `[unique]${linkedScopeName}${uuidv4()}`;

    super(linkedScopeName, initialDefaultState, options);
  }
}

export default UniqueLinkedState;
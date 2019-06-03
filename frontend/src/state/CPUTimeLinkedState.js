import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export default class CPUTimeLinkedState extends LinkedState {
  constructor() {
    super('cpu-time', {
      cpusLevels: []
    });
  }
}
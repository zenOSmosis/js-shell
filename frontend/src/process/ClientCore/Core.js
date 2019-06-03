import ClientProcess from '../ClientProcess';

// TODO: Implement heartbeat monitoring from other processes

// This should be treated as a singleton
export default class Core extends ClientProcess {
  constructor() {
    super(false, (proc) => {
      console.debug('Init kernel');

      // console.warn('TODO: Implement process.fork() here');
      // new DesktopLayoutGUIProcess();
    });
  }
}
import ClientWorkerProcess from 'process/ClientWorkerProcess';

export default class CoreSocketIOWorker extends ClientWorkerProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');
      
      /*
      proc.stdctrlin.on('data', (data) => {
        console.debug('Received data over ctrl', data);
      });
      */
    });
  }
}
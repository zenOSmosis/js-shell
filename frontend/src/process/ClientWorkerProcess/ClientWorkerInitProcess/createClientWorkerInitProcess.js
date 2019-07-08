import ClientWorkerInitProcess from './ClientWorkerInitProcess';

const createClientWorkerInitProcess = (clientWorkerHostOrNativeProcess) => {
  return new ClientWorkerInitProcess(clientWorkerHostOrNativeProcess);
};

export default createClientWorkerInitProcess;
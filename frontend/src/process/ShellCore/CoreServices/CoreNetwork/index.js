import ClientProcess from 'process/ClientProcess';
import CoreHTTPWorker from './CoreHTTPWorker';
import CoreSocketIOWorker from './CoreSocketIOWorker';

export default class CoreNetworkController extends ClientProcess {
  constructor(parentProcess) {
    super(parentProcess);

    // TODO: Provide pipe routing
    new CoreHTTPWorker(this);
    
    new CoreSocketIOWorker(this);
  }
}
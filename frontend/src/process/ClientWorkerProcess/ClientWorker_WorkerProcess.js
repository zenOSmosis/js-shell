import ClientProcess from 'process/ClientProcess';

const masq = (() => {
  // Temporarily create ClientProcess in order to obtain prototype methods
  const masqProcess = new ClientProcess(false);
  const prototype = masqProcess.constructor.prototype;
  const excludeKeys = [
    'constructor'
  ];
  const includeKeys = [
    '_tick'
  ];

  const keys = Object.getOwnPropertyNames(prototype).filter(key => {
    if (excludeKeys.includes(key)) {
      return false;
    }
    
    if (includeKeys.includes(key)) {
      return true;
    }
    
    // Exclude keys beginning with underscore
    if (key.startsWith('_')) {
      return false;
    }

    return true;
  });

  masqProcess.kill();

  const masq = keys.map((key) => {
    return prototype[key].toString();
  });

  return masq;
})();

const getSerializedWorkerProcess = (cmd) => {
  if (typeof cmd !== 'function') {
    throw new Error('cmd is not a function');
  }

  return `
    // EventEmitter
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/EventEmitter/5.2.6/EventEmitter.js');

    if (typeof EventEmitter === 'undefined') {
      throw new Error('Could not obtain EventEmitter');
    }

    class ClientWorker_WorkerProcess extends EventEmitter {
      constructor() {
        super();

        console.warn('TODO: Bind parent methods to local');
      }

      /**
       * Method names imported from ClientProcess.
       */
      _getRawProcMasq() {
        return ${JSON.stringify(masq)}
      }

      /**
       * TODO: Verify second argument name
       */
      postMessage(message, threaded) {
        self.postMessage(message, threaded);
      }
    }

    const workerProcess = new ClientWorker_WorkerProcess();

    // Execute command, using workerProcess as the first argument
    (${cmd.toString()})(workerProcess);
  `;
};

// Using Proxies to handle unknown method call
// https://rosettacode.org/wiki/Respond_to_an_unknown_method_call#JavaScript
/**
 * obj  = new Proxy({}, 
        { get : function(target, prop) 
            { 
                if(target[prop] === undefined) 
                    return function()  {
                        console.log('an otherwise undefined function!!');
                    };
                else 
                    return target[prop];
            }
        });
obj.f()        ///'an otherwise undefined function!!'
obj.l = function() {console.log(45);};
obj.l();       ///45
 */

 /**
  * Proto:

  const { ClientWorkerProcess } = this;

  new ClientWorkerProcess(process, (worker) => {
    console.log('I am the worker', worker);

    console.log(worker._getRawProcMasq());
  });

  */

export default getSerializedWorkerProcess;
// TODO: Convert SourceCode editor tabbing to 2
// TODO: Section to configure SourceCode editor

const { ClientWorkerProcess, ClientProcess } = this;

// Tests to ensure we're not in a worker process
(() => {
    // WebWorkers have an importScripts available to them natively
    if (typeof importScripts !== 'undefined') {
      throw new Error('importScripts is already defined');
    }
})();

const testCompiler = new ClientWorkerProcess(
  (proc) => {
    // Tests to ensure we're not in the parent process
    (() => {
      // Ensure we're in a new scope
      if (typeof testCompiler !== 'undefined') {
        throw new Error('compiler already exists within this scope');
      }
    })();

    // Import Babel compiler
    // TODO: Should we modify "importScripts" so it proxies through backend?
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.js');
    // importScripts('react');

    // Ensure we have a Babel reference
    // TODO: Ensure we have a valid hash for this reference (optional parameter)
    if (typeof Babel === 'undefined') {
      throw new Error('Babel failed to load');
    }

    console.debug({
      Babel,
      proc,
      context: this
    });

  }
);

console.debug({
  compiler,
  context: this
});


/*
const local = new ClientProcess(
  (proc) => {
    proc.setTitle('Process Compiler Frontend');

    const compile = async (code) => {
      try {
        
      } catch (exc) {
        throw exc;
      }
    };

    const rpcMethod = () => {
      console.log(proc.getPID());
    };

    compiler.sendMessage({
      cmd: 'compile',
      src: rpcMethod.toString()
    });
  }
);
*/
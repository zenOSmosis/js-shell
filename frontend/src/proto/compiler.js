// TODO: Convert SourceCode editor tabbing to 2
// TODO: Section to configure SourceCode editor

const { ClientWorkerProcess, ClientProcess } = this;

/*
// Tests to ensure we're not in a worker process
(() => {
    // WebWorkers have an importScripts available to them natively
    if (typeof importScripts !== 'undefined') {
      throw new Error('importScripts is already defined');
    }
})();
*/

const testCompiler = new ClientWorkerProcess(
  (proc) => {
    // Tests to ensure we're not in the parent process
    (() => {
        console.debug({
            proc,
            context: this
        });

      // Ensure we're in a new scope
      /*
      if (typeof testCompiler !== 'undefined') {
        throw new Error('compiler already exists within this scope');
      }
      */
    })();

    console.debug('Importing dependencies');
    importScripts(
        // Babel
        'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.js',
        
        // React
        'https://unpkg.com/react@16/umd/react.development.js',
        
        // ReactDOM
        'https://unpkg.com/react-dom@16/umd/react-dom.development.js'
    );
    console.debug('Finished importing dependencies');

    // Ensure we have a Babel reference
    // TODO: Ensure we have a valid hash for this reference (optional parameter)
    if (typeof Babel === 'undefined' ||
        typeof React === 'undefined' ||
        typeof ReactDOM === 'undefined') {
        throw new Error('A required dependency failed to load');
    }

    console.debug({
      Babel,
      babelVersion: Babel.version,

      React,
      reactVersion: React.version,

      proc,
      context: this
    });

    proc.stdin.on('data', data => {
        console.debug({
            evt: 'proc.stdin.write',
            proc,
            data
        });

        proc.stdout.write('I am the compiler, and I am responding');
    });
  }
);

console.warn('TODO: Ensure write');

testCompiler.stdin.write('Test message');

// TODO: Ensure this gets written to
testCompiler.stdout.on('data', (data) => {
    console.debug('Recevited data from stdout', data);
});

console.debug({
  testCompiler,
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
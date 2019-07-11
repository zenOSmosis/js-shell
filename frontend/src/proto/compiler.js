// TODO: Convert SourceCode editor tabbing to 2
// TODO: Section to configure SourceCode editor

const { BabelCompilerWorkerProcess } = this;

const testCompiler = new BabelCompilerWorkerProcess(process);

(async () => {
  try {
    await testCompiler.onceReady();


    console.warn('TODO: Ensure write');

    testCompiler.stdctrl.write('Test message');

    // TODO: Ensure this gets written to
    testCompiler.stdctrl.on('data', (data) => {
      console.debug('Recevited data from stdctrl', data);
    });

    const testComponent = (props = {}) => {
      return <div>Hello World</div>
    }

    testCompiler.stdctrl.write({
      ctrlName: 'compile',
      ctrlData: testComponent.toString()
    });

    console.debug({
      testCompiler,
      context: this
    });
  } catch (exc) {
    throw exc;
  }
})();
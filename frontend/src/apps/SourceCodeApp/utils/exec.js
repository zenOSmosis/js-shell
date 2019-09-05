import ClientJITRuntime from 'process/ClientJITRuntime';

const exec = (appRuntime, sourceCode) => {
  const jitRuntime = new ClientJITRuntime(appRuntime);

  jitRuntime.exec(sourceCode);
};

export default exec;
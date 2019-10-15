const task = {
  construct: (self) => {
    console.debug({
      self
    });

    return 'Hello!!';
  },

  destruct: (self) => {
    console.debug({
      self
    });
  }
};

// TODO: Implement abort handling
const taskRunner = (task) => {
  // const abortController = new AbortController();
  
  let isDestructStarted = false;
  let isDestructed = false;
  const runDestructor = async () => {
    try {
      if (isDestructStarted || isDestructed) {
        return;
      }
      isDestructStarted = true;

      await task.destruct(task);

      isDestructed = true;
    } catch (exc) {
      throw exc;
    }
  };

  const runner = new Promise(async (resolve, reject) => {
    try {
      const value = await task.construct(task);

      await runDestructor();

      resolve(value);
    } catch (exc) {
      try {
        await runDestructor();

        reject(exc);
      } catch (destructExc) {
        reject(destructExc);
      }
    }
  });

  return runner;
};

(async () => {
  try {
    const runner = taskRunner(task);

    // runner.cancel();

    const value = await runner;

    alert(value);
  } catch (exc) {
    console.error(exc);
  }
})();


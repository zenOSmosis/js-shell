// Note: This is just a prototype for experiementation
const asyncEval = async (context, code) => {
  try {
    const evalInContext = () => {
      return eval(`
        (async () => {
          try {
            const resp = await (async () => {
              try {
                ${code}
              } catch (exc) {
                throw exc;
              }
            })();
  
            if (resp) {
              render(resp);
            }
          } catch (exc) {
            throw exc;
          }
        })();
      `);
    };

    return await evalInContext.call(context);
  } catch (exc) {
    throw exc;
  }
};

export default asyncEval;
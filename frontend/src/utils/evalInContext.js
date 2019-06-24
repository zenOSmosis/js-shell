/**
 * 
 * @param {string | Function | any} code 
 * @param {object} context [default={}] The context in which the code will
 * be executed.
 */
const evalInContext = (code, context = {}) => {
  const exec = () => {
    // Wrap the code in a closure
    // TODO: Consider replacing eval w/ new Function() call, or equiv.
    // TODO: Consider exposing context as regular variables, instead of solely
    // as "this" references.
    // TODO: Map "self" to "this"(?)
    const wrappedCode = `
      (() => {
        ${code}
      })();
    `;

    eval(wrappedCode);
  };

  // Execute the code in the given context
  return exec.call(context);
};

export default evalInContext;
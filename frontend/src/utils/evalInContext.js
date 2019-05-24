const evalInContext = (code, context = {}) => {
  const exec = () => {
    const wrappedCode = `
      (() => {
        ${code}
      })();
    `;

    eval(wrappedCode);
  };

  return exec.call(context);
};

const evalInProtectedContext = (code, context = {}) => {
  code = `
    ((nativeWindow) => {
      const window = undefined;
      const document = undefined;
      const self = undefined;

      ${code}
    })(window);
  `;

  return evalInContext(code, context);
};

export default evalInProtectedContext;
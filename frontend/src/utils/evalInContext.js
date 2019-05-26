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
      // Note: Usage of let instead of const to allow user to override
      let window = undefined;
      let document = undefined;
      let self = undefined;

      ${code}
    })(window);
  `;

  return evalInContext(code, context);
};

export default evalInProtectedContext;
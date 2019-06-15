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

export default evalInContext;
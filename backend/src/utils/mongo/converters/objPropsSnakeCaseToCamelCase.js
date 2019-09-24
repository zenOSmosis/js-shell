import changeCase from 'change-case';

const objPropsSnakeCaseToCamelCase = (inObj) => {
  const outObj = {};
  Object.keys(inObj).forEach((inKey) => {
    const convertedKey = changeCase.camelCase(inKey);

    outObj[convertedKey] = inObj[inKey];
  });

  return outObj;
};

export default objPropsSnakeCaseToCamelCase;
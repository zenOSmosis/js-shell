import changeCase from 'change-case';

const objPropsCamelCaseToSnakeCase = (inObj) => {
  const outObj = {};
  Object.keys(inObj).forEach((inKey) => {
    const convertedKey = changeCase.snakeCase(inKey);

    outObj[convertedKey] = inObj[inKey];
  });

  return outObj;
};

export default objPropsCamelCaseToSnakeCase;
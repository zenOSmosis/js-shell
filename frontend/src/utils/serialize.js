import serialize from 'serialize-javascript';

// @see https://www.npmjs.com/package/serialize-javascript#deserializing
const deserialize = (serializedJavaScript) => {
  try {
    return JSON.parse(serializedJavaScript);
  } catch (exc) {
    return eval('(' + serializedJavaScript + ')');
  }
};

export default serialize;
export {
  deserialize
};
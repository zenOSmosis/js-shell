/**
 * Retrieves an array of prototypes, starting from the original prototype and walking backward.
 * 
 * @see https://stackoverflow.com/questions/2242518/how-can-i-see-a-javascript-objects-prototype-chain
 * 
 * @param {object} object A class or instance. 
 */
const getPrototypeChain = (object) => {
  const _chain = [];
  
  const _getter = (object) => {
    const prototype = object.prototype || object.__proto__;

    if (prototype) {
      _chain.push(object);

      if (Object.getPrototypeOf(prototype) !== object) {  
        return _getter(prototype, object);
      }

    }
  };

  _getter(object);

  return _chain;
};

export default getPrototypeChain;
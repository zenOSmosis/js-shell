/**
 * Mixes properties and methods from child instances with a parent instance.
 * 
 * @param {Object} parentInstance Parent class instance.
 * @param {Object[]} childInstances Instances which will be mixed into the class instance.
 */
const mixin = (parentInstance, childInstances = []) => {
  const lenChildInstances = childInstances.length;

  // @see https://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
  const _getAllProps = (obj) => {
    let props = [];

    do {
      const l = Object.getOwnPropertyNames(obj)
        .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
        .sort()
        .filter((p, i, arr) =>
          /* typeof obj[p] === 'function' && */  // only the methods
          p !== 'constructor' &&           // not the constructor
          (i == 0 || p !== arr[i - 1]) &&  // not overriding in this prototype
          props.indexOf(p) === -1          // not overridden in a child
        );
      props = props.concat(l)
    } while (
      (obj = Object.getPrototypeOf(obj)) &&   // walk-up the prototype chain
      Object.getPrototypeOf(obj)              // not the the Object prototype methods (hasOwnProperty, etc...)
    );

    return props;
  }

  for (let i = 0; i < lenChildInstances; i++) {
    _getAllProps(childInstances[i]).forEach(propName => {
      parentInstance[propName] = childInstances[i][propName];
    });
  }
};

export default mixin;
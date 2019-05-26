/**
 * Returns the number of CPUs in the client system.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency
 *
 * @return {number}
 */
const getLogicalProcessors = () => {
  const logicalProcessors = window.navigator.hardwareConcurrency;
  return logicalProcessors;
};

export default getLogicalProcessors;
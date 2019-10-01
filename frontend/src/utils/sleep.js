  /**
   * @param {number} ms Number of milliseconds to sleep.
   */
  const sleep = (ms) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  export default sleep;
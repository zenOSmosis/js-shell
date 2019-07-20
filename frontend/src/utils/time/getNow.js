/**
 * @see https://stackoverflow.com/questions/30795525/performance-now-vs-date-now
 * Notes:
 * performance.now() is relative to page load and more precise in orders of
 * magnitude. Use cases include benchmarking and other cases where a high-
 * resolution time is required such as media (gaming, audio, video, etc.)
 * 
 * It should be noted that performance.now() is only available in newer
 * browsers (including IE10+).
 * 
 * Date.now() is relative to the Unix epoch (1970-01-01T00:00:00Z) and
 * dependent on system clock. Use cases include same old date manipulation
 * ever since the beginning of JavaScript.
 * 
 * TODO: Implement toggle for low / high performance
 */
const getNow = () => {
  return Date.now();

  // High precision comes at an up to 80% cost
  /*
  if (performance) {
    // High precision timer
    return performance.now();
  } else {
    return Date.now();
  }
  */
};

export default getNow;
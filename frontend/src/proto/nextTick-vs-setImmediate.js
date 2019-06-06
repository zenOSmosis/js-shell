// see http://plafer.github.io/2015/09/08/nextTick-vs-setImmediate/

console.log('Program started.');

setImmediate(function() {
  console.log('in immediate.');
  // another tick ends here
});

process.nextTick(function() {
  console.log('in nextTick.');
  // no tick ends here - another process.nextTick
  // would just append to the current tick's queue
});

console.log('end of first tick.');
// first tick ends here

// Output:
// Program started.
// end of first tick.
// in nextTick.
// in immediate.
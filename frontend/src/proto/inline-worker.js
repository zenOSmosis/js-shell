//  https://github.com/mohayonao/inline-worker/
// TODO: Consider swapping out internal handling for ClientWorkerProcess using
// this library

const InlineWorker = require("inline-worker");

let self = {};
let worker = new InlineWorker(function(self) {
  self.onmessage = function(e) {
    postMessage(self.bark(e.data)); // (2) hello!!
  };

  // worker internal function
  self.bark = function(msg) {
    return msg + "!!";
  };
}, self);

worker.onmessage = function(e) {
  console.log(e.data + "!!"); // (3) hello!!!!
};

worker.postMessage("hello"); // (1)
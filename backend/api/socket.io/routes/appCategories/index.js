const appCategories = require('../../../../utils/freedesktop.org/appCategories');

const requestAppCategories = async (options = {}, ack) => {
  try {
    ack(appCategories);
  } catch (exc) {
    // TODO: Pipe this up to ack
    throw exc;
  }
};

module.exports = requestAppCategories;
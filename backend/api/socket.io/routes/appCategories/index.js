const handleSocketRoute = require('../../utils/handleSocketRoute');
const appCategories = require('../../../../utils/freedesktop.org/appCategories');

const requestAppCategories = async (options = {}, ack) => {
  return /*await*/ handleSocketRoute(/*async*/ () => {
    return appCategories;
  }, ack);
};

module.exports = requestAppCategories;
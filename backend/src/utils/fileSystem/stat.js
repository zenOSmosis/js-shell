const fs = require('fs');

const stat = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        return resolve(undefined); // false;
      }

      fs.stat(filePath, (err, nodeStats) => {
        if (err) {
          return reject(err);
        }
      
        /*
        let stats = {};

        Object.keys(nodeStats).forEach((key) => {
          stats[key] = nodeStats[key];
        });
        */

        return resolve(nodeStats);
      });
    } catch (exc) {
      return reject(exc);
    }
  });
};

module.exports = stat;
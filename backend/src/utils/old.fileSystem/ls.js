const fs = require('fs');
const nodeJSPath = require('path');
const stat = require('./stat');
const fetchFSNodeDetail = require('./pathDetail');

const ls = (dirName) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirName, {
      // withFileTypes: true
    }, async (err, dirNodeNames) => {
      try {
        if (err) {
          return reject(err);
        }

        let retObjects = [];

        for (let i = 0; i < dirNodeNames.length; i++) {
          const nodeName = dirNodeNames[i];
          const absPathName = nodeJSPath.resolve(dirName, nodeName);

          const fsNodeDetail = await fetchFSNodeDetail(absPathName);

          retObjects.push(fsNodeDetail);
        }

        return resolve(retObjects);
      } catch (exc) {
        return reject(exc);
      }
    });
  });
};

module.exports = ls;
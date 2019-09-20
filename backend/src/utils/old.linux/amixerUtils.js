const ChildProcess = require('../old.ChildProcess');

const fetchAmixerContents = () => {
  return new Promise((resolve, reject) => {
    try {
      const proc = new ChildProcess('amixer', ['contents']);

      proc.on('stdout', (data) => {
        return resolve(data.toString());
      });

      proc.on('stderr', (data) => {
        return reject(data.toString());
      });
    } catch (exc) {
      return reject(exc);
    }
  });
};

const fetchMixerValues = async () => {
  try {
    let rawMixerContents = await fetchAmixerContents();

    const rawLines = rawMixerContents.split('\n');
    rawMixerContents = undefined;

    let rawInterfaces = [];
    let interfaceIdx = -1;

    rawLines.forEach((line, idx) => {
      if (line.startsWith('numid')) {
        interfaceIdx = rawInterfaces.length;

        rawInterfaces[interfaceIdx] = {};
      }
      rawInterfaces[interfaceIdx][idx] = line;
    });

    return rawInterfaces;

  } catch (exc) {
    throw exc;
  }
};

module.exports = {
  fetchAmixerContents,
  fetchMixerValues
};
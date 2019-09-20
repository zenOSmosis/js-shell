// @see https://www.npmjs.com/package/systeminformation
const {fetchSystemInformation: fSI, SYSINFO_MODES} = require('utils/systemInformation');

// TODO: Implement handleSocketRoute
const fetchSystemInformationModes = async (options = {}, ack) => {
  ack(SYSINFO_MODES);
};

const fetchSystemInformation = async (options = {}, ack) => {
  try {
    let {mode} = options;

    mode = (typeof mode === 'string' ? mode.toUpperCase() : undefined);

    const systemInformation = await fSI(mode);    

    ack(systemInformation);
  } catch (exc) {
    // TODO: Pipe this up to ack
    throw exc;
  }
};

module.exports = {
  fetchSystemInformation,
  fetchSystemInformationModes
};
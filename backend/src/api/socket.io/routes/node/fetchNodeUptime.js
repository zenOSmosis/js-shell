// Fetches uptime since the Node.js server started (not the host OS)

import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import getNodeUptime from 'utils/node/nodeUptime';

const fetchNodeUptime = async (options = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return getNodeUptime();
  }, ack);
};

export default fetchNodeUptime;
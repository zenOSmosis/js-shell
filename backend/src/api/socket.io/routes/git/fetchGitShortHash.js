const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
import { fetchGitShortHash as utilsFetchGitShortHash } from 'utils/git';

const fetchGitShortHash = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      return await utilsFetchGitShortHash();
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default fetchGitShortHash;
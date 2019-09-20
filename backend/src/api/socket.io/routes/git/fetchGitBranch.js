const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
import { fetchGitBranch as utilsFetchGitBranch } from 'utils/git';

const fetchGitBranch = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      return await utilsFetchGitBranch();
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default fetchGitBranch;
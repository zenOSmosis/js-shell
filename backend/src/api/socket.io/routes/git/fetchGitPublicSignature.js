const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
import { fetchGitPublicSignature as utilsFetchGitPublicSignature } from 'utils/git';

const fetchGitPublicSignature = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      return await utilsFetchGitPublicSignature();
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default fetchGitPublicSignature;
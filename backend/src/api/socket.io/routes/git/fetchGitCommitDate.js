import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import { fetchGitCommitDate as utilsFetchGitCommitDate } from 'utils/git';

const fetchGitCommitDate = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      return await utilsFetchGitCommitDate();
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default fetchGitCommitDate;
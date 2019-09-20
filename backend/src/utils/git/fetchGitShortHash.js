import getRootScriptsPath from '../getRootScriptsPath';
import execShellCommand from '../process/execShellCommand';

const fetchGitShortHash = async () => {
  try {
    const rootScriptsPath = getRootScriptsPath();

    return await execShellCommand(`${rootScriptsPath}/echo-git-short-hash.sh`);
  } catch (exc) {
    throw exc;
  }
};

export default fetchGitShortHash;
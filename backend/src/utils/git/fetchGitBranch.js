import getRootScriptsPath from '../getRootScriptsPath';
import execShellCommand from '../process/execShellCommand';

const fetchGitBranch = async () => {
  try {
    const rootScriptsPath = getRootScriptsPath();

    return await execShellCommand(`${rootScriptsPath}/echo-git-branch.sh`);
  } catch (exc) {
    throw exc;
  }
};

export default fetchGitBranch;
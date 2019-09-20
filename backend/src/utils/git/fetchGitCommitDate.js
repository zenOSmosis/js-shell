import getRootScriptsPath from '../getRootScriptsPath';
import execShellCommand from '../process/execShellCommand';

const fetchGitCommitDate = async () => {
  try {
    const rootScriptsPath = getRootScriptsPath();

    return await execShellCommand(`${rootScriptsPath}/echo-git-commit-date.sh`);
  } catch (exc) {
    throw exc;
  }
};

export default fetchGitCommitDate;
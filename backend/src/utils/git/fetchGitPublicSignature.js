import getRootScriptsPath from '../getRootScriptsPath';
import execShellCommand from '../process/execShellCommand';

const fetchGitPublicSignature = async () => {
  try {
    const rootScriptsPath = getRootScriptsPath();

    return await execShellCommand(`${rootScriptsPath}/echo-git-public-signature.sh`);
  } catch (exc) {
    throw exc;
  }
};

export default fetchGitPublicSignature;
// TODO: Convert to test cases

import fetchGitBranch from './fetchGitBranch';
import fetchGitCommitDate from './fetchGitCommitDate';
import fetchGitPublicSignature from './fetchGitPublicSignature';
import fetchGitShortHash from './fetchGitShortHash';

(async () => {
  try {
    const promises = [];
    promises.push(fetchGitBranch());
    promises.push(fetchGitCommitDate());
    promises.push(fetchGitPublicSignature());
    promises.push(fetchGitShortHash());

    const results = await Promise.all(promises);

    results.forEach(result => {
      console.log(result);
      console.log('/---');
    });
  } catch (exc) {
    throw exc;
  }
})();
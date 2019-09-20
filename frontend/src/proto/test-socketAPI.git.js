const { socketAPIQuery } = this.utils;

(async () => {
  try {
    const promises = [];
    promises.push(socketAPIQuery('api/fetch-git-branch'));
    promises.push(socketAPIQuery('api/fetch-git-commit-date'));
    promises.push(socketAPIQuery('api/fetch-git-public-signature'));
    promises.push(socketAPIQuery('api/fetch-git-short-hash'));

    const responses = await Promise.all(promises);

    console.log(responses);
  } catch (exc) {
    throw exc;
  }
})();
const { userInfo } = require('os');

const getLocalUsername = () => {
  const { username } = userInfo();
  return username;
};

export default getLocalUsername;
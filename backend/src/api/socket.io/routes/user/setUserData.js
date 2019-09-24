// TODO: Set user data in utils/user/setUserData
// TODO: Broadcast user update to all connected users, if public data exists
import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';

import dbSetUserData from 'utils/mongo/collections/users/setUserData';

const setUserData = async (userData, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      await dbSetUserData(userData);
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default setUserData;
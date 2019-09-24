import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import { fetchConnectedUsers as dbFetchConnectedUsers } from 'utils/mongo/collections/users';

const fetchConnectedUsers = async (socket, ack) => {
  return await handleSocketAPIRoute(async () => {
    const connectedUsers = await dbFetchConnectedUsers(socket.id);

    return connectedUsers;
  }, ack);
};

export default fetchConnectedUsers;
import { SOCKET_API_ROUTE_SOCKET_FS } from 'shared/socketAPI/socketAPIRoutes';
import { socketAPIQuery } from 'utils/socketAPI';

const socketFSCall = async (socketFSMethod, ...socketFSArgs)  => {
  try {
    return await socketAPIQuery(SOCKET_API_ROUTE_SOCKET_FS, {
      socketFSMethod,
      socketFSArgs: [...socketFSArgs]
    });
  } catch (exc) {
    throw exc;
  }
};

export default socketFSCall;
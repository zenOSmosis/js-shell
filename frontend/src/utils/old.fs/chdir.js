import { SOCKET_API_ROUTE_FILESYSTEM } from 'shared/socketAPI/socketAPIRoutes';
import socketAPIQuery from '../socketAPI/socketAPIQuery';

const chdir = async (dirName) => {
  try {
    const requestData = {
      methodName: 'chdir',
      dirName
    };
    
    return await socketAPIQuery(SOCKET_API_ROUTE_FILESYSTEM, requestData);
  } catch (exc) {
    throw exc;
  }
};

export default chdir;
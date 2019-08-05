import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';
import socketAPIQuery from '../socketAPI/socketAPIQuery';

const ls = async (dirName) => {
  try {
    const requestData = {
      methodName: 'ls',
      dirName
    };
    
    return await socketAPIQuery(socketAPIRoutes.SOCKET_API_ROUTE_FILESYSTEM, requestData);
  } catch (exc) {
    throw exc;
  }
};

export default ls;


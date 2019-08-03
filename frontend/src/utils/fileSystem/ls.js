import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';
import socketQuery from '../socketQuery';

const ls = async (dirName) => {
  try {
    const requestData = {
      methodName: 'ls',
      dirName
    };
    
    return await socketQuery(socketAPIRoutes.SOCKET_API_ROUTE_FILESYSTEM, requestData);
  } catch (exc) {
    throw exc;
  }
};

export default ls;


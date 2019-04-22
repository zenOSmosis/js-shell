import socketAPIRoutes from '../socketAPIRoutes';
import socketQuery from '../socketQuery';

const chdir = async (dirName) => {
  try {
    const requestData = {
      methodName: 'chdir',
      dirName
    };
    
    return await socketQuery(socketAPIRoutes.SOCKET_API_ROUTE_FILESYSTEM, requestData);
  } catch (exc) {
    throw exc;
  }
};

export default chdir;
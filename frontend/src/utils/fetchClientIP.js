import config from '../config';
const { HOST_REST_URI } = config;

/**
 * Fetches the IP address of the client, relative to the server.
 * 
 * @return {string} IPV4 or IPV6 address, depending on network.
 */
const fetchClientIP = async () => {
  try {
    const res = await fetch(`${HOST_REST_URI}/client/ip`);
    const clientIP = await res.text();

    return clientIP;
  } catch (exc) {
    throw exc;
  }
};

export default fetchClientIP;
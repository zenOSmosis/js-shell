import config from '../config';
const { HOST_REST_URI } = config;

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
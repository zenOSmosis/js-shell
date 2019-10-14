
/**
 * @typedef {Object} RandomUserDOB
 * @property {string} date
 * @property {number} age
 */

/**
 * @typedef {Object} RandomUserName
 * @property {string} title
 * @property {string} first
 * @property {string} last
 */

/**
 * @typedef {Object} RandomUser
 * @property {string} cell
 * @property {RandomUserDOB} dob
 * @property {string} email
 * @property {string} gender
 * // ...
 * @property {RandomUserName} name
 */

/**
 * Fetches an array of random users, as provided by randomuser.me
 * 
 * @see https://randomuser.me
 * 
 * @param {number} maxUsers? [default = 25]
 * @return {Promise<RandomUser[]>}
 */
const fetchRandomUsers = async (maxUsers = 25) => {
  try {
    maxUsers = parseInt(maxUsers, 10);

    const apiResp = await fetch(`https://randomuser.me/api/?results=${maxUsers}`);

    const { results: randomUsers } = await apiResp.json();

    return randomUsers;
  } catch (exc) {
    throw exc;
  }
};

export default fetchRandomUsers;
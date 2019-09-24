import fetchCollectionWithName from '../../fetchCollectionWithName';

const USERS_COLLECTION_NAME = 'users';

const fetchUsersCollection = async () => {
  try {
    const collection = await fetchCollectionWithName(USERS_COLLECTION_NAME);

    return collection;
  } catch (exc) {
    throw exc;
  }
};

export default fetchUsersCollection;
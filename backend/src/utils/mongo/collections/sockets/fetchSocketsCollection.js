import fetchCollectionWithName from '../../fetchCollectionWithName';

const SOCKETS_COLLECTION_NAME = 'sockets';

const fetchSocketsCollection = async () => {
  try {
    const collection = await fetchCollectionWithName(SOCKETS_COLLECTION_NAME);

    return collection;
  } catch (exc) {
    throw exc;
  }
};

export default fetchSocketsCollection;
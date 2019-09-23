import mongoClientConnect from './mongoClientConnect';

const fetchCollectionWithName = async (collectionName) => {
  try {
    const mongoClient = await mongoClientConnect();

    const db = mongoClient.db();
    const collection = db.collection(collectionName);

    return collection;
  } catch (exc) {
    throw exc;
  }
};

export default fetchCollectionWithName;
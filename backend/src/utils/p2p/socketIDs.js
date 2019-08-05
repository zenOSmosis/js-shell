let _socketIDs = [];

const addSocketID = (socketID) => {
  _socketIDs.push(socketID);
};

const removeSocketID = (socketID) => {
  // TODO: Remove in place
  _socketIDs = _socketIDs.filter(testSocketID => {
    return socketID !== testSocketID;
  });
};

const getSocketIDs = () => {
  return _socketIDs;
};

module.exports = {
  addSocketID,
  removeSocketID,
  getSocketIDs
};
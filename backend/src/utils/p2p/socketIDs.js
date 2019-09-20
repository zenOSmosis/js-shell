let _socketIDs = [];

// TODO: Use Redis backend instead

const addSocketID = (socketID) => {
  _socketIDs.push(socketID);
};

const removeSocketID = (socketID) => {
  const idxSocketID = _socketIDs.indexOf(socketID);

  if (idxSocketID === -1) {
    return;
  }

  _socketIDs.splice(idxSocketID, 1);
};

const getSocketIDs = () => {
  return _socketIDs;
};

export {
  addSocketID,
  removeSocketID,
  getSocketIDs
};
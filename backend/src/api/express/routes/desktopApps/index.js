const {Router} = require('express');
const router = new Router();
const path = require('path');

// TODO: Set header file name as same file name in request

const sendFile = (req, res) => {
  //const {filePath: paramsFilePath} = req.params;
  const {filePath} = req.query;

  // const filePath = queryFilePath || paramsFilePath;
  
  // TODO: Determine if file exists before trying to send

  if (!filePath) {
    res.status(404);
  } else {
    res.sendFile(path.resolve(__dirname, 'TEST../../TEST../../../frontend/src/apps', filePath));
  }
};

// Params-based URL
// router.get('/app/:filePath', sendFile);

// Query-based URL
router.get('/', sendFile);

module.exports = router;
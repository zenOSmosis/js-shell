const {Router} = require('express');
const router = new Router();

// TODO: Set header file name as same file name in request

const sendFile = (req, res) => {
  const {filePath} = req.params || req.query;
  
  // TODO: Determine if file exists before trying to send

  if (!filePath) {
    res.status(404);
  } else {
    res.sendFile(filePath);
  }
};

router.get('/filePath/:filePath', (req, res) => {
  res.sendFile(req.params.filePath);
});

router.get('/', (req, res) => {
  res.sendFile(req.query.filePath);
});

module.exports = router;
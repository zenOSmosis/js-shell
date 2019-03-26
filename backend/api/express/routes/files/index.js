const {Router} = require('express');
const router = new Router();

// TODO: Send file of the same name as the file request

const sendFile = (req, res) => {
  const {filePath} = req.params || req.query;
  

  res.sendFile(filePath);
};

router.get('/filePath/:filePath', (req, res) => {
  res.sendFile(req.params.filePath);
});

router.get('/', (req, res) => {
  res.sendFile(req.query.filePath);
});

module.exports = router;
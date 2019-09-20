import { Router } from 'express';
const router = new Router();

// TODO: Set header file name as same file name in request

const sendFile = (req, res) => {
  const { filePath: paramsFilePath } = req.params;
  const { filePath: queryFilePath } = req.query;

  const filePath = queryFilePath || paramsFilePath;

  // TODO: Determine if file exists before trying to send

  console.log('asking for', filePath);

  if (!filePath) {
    res.status(404);
  } else {
    res.sendFile(filePath);
  }
};

// Params-based URL
router.get('/filePath/:filePath', sendFile);

// Query-based URL
router.get('/', sendFile);

export default router;
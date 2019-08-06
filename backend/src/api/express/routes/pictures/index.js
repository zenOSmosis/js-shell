const {Router} = require('express');
const router = new Router();
const path = require('path');

// TODO: Set header file name as same file name in request

const sendIcon = (req, res) => {
  const {iconName: paramsIconName} = req.params;
  const {iconName: queryIconName} = req.query;

  const iconName = paramsIconName || queryIconName;

  if (iconName.includes('..')) {
    res.status(404);
    res.send('..');
    return;
  }
  
  // TODO: Determine if file exists before trying to send
  const filePath = path.resolve(__dirname, '../../../../public/pictures', iconName);

  if (!filePath) {
    res.status(404);
  } else {
    res.sendFile(filePath);
  }
};

router.get('/pictures/:iconName', sendIcon);
router.get('/', sendIcon);

module.exports = router;
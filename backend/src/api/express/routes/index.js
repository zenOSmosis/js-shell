const {Router} = require('express');
const router = new Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, AuthToken");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const client = require('./client');
router.use('/client', client);

const desktopApps = require('./desktopApps');
router.use('/desktopApps', desktopApps);

const files = require('./files');
router.use('/files', files);

const icons = require('./icons');
router.use('/icons', icons);

const pictures = require('./pictures');
router.use('/pictures', pictures);

const auth = require('./auth');
router.use('/auth', auth);



module.exports = router;

const {Router} = require('express');
const router = new Router();

const files = require('./files');
router.use('/files', files);

const icons = require('./icons');
router.use('/icons', icons);

module.exports = router;

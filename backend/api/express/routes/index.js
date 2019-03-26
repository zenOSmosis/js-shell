const {Router} = require('express');
const router = new Router();

const files = require('./files');
router.use('/files', files);

module.exports = router;

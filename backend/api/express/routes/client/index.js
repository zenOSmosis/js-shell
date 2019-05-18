const {Router} = require('express');
const router = new Router();

/**
 * Retrieve the client's IP address.
 */
router.get('/ip', (req, res) => {
  const {clientIP} = req;

  res.send(clientIP);
});

module.exports = router;
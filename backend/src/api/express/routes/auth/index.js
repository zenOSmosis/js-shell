import { Router } from 'express';
const router = new Router();

/**
 * Fake login service.
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('login request', username, password)
  if (username == 'admin' && password == 'admin') {
    res.session = { user: username };
    res.status(200).send({ ok: true });
  } else {
    res.status(200).send({ error: 'not authorized' });
  }
});

export default router;
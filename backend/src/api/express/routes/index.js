import Router from 'express';
import auth from './auth';
import clientRoutes from './client';
import fileRoutes from './files';

const router = new Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, AuthToken');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

router.use('/auth', auth);

router.use('/client', clientRoutes);

// const desktopApps = require('./desktopApps');
// router.use('/desktopApps', desktopApps);

router.use('/files', fileRoutes);

// const icons = require('./icons');
// router.use('/icons', icons);

// const pictures = require('./pictures');
// router.use('/pictures', pictures);

export default router;

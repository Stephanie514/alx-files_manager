// routes/index.js

import express from 'express';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

export default (app) => {
  app.use('/', router);
};

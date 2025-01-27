import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

/**
 * Routes- requests the appropriate controller based on URL
 *
 * @param {express.Application} app - The express application object.
 */
function controllerRouting(app) {
  const router = express.Router();

  // AppController
  // Route which should return status of Redis and DB
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Route to return number of users and files in the DB
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // UsersController
  // Should create a new user document in DB
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // Route to return user document based on token
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  // AuthController
  // Route to return user document based on token
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // Route to return user document based on token
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // FilesController
  // Routes to handle file operations
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  // Uncommented routes (to be implemented or removed)

  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  router.get('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });

  // Mounting the router at the root path
  app.use('/', router);
}

export default controllerRouting;

const logger = require('../utilities/logger');

const auth = require('../middlewares/auth');

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const recipesRoutes = require('./recipes');
const storageRoutes = require('./storage');
const categoriesRoutes = require('./categories');

module.exports = (app, express) => {

  app.use('/api/auth', authRoutes(express, auth));
  app.use('/api/users', usersRoutes(express, auth));
  app.use('/api/storage', storageRoutes(express, auth));
  app.use('/api/recipes', recipesRoutes(express, auth));
  app.use('/api/categories', categoriesRoutes(express, auth));

  /**
   * The default error handler when all route matching has failed
   */
  app.use((err, req, res, next) => {

    logger.error('Error handler', err);

    if (res.headersSent) {
      next(err);
    } else if (err.name) {
      res.status(err.status || 403).send({
        message: err.message,
        status: err.status,
        success: false
      });
    } else {
      res.status(500).send(err);
    }
  });
};
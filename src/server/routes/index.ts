import { Application } from 'express';
import blahRoutes from './blah-routes';

function configure(app: Application) {
  app.use('/api/blah', blahRoutes);
}

export default {
  configure
};

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import pino from 'pino';

import middleware from './routes/middleware';
import routes from './routes';

const logger = pino();

async function main() {
  const app = express();

  // Add top level middleware
  middleware.configure(app);

  // Setup all API routes
  routes.configure(app);

  middleware.configureErrorMiddleware(app);

  const port = process.env.PORT || 9000;
  try {
    app.listen(port, () => {
      logger.info(`listening on port ${port}`);
    });
  } catch (error) {
    logger.error('Uncaught error: ', error);
  }
}

main().catch((error: any) => {
  logger.error('Fatal error occured: ', error);
});

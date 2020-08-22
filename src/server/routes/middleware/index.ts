import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';

import { requestLoggerMiddleware } from './request-logging-middlware';
import { errorMiddleware } from './error-middleware';

function configure(app: Application) {
  // Helmet for sane default security headers.
  app.use(helmet());
  app.use(cors());
  app.use(requestLoggerMiddleware());
  app.use(express.json());
}

function configureErrorMiddleware(app: Application) {
  app.use(errorMiddleware);
}

export default {
  configure,
  configureErrorMiddleware
};

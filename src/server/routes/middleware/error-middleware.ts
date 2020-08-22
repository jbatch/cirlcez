import express from 'express';
import { ServiceError } from '../../error/service-error';
import pino from 'pino';

const logger = pino();

function errorMiddleware(error: Error, req: Express.Request, res: express.Response, next: any) {
  logger.error('Hit error-middleware: ' + JSON.stringify(error));
  if (error instanceof ServiceError) {
    res.status(error.statusCode || 500);
    res.json({ error: error.message });
  } else {
    res.status(500);
    res.json({ error: error.message, stack: error.stack });
  }
}

export { errorMiddleware };

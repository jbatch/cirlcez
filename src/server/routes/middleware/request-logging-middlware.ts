import expressPino from 'express-pino-logger';
import pino from 'pino';

function requestLoggerMiddleware() {
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: ['req.headers', 'req.remoteAddress', 'req.remotePort', 'res.headers'],
      remove: true
    }
  });
  return expressPino({ logger });
}

export { requestLoggerMiddleware };

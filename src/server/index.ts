import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import pino from 'pino';

import middleware from './routes/middleware';
import routes from './routes';
import Game from './game/game';
import { configureSockets } from './sockets/sockets';
import http from 'http';

const logger = pino();

async function main() {
  const app = express();
  const server = http.createServer(app);

  // Add top level middleware
  middleware.configure(app);

  // Setup all API routes
  routes.configure(app);

  middleware.configureErrorMiddleware(app);

  // Create single instance of game for all players to use
  const game = new Game();

  // Initalize socketIO
  configureSockets(server, game);

  const port = Number(process.env.PORT) || 9000;
  const host = process.env.HOST || 'localhost';
  try {
    server.listen(port, host, () => {
      logger.info(`listening on ${host}:${port}`);
    });
  } catch (error) {
    logger.error('Uncaught error: ', error);
  }
}

main().catch((error: any) => {
  logger.error('Fatal error occured: ', error);
});

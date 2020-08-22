import socketIo from 'socket.io';
import http from 'http';
import pino from 'pino';
import Game from '../game/game';
import { Socket } from 'socket.io';
import { getSafeSocket } from './safe-socket';

const logger = pino();

export function configureSockets(appServer: http.Server, game: Game) {
  const server = socketIo(appServer);

  server.on('connect', (client: socketIo.Socket & { username: string }) => {
    const safeSocket = getSafeSocket(client, server);

    // Setup event listeners for client
    safeSocket.safeOn('join', handleJoin);
    safeSocket.safeOn('disconnect', handleDisconnect);
    safeSocket.safeOn('input', handleInput);

    function handleJoin({ username }: JoinMessage) {
      logger.info(`${client.id} (${username}) joining game`);
      client.username = username;
      // Put player in game.
      game.addPlayer(safeSocket, username);
    }

    function handleDisconnect() {
      logger.info(`${client.id} (${client.username || 'unknown'}) disconnected`);
      // Remove player from game.
      game.removePlayer(safeSocket);
    }

    function handleInput(input: InputMessage) {
      game.handleInput(safeSocket, input);
    }
  });
}

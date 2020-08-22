import socketIo from 'socket.io';
import http from 'http';
import pino from 'pino';
import Game from '../game/game';

const logger = pino();

export function configureSockets(appServer: http.Server, game: Game) {
  const server = socketIo(appServer);

  server.on('connect', (client: socketIo.Socket & {username: string}) => {
    const { safeEmit, safeOn, safeRoomEmit } = getSafeSocketFunctions(
      client,
      server
    );

    // Setup event listeners for client
    safeOn('join', handleJoin);
    safeOn('disconnect', handleDisconnect);

    async function handleJoin({ username }: JoinMessage) {
      logger.info(`${client.id} (${username}) joining game`);
      client.username = username;
      // Put player in game.
    }
    
    async function handleDisconnect() {
      logger.info(`${client.id} (${client.username || 'unknown'}) disconnected`);
      // remove player from game.
    }
  });
}

function getSafeSocketFunctions(
  client: socketIo.Socket,
  server: socketIo.Server
) {
  function safeEmit<Event extends keyof SocketEvents>(
    event: Event,
    payload?: SocketEvents[Event]
  ) {
    client.emit(event, payload);
  }
  function safeOn<Event extends keyof SocketEvents>(
    event: Event,
    callback: (payload?: SocketEvents[Event]) => void
  ) {
    client.on(event, callback);
  }
  function safeRoomEmit<Event extends keyof SocketEvents>(
    roomCode: string,
    event: Event,
    payload?: SocketEvents[Event]
  ) {
    server.to(roomCode).emit(event, payload);
  }
  return { safeEmit, safeOn, safeRoomEmit };
}

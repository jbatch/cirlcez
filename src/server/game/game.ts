import Player from './player';
import { SafeSocket } from '../sockets/safe-socket';
import pino from 'pino';
import Constants from '../../shared/constants';

const FRAMES_PER_SECOND = 30; // 60;

const logger = pino();

export default class Game {
  sockets: { [id: string]: SafeSocket };
  players: { [id: string]: Player };
  lastUpdatedTime: number;
  shouldSendUpdate: boolean;
  constructor() {
    this.sockets = {};
    this.players = {};
    this.lastUpdatedTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / FRAMES_PER_SECOND);

    // Add bot player
  }

  addPlayer(socket: SafeSocket, username: string) {
    this.sockets[socket.id] = socket;
    const color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    const [x, y] = [
      (Math.random() * (0.8 - 0.2) + 0.2) * Constants.MAP_SIZE,
      (Math.random() * (0.8 - 0.2) + 0.2) * Constants.MAP_SIZE,
    ];
    this.players[socket.id] = new Player(socket.id, color, username, x, y, 0);
  }

  removePlayer(socket: SafeSocket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket: SafeSocket, { dir }: InputMessage) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdatedTime) / 1000;
    const lastUpdate = this.lastUpdatedTime;
    this.lastUpdatedTime = now;

    // Update all playerz
    Object.values(this.players).forEach((player) => {
      player.update(dt);
    });

    // Apply collisions
    this.applyCollisions(Object.values(this.players));

    // Remove all players that died and send updated state to all players
    Object.entries(this.players).forEach(([id, player]) => {
      const socket = this.sockets[id];
      if (!player.alive) {
        if (socket) {
          socket.safeEmit('game-over', {});
        }
        this.removePlayer(socket);
        return;
      }
      if (socket) {
        socket.safeEmit('game-state', {
          t: Date.now(),
          serverFps: 1 / dt,
          me: player.serializeForUpdate(),
          others: Object.values(this.players)
            .filter((p) => p.id != player.id)
            .map((p) => p.serializeForUpdate()),
        });
      }
    });
  }

  applyCollisions(players: Array<Player>) {
    // Check every paid of players for collision
    for (let p1 of players) {
      if (!p1.alive) {
        continue;
      }
      for (let p2 of players) {
        if (!p2.alive || p1.id === p2.id) {
          continue;
        }
        if (p1.distanceTo(p2) < p1.size + p2.size) {
          // Collision occured.
          if (p1.size > p2.size) {
            p1.setSize(p1.size + 10);
            p2.setAlive(false);
          } else if (p2.size >= p1.size) {
            p2.setSize(p2.size + 10);
            p1.setAlive(false);
          }
        }
      }
    }
  }
}

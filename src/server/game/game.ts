import Player from './player';
import { SafeSocket } from '../sockets/safe-socket';

const FRAMES_PER_SECOND = 60; // 60;

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
  }

  addPlayer(socket: SafeSocket, username: string) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, '#FF0000', username, 0, 0, 0);
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
    this.lastUpdatedTime = now;

    // Update all playerz
    Object.values(this.players).forEach((player) => {
      player.update(dt);
    });

    // Apply collisions
    this.applyCollisions(Object.values(this.players));

    // Remove all players that died and send updated state to all players
    Object.entries(this.sockets).forEach(([id, socket]) => {
      const player = this.players[id];
      if (!player.alive) {
        socket.safeEmit('game-over', {});
        this.removePlayer(socket);
        return;
      }
      socket.safeEmit('game-state', {
        t: Date.now(),
        me: player.serializeForUpdate(),
        others: Object.values(this.players)
          .filter((p) => p.id != player.id)
          .map((p) => p.serializeForUpdate()),
      });
    });
  }

  applyCollisions(players: Array<Player>) {
    // Check every paid of players for collision
    for (let p1 of players) {
      if (!p1.alive) {
        continue;
      }
      for (let p2 of players) {
        if (!p2.alive) {
          continue;
        }
        if (p1.distanceTo(p2) < p1.size + p2.size) {
          // Collision occured.
          if (p1.size > p2.size) {
            p1.setSize(p1.size + 1);
            p2.setAlive(false);
          } else if (p2.size > p1.size) {
            p2.setSize(p1.size + 1);
            p1.setAlive(false);
          }
        }
      }
    }
  }
}

import Player from './player';
import { SafeSocket } from '../sockets/safe-socket';

const FRAMES_PER_SECOND = 1 // 60;

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
    this.players[socket.id] = new Player(socket.id, '#FF0000',username, 0, 0, 0);
  }

  removePlayer(socket: SafeSocket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket: SafeSocket, {dir}: InputMessage) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
     // Calculate time elapsed
     const now = Date.now();
     const dt = (now - this.lastUpdatedTime) / 1000;
     this.lastUpdatedTime = now;

    Object.values(this.players).forEach(player => {
      player.update(dt);
    })

    // Send updated state to all players
    Object.entries(this.sockets).forEach(([id, socket]) => {
      const player = this.players[id];
      socket.safeEmit('game-state', {t: Date.now(), me: player.serializeForUpdate()})
    })
  }
}

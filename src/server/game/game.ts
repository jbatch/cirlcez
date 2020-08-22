import { Socket } from 'socket.io';
import Player from './player';

const FRAMES_PER_SECOND = 1 // 60;

export default class Game {
  sockets: { [id: string]: Socket };
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

  update() {
    console.log('Updating state');
  }
}

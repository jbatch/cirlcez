import Entity from './entity';
import Constants from '../../shared/constants';

export default class Player extends Entity {
  username: string;
  color: string;
  size: number;
  throttle: number;
  maxSpeed: number;
  alive: boolean;
  constructor(id: string, color: string, username: string, x: number, y: number, dir: number) {
    super(id, x, y, dir, 250);
    this.username = username;
    this.color = color;
    this.alive = true;
    this.size = 20 + Math.random() * 10;
    this.throttle = 0;
    this.maxSpeed = 250;
  }

  update(dt: number) {
    super.update(dt);

    // Make sure the player stays in bounds
    this.x = Math.max(0 + this.size, Math.min(Constants.MAP_SIZE - this.size, this.x));
    this.y = Math.max(0 + this.size, Math.min(Constants.MAP_SIZE - this.size, this.y));
  }

  setSize(size: number) {
    this.size = size;
  }

  setThrottle(throttle: number) {
    this.throttle = throttle;
    this.speed = this.maxSpeed * throttle;
  }

  setMaxSpeed(maxSpeed: number) {
    this.maxSpeed = maxSpeed;
  }

  setAlive(alive: boolean) {
    this.alive = alive;
  }

  serializeForUpdate(): PlayerState {
    return {
      ...super.serializeForUpdate(),
      username: this.username,
      color: this.color,
      size: this.size,
    };
  }
}

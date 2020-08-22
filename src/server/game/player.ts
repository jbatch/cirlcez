import Entity from './entity';

export default class Player extends Entity {
  username: string;
  color: string;
  size: number;
  alive: boolean;
  constructor(id: string, username: string, color: string, x: number, y: number, dir: number) {
    super(id, x, y, dir, 250);
    this.username = username;
    this.color = color;
    this.alive = true;
  }

  update(dt: number) {
    super.update(dt);
  }

  setSize(size: number) {
    this.size = size;
  }

  setAlive(alive: boolean) {
    this.alive = alive;
  }

  serializeForUpdate(): PlayerState {
    return {
      ...super.serializeForUpdate(),
      username: this.username,
      color: this.color,
    };
  }
}

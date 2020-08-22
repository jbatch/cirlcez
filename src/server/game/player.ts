import Entity from './entity'

export default class Player  extends Entity {
  id: string;
  username: string;
  color: string;
  x: number;
  y: number;
  dir: number;
  constructor(id: string, username: string, color: string, x: number, y: number, dir: number) {
    super(id, x, y, dir, 10);
    this.username = username;
    this.color = color;
  }

  update(dt: number) {
    super.update(dt);
  }

  setDirection(dir: number) {
    this.dir = dir;
  }

  serializeForUpdate(): PlayerState {
    return {
      ...(super.serializeForUpdate()),
      username: this.username,
      color: this.color,
    };
  }
  
}

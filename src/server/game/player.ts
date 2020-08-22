export default class Player {
  id: string;
  username: string;
  color: string;
  x: number;
  y: number;
  dir: number;
  constructor(id: string, username: string, color: string, x: number, y: number, dir: number) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  setDirection(dir: number) {
    this.dir = dir;
  }

  serializeForUpdate(): PlayerState {
    return {
      id: this.id,
      username: this.username,
      color: this.color,
      x: this.x,
      y: this.y,
    };
  }
  
}
